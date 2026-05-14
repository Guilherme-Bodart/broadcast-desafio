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
import type { Contact, ContactInput } from '../types/contact'

const contactsCollection = collection(db, 'contacts')

const toContact = (snapshot: QueryDocumentSnapshot): Contact => {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    userId: String(data.userId),
    connectionId: String(data.connectionId),
    name: String(data.name),
    phone: String(data.phone),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

const normalizeContactInput = ({ name, phone }: ContactInput) => ({
  name: name.trim(),
  phone: phone.trim(),
})

export function listenContacts(
  userId: string,
  connectionId: string,
  onChange: (contacts: Contact[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const contactsQuery = query(
    contactsCollection,
    where('userId', '==', userId),
    where('connectionId', '==', connectionId),
  )

  return onSnapshot(
    contactsQuery,
    (snapshot) => {
      const contacts = snapshot.docs
        .map(toContact)
        .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'))

      onChange(contacts)
    },
    onError,
  )
}

export async function createContact(
  userId: string,
  connectionId: string,
  input: ContactInput,
) {
  const contact = normalizeContactInput(input)

  await addDoc(contactsCollection, {
    userId,
    connectionId,
    name: contact.name,
    phone: contact.phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateContact(contactId: string, input: ContactInput) {
  const contact = normalizeContactInput(input)

  await updateDoc(doc(db, 'contacts', contactId), {
    name: contact.name,
    phone: contact.phone,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteContact(contactId: string) {
  await deleteDoc(doc(db, 'contacts', contactId))
}
