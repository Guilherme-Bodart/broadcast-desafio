import { useEffect, useState } from 'react'
import type { FirestoreError } from 'firebase/firestore'
import {
  createContact,
  deleteContact,
  listenContacts,
  updateContact,
} from '../../services/contacts'
import type { Contact, ContactInput } from '../../types/contact'

export function useContacts(userId: string, connectionId: string) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return listenContacts(
      userId,
      connectionId,
      (nextContacts) => {
        setContacts(nextContacts)
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
    contacts,
    loading,
    error,
    createContact: (input: ContactInput) => createContact(userId, connectionId, input),
    updateContact,
    deleteContact,
  }
}
