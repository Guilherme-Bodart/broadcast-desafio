import type { Timestamp } from 'firebase/firestore'

export type Connection = {
  id: string
  userId: string
  name: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type ConnectionInput = {
  name: string
}
