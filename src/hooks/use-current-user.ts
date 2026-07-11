import { useEffect, useState } from 'react'
import { useUser } from '@clerk/react'
import { clerkUserToUser } from '@/lib/clerk-mapper'
import { clerkUsers } from '@/lib/clerk-users-api'
import { type User } from '@/features/users/data/schema'

type CurrentUser = {
  user: User | null
  role: User['role'] | null
  isAdmin: boolean
  isSuperuser: boolean
  canManageUsers: boolean
  canManageApps: boolean
  isLoading: boolean
}

export function useCurrentUser(): CurrentUser {
  const { user: clerkUser, isLoaded } = useUser()
  const [dbUser, setDbUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    let active = true

    async function fetchDbUser() {
      if (!clerkUser) {
        if (active) {
          setDbUser(null)
          setIsLoading(false)
        }
        return
      }

      try {
        const full = await clerkUsers.getUser(clerkUser.id)
        if (active) {
          setDbUser(clerkUserToUser(full))
          setIsLoading(false)
        }
      } catch {
        if (active) {
          setDbUser(null)
          setIsLoading(false)
        }
      }
    }

    fetchDbUser()
    return () => {
      active = false
    }
  }, [clerkUser, isLoaded])

  const isAdmin = dbUser?.role === 'admin'
  const isSuperuser = Boolean(dbUser?.isSuperuser)
  return {
    user: dbUser,
    role: dbUser?.role ?? null,
    isAdmin,
    isSuperuser,
    canManageUsers: isAdmin || isSuperuser,
    canManageApps: isAdmin || isSuperuser,
    isLoading,
  }
}
