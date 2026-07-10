import { supabase } from './supabase'

export type UserRow = {
  id: string
  email: string
  first_name: string
  last_name: string
  username: string
  phone_number: string
  role: 'admin' | 'developer' | 'client' | 'user'
  status: 'active' | 'inactive' | 'invited' | 'suspended'
  created_at: string
  updated_at: string
}

export type UserCreateInput = Omit<UserRow, 'id' | 'created_at' | 'updated_at'>
export type UserUpdateInput = Partial<Omit<UserRow, 'id' | 'created_at'>>

export async function fetchUsers(): Promise<UserRow[]> {
  const { data, error } = await supabase
     .from('users')
     .select('*')
     .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch users:', error)
    return []
   }

  return data as unknown as UserRow[]
}

export async function createUser(
  input: UserCreateInput,
): Promise<UserRow | null> {
  const { data, error } = await supabase
     .from('users')
     .insert([input])
     .select()
     .single()

  if (error) {
    console.error('Failed to create user:', error)
    return null
   }

  return data as unknown as UserRow
}

export async function updateUser(
  id: string,
  input: UserUpdateInput,
): Promise<UserRow | null> {
  const { data, error } = await supabase
     .from('users')
     .update(input)
     .eq('id', id)
     .select()
     .single()

  if (error) {
    console.error('Failed to update user:', error)
    return null
   }

  return data as unknown as UserRow
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) {
    console.error('Failed to delete user:', error)
    return false
   }

  return true
}

export async function inviteUser(
  email: string,
  role: 'admin' | 'developer' | 'client' | 'user',
  desc?: string,
): Promise<boolean> {
  const { error } = await supabase.from('users').insert([
     {
      email,
      role,
      status: 'invited' as UserRow['status'],
      first_name: '',
      last_name: '',
      username: email.split('@')[0],
      phone_number: '',
     },
   ])

  if (error) {
    console.error('Failed to invite user:', error)
    return false
   }

  console.log(`Invite sent to ${email} with role ${role}${desc ? `: ${desc}` : ''}`)
  return true
}
