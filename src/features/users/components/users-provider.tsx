import React, { createContext, useContext, useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { supabase } from '@/lib/supabase'
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
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [data, setData] = useState<User[]>([])

  const refresh = async () => {
    const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
    if (users) {
      setData(users as unknown as User[])
    }
   }

  useEffect(() => {
    refresh()
   }, [])

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
