import { supabase } from '@/lib/supabase'
import { type User } from './schema'

/**
 * Fetch users from the Supabase database.
 * In development, returns an empty array until the `users` table is set up.
 */
export async function loadUsers(): Promise<User[]> {
  const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

  if (error) {
    console.warn('Failed to load users from database:', error.message)
    return []
  }

  return data as unknown as User[]
}

/**
 * Legacy export: user records for development.
 * Use `loadUsers()` instead for real Supabase data.
 */
export const users: User[] = [
  {
    id: 'usr_emil_001',
    email: 'emil.alvaro@eburon.ai',
    first_name: 'Emil',
    last_name: 'Alvaro',
    username: 'emilalvaro',
    phone_number: '+1-555-0100',
    role: 'developer',
    status: 'active',
    created_at: new Date('2025-01-15'),
    updated_at: new Date('2025-06-01'),
  },
]
