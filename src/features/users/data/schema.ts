import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('admin'),
  z.literal('developer'),
  z.literal('client'),
  z.literal('user'),
])
export type UserRole = z.infer<typeof userRoleSchema>

export const _userSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  phone_number: z.string(),
  role: userRoleSchema,
  isSuperuser: z.boolean().optional(),
  status: userStatusSchema,
  clerk_user_id: z.string().nullable().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})
export type User = z.infer<typeof _userSchema>

// Helpers for converting DB rows to display-friendly format
export function toDisplayUser(user: User) {
  return {
    ...user,
    name: `${user.first_name} ${user.last_name}`.trim(),
    initials: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
  }
}
