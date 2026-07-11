import axios from 'axios'
import {
  type ClerkCreateUserPayload,
  type ClerkListResponse,
  type ClerkUpdateUserPayload,
  type ClerkUser,
} from './clerk-types'

const client = axios.create({
  baseURL: '/api/clerk',
  headers: { 'Content-Type': 'application/json' },
})

async function listUsers(limit = 100, offset = 0): Promise<ClerkListResponse> {
  const { data } = await client.get('/users', {
    params: { limit, offset, order_by: '-created_at' },
  })
  return {
    data: data.data ?? data,
    total_count: data.total_count ?? data.length ?? 0,
  } as ClerkListResponse
}

async function getUser(userId: string): Promise<ClerkUser> {
  const { data } = await client.get(`/users/${userId}`)
  return data as ClerkUser
}

async function createUser(payload: ClerkCreateUserPayload): Promise<ClerkUser> {
  const { data } = await client.post('/users', payload)
  return data as ClerkUser
}

async function updateUser(
  userId: string,
  payload: ClerkUpdateUserPayload
): Promise<ClerkUser> {
  const { data } = await client.patch(`/users/${userId}`, payload)
  return data as ClerkUser
}

async function deleteUser(userId: string): Promise<void> {
  await client.delete(`/users/${userId}`)
}

export const clerkUsers = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}
