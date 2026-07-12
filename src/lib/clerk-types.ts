import { type UserRole, type UserStatus } from '@/features/users/data/schema'

export type ClerkEmailAddress = {
  id: string
  email_address: string
  verification: { status: string } | null
  linked_to: unknown[]
}

export type ClerkPhoneNumber = {
  id: string
  phone_number: string
  verification: { status: string } | null
}

export type ClerkUser = {
  id: string
  first_name: string | null
  last_name: string | null
  username: string | null
  image_url: string
  has_image: boolean
  email_addresses: ClerkEmailAddress[]
  phone_numbers: ClerkPhoneNumber[]
  primary_email_address_id: string | null
  primary_phone_number_id: string | null
  public_metadata: {
    role?: UserRole
    status?: UserStatus
    isSuperuser?: boolean
  }
  created_at: number
  updated_at: number
  last_sign_in_at: number | null
  banned: boolean
  locked: boolean
}

export type ClerkListResponse = {
  data: ClerkUser[]
  total_count: number
}

export type ClerkCreateUserPayload = {
  first_name?: string
  last_name?: string
  username?: string
  email_address?: string[]
  phone_number?: string[]
  password?: string
  public_metadata?: {
    role?: UserRole
    status?: UserStatus
    isSuperuser?: boolean
  }
}

export type ClerkUpdateUserPayload = {
  first_name?: string
  last_name?: string
  username?: string
  public_metadata?: {
    role?: UserRole
    status?: UserStatus
    isSuperuser?: boolean
  }
}

export type ClerkInvitation = {
  id: string
  email_address: string
  public_metadata?: {
    role?: UserRole
    status?: UserStatus
    note?: string
  }
  status: 'pending' | 'accepted' | 'revoked' | 'expired'
  created_at: number
  updated_at: number
}
