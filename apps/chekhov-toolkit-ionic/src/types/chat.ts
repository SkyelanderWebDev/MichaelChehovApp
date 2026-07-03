export type ChatRoomKind = 'class' | 'show' | 'community' | 'leadership';

export type ChatInvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

/** Owner-visible invitation row. Never carries the token or its hash. */
export interface ChatRoomInvitation {
  id: string;
  roomId: string;
  invitedEmail: string;
  status: ChatInvitationStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string | null;
}

/**
 * Result of creating an invitation. `token` is the single exposure of the raw
 * invite token (the database stores only a hash); it is shown once to the room
 * owner so they can send the link themselves.
 */
export interface CreatedChatInvitation {
  invitationId: string;
  token: string;
  expiresAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  kind: ChatRoomKind;
  createdBy: string;
  inviteCode: string;
  archivedAt?: string | null;
  createdAt: string;
}

export interface ChatRoomMember {
  roomId: string;
  userId: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  /** Server-stamped display snapshot; empty when the sender has no usable name. */
  senderName: string;
  body: string;
  createdAt: string;
}
