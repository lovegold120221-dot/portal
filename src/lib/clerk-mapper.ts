import {
  type User,
  type UserRole,
  type UserStatus,
} from '@/features/users/data/schema'
import { type ClerkUser } from './clerk-types'

export function clerkUserToUser(clerk: ClerkUser): User {
  const email =
    clerk.email_addresses?.find((e) => e.id === clerk.primary_email_address_id)
      ?.email_address ??
    clerk.email_addresses?.[0]?.email_address ??
    ''

  const phone =
    clerk.phone_numbers?.find((p) => p.id === clerk.primary_phone_number_id)
      ?.phone_number ??
    clerk.phone_numbers?.[0]?.phone_number ??
    ''

  const role = (clerk.public_metadata?.role ?? 'user') as UserRole
  const status = deriveStatus(clerk) as UserStatus

  return {
    id: clerk.id,
    email,
    first_name: clerk.first_name ?? '',
    last_name: clerk.last_name ?? '',
    username: clerk.username ?? '',
    phone_number: phone,
    role,
    status,
    clerk_user_id: clerk.id,
    created_at: new Date(clerk.created_at),
    updated_at: new Date(clerk.updated_at),
  }
}

function deriveStatus(clerk: ClerkUser): string {
  if (clerk.public_metadata?.status) return clerk.public_metadata.status
  if (clerk.banned) return 'suspended'
  if (clerk.locked) return 'inactive'
  if (!clerk.last_sign_in_at) return 'invited'
  return 'active'
}

export function getPrimaryEmail(clerk: ClerkUser): string {
  return (
    clerk.email_addresses?.find((e) => e.id === clerk.primary_email_address_id)
      ?.email_address ??
    clerk.email_addresses?.[0]?.email_address ??
    ''
  )
}
