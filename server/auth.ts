import type { Express, Request, Response } from "express";
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { and, eq, gt, lt } from "drizzle-orm";
import { authCredentialsSchema, authSessions, users, type DbUser, type PublicUser } from "@shared/schema";
import { db } from "./db";

// LOCAL DEMO AUTH ONLY.
// This slice exists so the weekend bakeoff demo can create users with
// username/password on a local machine. It is not a hosted secure beta:
// no HTTPS, no rate limiting, no account recovery. The production path is
// Supabase Auth (see apps/chekhov-toolkit-ionic/docs/local-demo-auth.md).

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const SCRYPT_KEYLEN = 64;
const SESSION_COOKIE = "mct_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = storedHash.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function toPublicUser(user: Pick<DbUser, "id" | "username" | "createdAt">): PublicUser {
  return { id: user.id, username: user.username, createdAt: user.createdAt };
}

function readSessionToken(req: Request): string | null {
  const header = req.headers.cookie;
  if (!header) return null;

  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      const value = rest.join("=");
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

function createSession(res: Response, userId: string): void {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  // Opportunistically drop expired sessions so the demo DB does not grow forever.
  db.delete(authSessions).where(lt(authSessions.expiresAt, now.toISOString())).run();

  db.insert(authSessions)
    .values({
      tokenHash: hashSessionToken(token),
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    .run();

  // `secure` is intentionally false: this demo runs over plain http on
  // localhost only. A hosted deployment must set secure cookies (or move to
  // Supabase Auth entirely).
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS,
  });
}

function clearSession(req: Request, res: Response): void {
  const token = readSessionToken(req);
  if (token) {
    db.delete(authSessions).where(eq(authSessions.tokenHash, hashSessionToken(token))).run();
  }
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function getSessionUser(req: Request): PublicUser | null {
  const token = readSessionToken(req);
  if (!token) return null;

  const session = db
    .select()
    .from(authSessions)
    .where(
      and(
        eq(authSessions.tokenHash, hashSessionToken(token)),
        gt(authSessions.expiresAt, new Date().toISOString()),
      ),
    )
    .get();
  if (!session) return null;

  const user = db
    .select({ id: users.id, username: users.username, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, session.userId))
    .get();
  return user ? toPublicUser(user) : null;
}

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/signup", async (req, res) => {
    const parsed = authCredentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid credentials" });
    }

    const username = parsed.data.username.toLowerCase();
    const existing = db.select({ id: users.id }).from(users).where(eq(users.username, username)).get();
    if (existing) {
      return res.status(409).json({ error: "That username is already taken" });
    }

    try {
      const passwordHash = await hashPassword(parsed.data.password);
      const user = {
        id: randomUUID(),
        username,
        passwordHash,
        createdAt: new Date().toISOString(),
      };
      db.insert(users).values(user).run();

      createSession(res, user.id);
      res.status(201).json({ user: toPublicUser(user) });
    } catch (error) {
      console.error("Error creating local demo account:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    const parsed = authCredentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Enter a username and password" });
    }

    try {
      const username = parsed.data.username.toLowerCase();
      const user = db.select().from(users).where(eq(users.username, username)).get();
      const passwordMatches = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;

      if (!user || !passwordMatches) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      createSession(res, user.id);
      res.json({ user: toPublicUser(user) });
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    clearSession(req, res);
    res.json({ ok: true });
  });

  app.get("/api/auth/me", (req, res) => {
    res.json({ user: getSessionUser(req) });
  });
}
