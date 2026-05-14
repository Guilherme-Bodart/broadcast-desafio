import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type FirestoreError,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Connection, ConnectionInput } from '../types/connection'

const connectionsCollection = collection(db, 'connections')

const toConnection = (snapshot: QueryDocumentSnapshot): Connection => {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    userId: String(data.userId),
    name: String(data.name),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

const normalizeConnectionInput = ({ name }: ConnectionInput) => ({
  name: name.trim(),
})

export function listenConnections(
  userId: string,
  onChange: (connections: Connection[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const connectionsQuery = query(connectionsCollection, where('userId', '==', userId))

  return onSnapshot(
    connectionsQuery,
    (snapshot) => {
      const connections = snapshot.docs
        .map(toConnection)
        .sort((first, second) => {
          const firstTime = first.createdAt?.toMillis?.() ?? 0
          const secondTime = second.createdAt?.toMillis?.() ?? 0

          return secondTime - firstTime
        })

      onChange(connections)
    },
    onError,
  )
}

export async function createConnection(userId: string, input: ConnectionInput) {
  const connection = normalizeConnectionInput(input)

  await addDoc(connectionsCollection, {
    userId,
    name: connection.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateConnection(
  connectionId: string,
  input: ConnectionInput,
) {
  const connection = normalizeConnectionInput(input)

  await updateDoc(doc(db, 'connections', connectionId), {
    name: connection.name,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteConnection(connectionId: string) {
  await deleteDoc(doc(db, 'connections', connectionId))
}
