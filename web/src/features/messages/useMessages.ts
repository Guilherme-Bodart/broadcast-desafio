import { useEffect, useState } from 'react'
import type { FirestoreError } from 'firebase/firestore'
import {
  createMessage,
  deleteMessage,
  listenMessages,
  updateMessage,
} from '../../services/messages'
import type { Message, MessageInput } from '../../types/message'

export function useMessages(userId: string, connectionId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return listenMessages(
      userId,
      connectionId,
      (nextMessages) => {
        setMessages(nextMessages)
        setError('')
        setLoading(false)
      },
      (firestoreError: FirestoreError) => {
        setError(firestoreError.message)
        setLoading(false)
      },
    )
  }, [connectionId, userId])

  return {
    messages,
    loading,
    error,
    createMessage: (input: MessageInput) => createMessage(userId, connectionId, input),
    updateMessage,
    deleteMessage,
  }
}
