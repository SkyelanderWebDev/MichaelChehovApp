export type ChatRoomKind = 'class' | 'show' | 'community';

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
