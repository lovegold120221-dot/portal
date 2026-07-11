import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/react'
import { clerkUserToUser } from '@/lib/clerk-mapper'
import { clerkUsers } from '@/lib/clerk-users-api'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../data/schema'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  data: User[]
  refresh: () => void
}

const UsersContext = createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [data, setData] = useState<User[]>([])

  const clerkId = clerkUser?.id

  const refresh = async () => {
    const { data: rawUsers } = await clerkUsers.listUsers(500)
    const allUsers = rawUsers.map(clerkUserToUser)
    const filtered = clerkId
      ? allUsers.filter((u) => u.id !== clerkId)
      : allUsers
    setData(filtered)
  }

  useEffect(() => {
    if (!isLoaded) return

    let active = true

    async function load() {
      try {
        const { data: rawUsers } = await clerkUsers.listUsers(500)
        if (!active) return
        const allUsers = rawUsers.map(clerkUserToUser)
        const filtered = clerkId
          ? allUsers.filter((u) => u.id !== clerkId)
          : allUsers
        setData(filtered)
      } catch {
        // API not configured yet — leave empty
      }
    }

    load()
    return () => {
      active = false
    }
  }, [isLoaded, clerkId])

  return (
    <UsersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        data,
        refresh,
      }}
    >
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = useContext(UsersContext)
  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }
  return usersContext
}
