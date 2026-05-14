import {
  Timestamp,
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
import type { Message, MessageInput, MessageStatus } from '../types/message'

const messagesCollection = collection(db, 'messages')

const toMessage = (snapshot: QueryDocumentSnapshot): Message => {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    userId: String(data.userId),
    connectionId: String(data.connectionId),
    contactIds: Array.isArray(data.contactIds) ? data.contactIds.map(String) : [],
    text: String(data.text),
    status: data.status as MessageStatus,
    scheduledAt: data.scheduledAt ?? null,
    sentAt: data.sentAt ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

const normalizeMessageInput = ({ contactIds, scheduledAt, text }: MessageInput) => ({
  contactIds: [...new Set(contactIds)].filter(Boolean),
  scheduledAt,
  text: text.trim(),
})

const getMessageStatus = (scheduledAt: Date | null): MessageStatus =>
  scheduledAt ? 'scheduled' : 'sent'

const getScheduledTimestamp = (scheduledAt: Date | null) =>
  scheduledAt ? Timestamp.fromDate(scheduledAt) : null

export function listenMessages(
  userId: string,
  connectionId: string,
  onChange: (messages: Message[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const messagesQuery = query(
    messagesCollection,
    where('userId', '==', userId),
    where('connectionId', '==', connectionId),
  )

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs
        .map(toMessage)
        .sort((first, second) => {
          const firstTime =
            first.scheduledAt?.toMillis?.() ?? first.createdAt?.toMillis?.() ?? 0
          const secondTime =
            second.scheduledAt?.toMillis?.() ?? second.createdAt?.toMillis?.() ?? 0

          return secondTime - firstTime
        })

      onChange(messages)
    },
    onError,
  )
}

export async function createMessage(
  userId: string,
  connectionId: string,
  input: MessageInput,
) {
  const message = normalizeMessageInput(input)
  const status = getMessageStatus(message.scheduledAt)

  await addDoc(messagesCollection, {
    userId,
    connectionId,
    contactIds: message.contactIds,
    text: message.text,
    status,
    scheduledAt: getScheduledTimestamp(message.scheduledAt),
    sentAt: status === 'sent' ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateMessage(messageId: string, input: MessageInput) {
  const message = normalizeMessageInput(input)
  const status = getMessageStatus(message.scheduledAt)

  await updateDoc(doc(db, 'messages', messageId), {
    contactIds: message.contactIds,
    text: message.text,
    status,
    scheduledAt: getScheduledTimestamp(message.scheduledAt),
    sentAt: status === 'sent' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteMessage(messageId: string) {
  await deleteDoc(doc(db, 'messages', messageId))
}
