import type { Timestamp } from 'firebase/firestore'

export type Contact = {
  id: string
  userId: string
  connectionId: string
  name: string
  phone: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type ContactInput = {
  name: string
  phone: string
}
