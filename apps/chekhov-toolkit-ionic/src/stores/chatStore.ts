import { requireSupabase, supabase } from '@/lib/supabaseClient';
import type { ChatMessage, ChatRoom, ChatRoomKind, ChatRoomMember } from '@/types/chat';

const ROOM_COLUMNS = 'id, name, kind, created_by, invite_code, archived_at, created_at';
const MESSAGE_COLUMNS = 'id, room_id, sender_id, sender_name, body, created_at';

export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_ROOM_NAME_LENGTH = 80;

interface ChatRoomRow {
  id: string;
  name: string;
  kind: ChatRoomKind;
  created_by: string;
  invite_code: string;
  archived_at: string | null;
  created_at: string;
}

interface ChatRoomMemberRow {
  room_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
}

interface ChatMessageRow {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

/**
 * Room creation is restricted to explicitly authorized creators (initially
 * Dawson and Lisa). RLS enforces this on insert; this read only decides whether
 * the app shows the create-room affordance.
 */
export async function canCreateRooms(): Promise<boolean> {
  const userId = await getSignedInUserId();
  if (!userId) return false;

  const { data, error } = await requireSupabase()
    .from('chat_room_creators')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function listMyRooms(): Promise<ChatRoom[]> {
  const userId = await getSignedInUserId();
  if (!userId) return [];

  const { data, error } = await requireSupabase()
    .from('chat_rooms')
    .select(ROOM_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ((data ?? []) as ChatRoomRow[]).map(mapRoomRow);
}

export async function getRoom(roomId: string): Promise<ChatRoom | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const { data, error } = await requireSupabase()
    .from('chat_rooms')
    .select(ROOM_COLUMNS)
    .eq('id', roomId)
    .maybeSingle();

  if (error) throw error;

  return data ? mapRoomRow(data as ChatRoomRow) : null;
}

export async function createRoom(name: string, kind: ChatRoomKind): Promise<ChatRoom | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > MAX_ROOM_NAME_LENGTH) {
    throw new Error(`Room names must be 1-${MAX_ROOM_NAME_LENGTH} characters.`);
  }

  // invite_code is overwritten server-side by the chat_rooms_defaults trigger;
  // the placeholder only satisfies the not-null column on insert.
  const { data, error } = await requireSupabase()
    .from('chat_rooms')
    .insert({
      created_by: userId,
      name: trimmed,
      kind,
      invite_code: 'pending',
    })
    .select(ROOM_COLUMNS)
    .single();

  if (error) throw error;

  return mapRoomRow(data as ChatRoomRow);
}

/** Join a room by invite code via the server-side definer RPC. */
export async function joinRoomByCode(code: string): Promise<string | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const trimmed = code.trim();
  if (!trimmed) throw new Error('Enter an invite code.');

  const { data, error } = await requireSupabase().rpc('join_chat_room', { code: trimmed });

  if (error) throw error;

  return (data as string | null) ?? null;
}

export async function listRoomMembers(roomId: string): Promise<ChatRoomMember[]> {
  const userId = await getSignedInUserId();
  if (!userId) return [];

  const { data, error } = await requireSupabase()
    .from('chat_room_members')
    .select('room_id, user_id, role, joined_at')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as ChatRoomMemberRow[]).map((row) => ({
    roomId: row.room_id,
    userId: row.user_id,
    role: row.role,
    joinedAt: row.joined_at,
  }));
}

export async function listRoomMessages(roomId: string, limit = 200): Promise<ChatMessage[]> {
  const userId = await getSignedInUserId();
  if (!userId) return [];

  const { data, error } = await requireSupabase()
    .from('chat_messages')
    .select(MESSAGE_COLUMNS)
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as ChatMessageRow[]).map(mapMessageRow).reverse();
}

export async function sendMessage(roomId: string, body: string): Promise<ChatMessage | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const trimmed = body.trim();
  if (!trimmed) throw new Error('Message is empty.');
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`);
  }

  const { data, error } = await requireSupabase()
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: userId,
      body: trimmed,
    })
    .select(MESSAGE_COLUMNS)
    .single();

  if (error) throw error;

  return mapMessageRow(data as ChatMessageRow);
}

export async function leaveRoom(roomId: string): Promise<void> {
  const userId = await getSignedInUserId();
  if (!userId) return;

  const { error } = await requireSupabase()
    .from('chat_room_members')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) throw error;
}

/** Neutral fallback when the sender has no usable display name. */
export function senderLabel(message: ChatMessage, currentUserId: string | null): string {
  if (currentUserId && message.senderId === currentUserId) return 'You';

  return message.senderName.trim() || 'Tester';
}

async function getSignedInUserId(): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return data.user.id;
}

function mapRoomRow(row: ChatRoomRow): ChatRoom {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    createdBy: row.created_by,
    inviteCode: row.invite_code,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
  };
}

function mapMessageRow(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    body: row.body,
    createdAt: row.created_at,
  };
}
