// Connect group-chat RLS smoke — allow AND deny paths with three users.
//
// Usage (local stack):
//   supabase start && supabase db reset
//   VITE_SUPABASE_URL=http://127.0.0.1:54321 \
//   VITE_SUPABASE_ANON_KEY=<local anon key> \
//   SUPABASE_SERVICE_ROLE_KEY=<local service role key> \
//   npm run verify:rls:chat
//
// SUPABASE_SERVICE_ROLE_KEY is used ONLY to seed the chat_room_creators
// allowlist (a Dawson-approved operator action in hosted environments) and to
// clean up. Never point this script at production with real tester data.
import { createClient } from '@supabase/supabase-js';

function envOrDefault(name, fallback) {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const emailDomain = envOrDefault('SUPABASE_RLS_EMAIL_DOMAIN', 'skyelandersolutions.com');
const password = envOrDefault('SUPABASE_RLS_TEST_PASSWORD', 'Secure-test-1234');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.');
  process.exit(2);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY (needed to seed the creator allowlist).');
  process.exit(2);
}

function makeClient(key = supabaseAnonKey) {
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
}

const admin = makeClient(serviceRoleKey);

async function signUpUser(label, metadata) {
  const client = makeClient();
  const email = `chat-rls-${label}-${Date.now()}-${Math.floor(Math.random() * 100000)}@${emailDomain}`;
  const { data, error } = await client.auth.signUp({
    email,
    password,
    ...(metadata ? { options: { data: metadata } } : {}),
  });
  if (error) throw new Error(`${label} signUp failed: ${error.message}`);
  if (!data.session?.user) {
    throw new Error(`${label} signUp returned no session. Disable email confirmations for smoke.`);
  }
  return { client, email, userId: data.session.user.id, label };
}

function expect(condition, message) {
  if (!condition) throw new Error(`FAIL ${message}`);
  console.log(`PASS ${message}`);
}

async function run() {
  const creator = await signUpUser('creator');
  const member = await signUpUser('member');
  const outsider = await signUpUser('outsider');
  // Signed up with a real display name in auth metadata; the profiles trigger
  // stores it, and the chat stamp trigger should surface it.
  const named = await signUpUser('named', { display_name: 'Smoke Teacher' });
  const roomIds = [];
  const userIds = [creator.userId, member.userId, outsider.userId, named.userId];

  try {
    // 1. Unauthorized creation denied BEFORE allowlist seed.
    const { error: preSeedError } = await creator.client
      .from('chat_rooms')
      .insert({ created_by: creator.userId, name: 'Pre-seed room', invite_code: 'pending' });
    expect(Boolean(preSeedError), 'non-allowlisted user cannot create a room');

    // 2. Seed allowlist (operator action; service role locally).
    const { error: seedError } = await admin
      .from('chat_room_creators')
      .insert({ user_id: creator.userId });
    if (seedError) throw seedError;
    console.log('SEED creator allowlisted via service role');

    // 3. Allowlisted creator can create; invite code is server-generated.
    const { data: room, error: createError } = await creator.client
      .from('chat_rooms')
      .insert({ created_by: creator.userId, name: 'RLS smoke class', invite_code: 'pending' })
      .select('id, name, invite_code, created_by')
      .single();
    if (createError) throw createError;
    roomIds.push(room.id);
    expect(room.created_by === creator.userId, 'allowlisted creator creates a room');
    expect(
      room.invite_code !== 'pending' && /^[0-9a-f]{10}$/.test(room.invite_code),
      'invite code is server-generated, not client-supplied',
    );

    // 4. Creator auto-membership as owner.
    const { data: ownRows, error: ownError } = await creator.client
      .from('chat_room_members')
      .select('user_id, role')
      .eq('room_id', room.id);
    if (ownError) throw ownError;
    expect(
      ownRows.length === 1 && ownRows[0].role === 'owner' && ownRows[0].user_id === creator.userId,
      'creator is auto-enrolled as room owner',
    );

    // 5. Creator cannot spoof created_by as someone else.
    const { error: spoofCreateError } = await creator.client
      .from('chat_rooms')
      .insert({ created_by: member.userId, name: 'Spoofed owner', invite_code: 'pending' });
    expect(Boolean(spoofCreateError), 'creator cannot create a room as another user');

    // 6. Member (not allowlisted) cannot create a room.
    const { error: memberCreateError } = await member.client
      .from('chat_rooms')
      .insert({ created_by: member.userId, name: 'Member room', invite_code: 'pending' });
    expect(Boolean(memberCreateError), 'non-allowlisted member cannot create a room');

    // 7. Non-member cannot see the room, its members, or its messages.
    const { data: outsiderRooms } = await outsider.client
      .from('chat_rooms')
      .select('id')
      .eq('id', room.id);
    expect((outsiderRooms ?? []).length === 0, 'non-member cannot read the room row');

    const { data: outsiderMembers } = await outsider.client
      .from('chat_room_members')
      .select('user_id')
      .eq('room_id', room.id);
    expect((outsiderMembers ?? []).length === 0, 'non-member cannot read the member roster');

    const { data: outsiderMessages } = await outsider.client
      .from('chat_messages')
      .select('id')
      .eq('room_id', room.id);
    expect((outsiderMessages ?? []).length === 0, 'non-member cannot read room messages');

    const { error: outsiderInsertError } = await outsider.client
      .from('chat_messages')
      .insert({ room_id: room.id, sender_id: outsider.userId, body: 'Should be denied' });
    expect(Boolean(outsiderInsertError), 'non-member cannot post into the room');

    // 8. Wrong invite code is rejected.
    const { error: badCodeError } = await member.client.rpc('join_chat_room', {
      code: 'not-a-code',
    });
    expect(Boolean(badCodeError), 'join with a wrong invite code is rejected');

    // 9. Member joins with the real code and gains read access.
    const { data: joinedRoomId, error: joinError } = await member.client.rpc('join_chat_room', {
      code: room.invite_code,
    });
    if (joinError) throw joinError;
    expect(joinedRoomId === room.id, 'member joins room via invite code');

    const { data: memberRooms } = await member.client
      .from('chat_rooms')
      .select('id')
      .eq('id', room.id);
    expect((memberRooms ?? []).length === 1, 'member can now read the room row');

    // 10. Messaging allow paths + sender_name stamping.
    const { data: creatorMessage, error: creatorSendError } = await creator.client
      .from('chat_messages')
      .insert({
        room_id: room.id,
        sender_id: creator.userId,
        body: 'Welcome to the smoke room',
        sender_name: 'client-supplied-should-be-overwritten',
      })
      .select('id, sender_name')
      .single();
    if (creatorSendError) throw creatorSendError;
    // Sign-up seeded display_name equals the email local-part; the stamp trigger
    // must treat that as account plumbing and blank it, never echoing the client value.
    expect(
      creatorMessage.sender_name === '',
      'email-derived display name is not leaked into sender_name',
    );

    const { error: memberSendError } = await member.client
      .from('chat_messages')
      .insert({ room_id: room.id, sender_id: member.userId, body: 'Member reply' });
    if (memberSendError) throw memberSendError;
    expect(true, 'member can post in a joined room');

    const { data: memberReads } = await member.client
      .from('chat_messages')
      .select('id, body')
      .eq('room_id', room.id);
    expect((memberReads ?? []).length === 2, 'member reads the full room thread');

    // 11. A tester with a real display name gets it stamped server-side.
    const { error: namedJoinError } = await named.client.rpc('join_chat_room', {
      code: room.invite_code,
    });
    if (namedJoinError) throw namedJoinError;

    const { data: namedMessage, error: namedSendError } = await named.client
      .from('chat_messages')
      .insert({ room_id: room.id, sender_id: named.userId, body: 'Named message' })
      .select('sender_name')
      .single();
    if (namedSendError) throw namedSendError;
    expect(namedMessage.sender_name === 'Smoke Teacher', 'real display name is stamped server-side');

    // 12. Sender spoofing denied.
    const { error: spoofSendError } = await member.client
      .from('chat_messages')
      .insert({ room_id: room.id, sender_id: creator.userId, body: 'Spoofed sender' });
    expect(Boolean(spoofSendError), 'member cannot post as another user');

    // 13. Messages are append-only for clients.
    const { data: memberUpdate } = await member.client
      .from('chat_messages')
      .update({ body: 'edited' })
      .eq('room_id', room.id)
      .select('id');
    expect((memberUpdate ?? []).length === 0, 'members cannot edit messages');

    const { data: memberDelete } = await member.client
      .from('chat_messages')
      .delete()
      .eq('room_id', room.id)
      .select('id');
    expect((memberDelete ?? []).length === 0, 'members cannot delete messages');

    // 13b. Owners cannot replace the server-generated invite code.
    const { data: codeUpdateRows, error: codeUpdateError } = await creator.client
      .from('chat_rooms')
      .update({ name: 'RLS smoke class renamed', invite_code: 'vanity' })
      .eq('id', room.id)
      .select('invite_code, name');
    expect(
      Boolean(codeUpdateError) ||
        ((codeUpdateRows ?? []).length === 1 && codeUpdateRows[0].invite_code === room.invite_code),
      'owner cannot overwrite the server-generated invite code',
    );

    // 13c. Clients cannot forge message history order via created_at.
    const { data: forged, error: forgedError } = await member.client
      .from('chat_messages')
      .insert({
        room_id: room.id,
        sender_id: member.userId,
        body: 'Backdated message attempt',
        created_at: '2020-01-01T00:00:00Z',
      })
      .select('created_at')
      .single();
    if (forgedError) throw forgedError;
    expect(
      new Date(forged.created_at).getFullYear() >= 2026,
      'client-supplied created_at is overwritten server-side',
    );

    // 13d. Archived rooms are read-only and closed to new joins.
    const { error: archiveError } = await creator.client
      .from('chat_rooms')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', room.id);
    if (archiveError) throw archiveError;

    const { error: archivedPostError } = await member.client
      .from('chat_messages')
      .insert({ room_id: room.id, sender_id: member.userId, body: 'Post after archive' });
    expect(Boolean(archivedPostError), 'members cannot post into an archived room');

    const { error: archivedJoinError } = await outsider.client.rpc('join_chat_room', {
      code: room.invite_code,
    });
    expect(Boolean(archivedJoinError), 'archived rooms reject invite-code joins');

    const { error: unarchiveError } = await creator.client
      .from('chat_rooms')
      .update({ archived_at: null })
      .eq('id', room.id);
    if (unarchiveError) throw unarchiveError;

    // 14. Self-leave works for members, not for the owner.
    const { data: leaveRows, error: leaveError } = await member.client
      .from('chat_room_members')
      .delete()
      .eq('room_id', room.id)
      .eq('user_id', member.userId)
      .select('user_id');
    if (leaveError) throw leaveError;
    expect((leaveRows ?? []).length === 1, 'member can leave the room');

    const { data: afterLeave } = await member.client
      .from('chat_rooms')
      .select('id')
      .eq('id', room.id);
    expect((afterLeave ?? []).length === 0, 'departed member loses room access');

    const { data: ownerLeave } = await creator.client
      .from('chat_room_members')
      .delete()
      .eq('room_id', room.id)
      .eq('user_id', creator.userId)
      .select('user_id');
    expect((ownerLeave ?? []).length === 0, 'owner cannot orphan their own room');

    // 15. Anonymous clients get nothing.
    const anon = makeClient();
    const { data: anonRooms, error: anonError } = await anon
      .from('chat_rooms')
      .select('id')
      .eq('id', room.id);
    expect(Boolean(anonError) || (anonRooms ?? []).length === 0, 'anonymous client cannot read rooms');

    console.log('Chat RLS smoke complete');
  } finally {
    for (const roomId of roomIds) {
      await admin.from('chat_rooms').delete().eq('id', roomId);
    }
    await admin.from('chat_room_creators').delete().in('user_id', userIds);
    for (const userId of userIds) {
      await admin.auth.admin.deleteUser(userId).catch(() => {});
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
