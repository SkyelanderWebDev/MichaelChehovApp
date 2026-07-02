import { beforeEach, describe, expect, test, vi } from 'vitest'

// Chainable Supabase double: every query-builder method returns the builder,
// and awaiting it (or its terminators) resolves the per-test queued result.
const mock = vi.hoisted(() => {
  const state = {
    userId: 'user-1' as string | null,
    results: [] as Array<{ data: unknown; error: unknown }>,
    calls: [] as Array<{ table: string; op: string; payload?: unknown }>,
    rpcCalls: [] as Array<{ fn: string; args: unknown }>,
  }

  function nextResult() {
    return state.results.shift() ?? { data: null, error: null }
  }

  function makeBuilder(table: string) {
    const builder: Record<string, unknown> = {}
    const chain = () => builder

    for (const method of ['select', 'eq', 'order', 'limit', 'delete']) {
      builder[method] = vi.fn(chain)
    }
    builder.insert = vi.fn((payload: unknown) => {
      state.calls.push({ table, op: 'insert', payload })
      return builder
    })
    builder.maybeSingle = vi.fn(() => Promise.resolve(nextResult()))
    builder.single = vi.fn(() => Promise.resolve(nextResult()))
    builder.then = (resolve: (value: unknown) => unknown) => Promise.resolve(nextResult()).then(resolve)

    return builder
  }

  const client = {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: state.userId ? { id: state.userId } : null },
        error: null,
      })),
    },
    from: vi.fn((table: string) => makeBuilder(table)),
    rpc: vi.fn(async (fn: string, args: unknown) => {
      state.rpcCalls.push({ fn, args })
      return nextResult()
    }),
  }

  return { state, client }
})

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConfigured: true,
  supabase: mock.client,
  requireSupabase: () => mock.client,
}))

import {
  MAX_MESSAGE_LENGTH,
  canCreateRooms,
  createRoom,
  joinRoomByCode,
  listMyRooms,
  listRoomMessages,
  sendMessage,
  senderLabel,
} from '@/stores/chatStore'
import type { ChatMessage } from '@/types/chat'

function message(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'm-1',
    roomId: 'r-1',
    senderId: 'user-2',
    senderName: 'Lisa',
    body: 'Hello',
    createdAt: '2026-07-02T12:00:00Z',
    ...overrides,
  }
}

beforeEach(() => {
  mock.state.userId = 'user-1'
  mock.state.results = []
  mock.state.calls = []
  mock.state.rpcCalls = []
})

describe('senderLabel', () => {
  test('labels own messages as You', () => {
    expect(senderLabel(message({ senderId: 'user-1' }), 'user-1')).toBe('You')
  })

  test('uses the server-stamped display name for others', () => {
    expect(senderLabel(message(), 'user-1')).toBe('Lisa')
  })

  test('falls back to a neutral Tester label when the stamp is blank', () => {
    expect(senderLabel(message({ senderName: '  ' }), 'user-1')).toBe('Tester')
  })
})

describe('signed-out guards', () => {
  beforeEach(() => {
    mock.state.userId = null
  })

  test('canCreateRooms is false and performs no query', async () => {
    expect(await canCreateRooms()).toBe(false)
    expect(mock.client.from).not.toHaveBeenCalled()
  })

  test('listMyRooms returns empty', async () => {
    expect(await listMyRooms()).toEqual([])
  })

  test('sendMessage and joinRoomByCode are no-ops', async () => {
    expect(await sendMessage('r-1', 'hello')).toBeNull()
    expect(await joinRoomByCode('abc123')).toBeNull()
    expect(mock.state.calls).toEqual([])
    expect(mock.state.rpcCalls).toEqual([])
  })
})

describe('createRoom validation', () => {
  test('rejects an empty name before any insert', async () => {
    await expect(createRoom('   ', 'class')).rejects.toThrow(/Room names/)
    expect(mock.state.calls).toEqual([])
  })

  test('rejects names over the limit before any insert', async () => {
    await expect(createRoom('x'.repeat(81), 'class')).rejects.toThrow(/Room names/)
    expect(mock.state.calls).toEqual([])
  })

  test('inserts the trimmed name for the signed-in creator', async () => {
    mock.state.results = [
      {
        data: {
          id: 'r-9',
          name: 'Scene study',
          kind: 'class',
          created_by: 'user-1',
          invite_code: 'a1b2c3d4e5',
          archived_at: null,
          created_at: '2026-07-02T12:00:00Z',
        },
        error: null,
      },
    ]

    const room = await createRoom('  Scene study  ', 'class')

    expect(room?.inviteCode).toBe('a1b2c3d4e5')
    expect(mock.state.calls[0]).toMatchObject({
      table: 'chat_rooms',
      op: 'insert',
      payload: { name: 'Scene study', created_by: 'user-1', kind: 'class' },
    })
  })
})

describe('sendMessage validation', () => {
  test('rejects empty and oversized bodies before any insert', async () => {
    await expect(sendMessage('r-1', '   ')).rejects.toThrow(/empty/)
    await expect(sendMessage('r-1', 'x'.repeat(MAX_MESSAGE_LENGTH + 1))).rejects.toThrow(/limited/)
    expect(mock.state.calls).toEqual([])
  })

  test('sends the trimmed body as the signed-in sender', async () => {
    mock.state.results = [
      {
        data: {
          id: 'm-2',
          room_id: 'r-1',
          sender_id: 'user-1',
          sender_name: '',
          body: 'Hello room',
          created_at: '2026-07-02T12:05:00Z',
        },
        error: null,
      },
    ]

    const sent = await sendMessage('r-1', '  Hello room  ')

    expect(sent?.body).toBe('Hello room')
    expect(mock.state.calls[0]).toMatchObject({
      table: 'chat_messages',
      op: 'insert',
      payload: { room_id: 'r-1', sender_id: 'user-1', body: 'Hello room' },
    })
  })
})

describe('listRoomMessages', () => {
  test('returns the thread oldest-first from a newest-first query', async () => {
    mock.state.results = [
      {
        data: [
          { id: 'm-3', room_id: 'r-1', sender_id: 'u', sender_name: '', body: 'newest', created_at: '3' },
          { id: 'm-2', room_id: 'r-1', sender_id: 'u', sender_name: '', body: 'middle', created_at: '2' },
          { id: 'm-1', room_id: 'r-1', sender_id: 'u', sender_name: '', body: 'oldest', created_at: '1' },
        ],
        error: null,
      },
    ]

    const thread = await listRoomMessages('r-1')

    expect(thread.map((entry) => entry.body)).toEqual(['oldest', 'middle', 'newest'])
  })
})

describe('joinRoomByCode', () => {
  test('rejects a blank code without calling the RPC', async () => {
    await expect(joinRoomByCode('   ')).rejects.toThrow(/invite code/i)
    expect(mock.state.rpcCalls).toEqual([])
  })

  test('passes the trimmed code to the join RPC', async () => {
    mock.state.results = [{ data: 'room-1', error: null }]

    expect(await joinRoomByCode(' a1b2c3 ')).toBe('room-1')
    expect(mock.state.rpcCalls[0]).toEqual({ fn: 'join_chat_room', args: { code: 'a1b2c3' } })
  })
})
