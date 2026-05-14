import { useEffect, useState } from 'react'
import type { FirestoreError } from 'firebase/firestore'
import {
  createConnection,
  deleteConnection,
  listenConnections,
  updateConnection,
} from '../../services/connections'
import type { Connection, ConnectionInput } from '../../types/connection'

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      return undefined
    }

    return listenConnections(
      userId,
      (nextConnections) => {
        setConnections(nextConnections)
        setError('')
        setLoading(false)
      },
      (firestoreError: FirestoreError) => {
        setError(firestoreError.message)
        setLoading(false)
      },
    )
  }, [userId])

  return {
    connections,
    loading,
    error,
    createConnection: (input: ConnectionInput) => {
      if (!userId) {
        return Promise.reject(new Error('Usuário não autenticado.'))
      }

      return createConnection(userId, input)
    },
    updateConnection,
    deleteConnection,
  }
}
