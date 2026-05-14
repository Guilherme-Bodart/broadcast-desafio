import type { Timestamp } from 'firebase/firestore'

export type MessageStatus = 'scheduled' | 'sent'

export type Message = {
  id: string
  userId: string
  connectionId: string
  contactIds: string[]
  text: string
  status: MessageStatus
  scheduledAt: Timestamp | null
  sentAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type MessageInput = {
  contactIds: string[]
  text: string
  scheduledAt: Date | null
}
