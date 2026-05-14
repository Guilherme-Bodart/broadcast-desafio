import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { AuthContext } from './authContext'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
      },
      signUp: async (name: string, email: string, password: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password)

        await updateProfile(credential.user, {
          displayName: name,
        })

        setUser({ ...credential.user })
      },
      signOutUser: async () => {
        await signOut(auth)
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
