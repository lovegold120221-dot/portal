import { supabase } from './supabase'

export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: string
  replyTo: string | null
}

export type ConversationMember = {
  userId: string
  role: 'admin' | 'member'
  lastReadAt: string | null
}

export type Conversation = {
  id: string
  type: 'direct' | 'group'
  name: string | null
  createdBy: string | null
  createdAt: string
  lastMessageAt: string | null
  members: ConversationMember[]
  messages: ChatMessage[]
  unread: number
}

type DbMessage = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
  reply_to: string | null
}

const toMessage = (m: DbMessage): ChatMessage => ({
  id: m.id,
  conversationId: m.conversation_id,
  senderId: m.sender_id,
  body: m.body,
  createdAt: m.created_at,
  replyTo: m.reply_to,
})

const MESSAGES_PER_PAGE = 50

export async function listConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversation_members')
    .select(
      `
      conversation_id,
      role,
      last_read_at,
      conversations (
        id, type, name, created_by, created_at, last_message_at,
        conversation_members ( user_id, role, last_read_at ),
        messages (
          id, conversation_id, sender_id, body, created_at, reply_to,
          order by created_at desc,
          limit ${MESSAGES_PER_PAGE}
        )
      )
    `
    )
    .eq('user_id', userId)

  if (error) throw error

  return (data ?? []).map((row) => {
    const c = row.conversations as unknown as {
      id: string
      type: 'direct' | 'group'
      name: string | null
      created_by: string | null
      created_at: string
      last_message_at: string | null
      conversation_members: { user_id: string; role: string; last_read_at: string | null }[]
      messages: DbMessage[]
    }

    const members: ConversationMember[] = (c.conversation_members ?? []).map(
      (m) => ({
        userId: m.user_id,
        role: m.role === 'admin' ? 'admin' : 'member',
        lastReadAt: m.last_read_at,
      }
    )

    const myLastRead = (row.last_read_at as string | null) ?? '1970-01-01'
    const messages: ChatMessage[] = (c.messages ?? [])
      .slice()
      .reverse()
      .map(toMessage)

    const unread = messages.filter(
      (m) => m.senderId !== userId && m.createdAt > myLastRead
    ).length

    return {
      id: c.id,
      type: c.type,
      name: c.name,
      createdBy: c.created_by,
      createdAt: c.created_at,
      lastMessageAt: c.last_message_at,
      members,
      messages,
      unread,
    }
  })
}

export async function getOrCreateDirectConversation(
  aId: string,
  bId: string
): Promise<string> {
  const { data: rows, error } = await supabase
    .from('conversation_members')
    .select(
      'conversation_id, conversations(type, conversation_members(user_id))'
    )
    .eq('user_id', aId)

  if (error) throw error

  const found = (rows ?? []).find((r) => {
    const conv = r.conversations as unknown as {
      type: 'direct' | 'group'
      conversation_members: { user_id: string }[]
    }
    return (
      conv?.type === 'direct' &&
      conv.conversation_members?.length === 2 &&
      conv.conversation_members.some((m) => m.user_id === bId)
    )
  })

  if (found) return found.conversation_id as string

  const { data: conv, error: convError } = await supabase
    .from('conversations')
    .insert({ type: 'direct', created_by: aId })
    .select('id')
    .single()

  if (convError) throw convError

  const conversationId = conv.id as string

  const { error: membersError } = await supabase
    .from('conversation_members')
    .insert([
      { conversation_id: conversationId, user_id: aId, role: 'member' },
      { conversation_id: conversationId, user_id: bId, role: 'member' },
    ])

  if (membersError) throw membersError

  return conversationId
}

export async function createGroupConversation(
  name: string,
  memberIds: string[],
  createdBy: string
): Promise<string> {
  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ type: 'group', name, created_by: createdBy })
    .select('id')
    .single()

  if (error) throw error

  const conversationId = conv.id as string

  const { error: membersError } = await supabase
    .from('conversation_members')
    .insert(
      memberIds.map((userId) => ({
        conversation_id: conversationId,
        user_id: userId,
        role: userId === createdBy ? 'admin' : 'member',
      }))
    )

  if (membersError) throw membersError

  return conversationId
}

export async function loadMessages(
  conversationId: string,
  opts?: { limit?: number; before?: string }
): Promise<ChatMessage[]> {
  const limit = opts?.limit ?? MESSAGES_PER_PAGE
  let query = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (opts?.before) query = query.lt('created_at', opts.before)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(toMessage)
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select('*')
    .single()

  if (error) throw error

  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  return toMessage(data as DbMessage)
}

export async function markRead(
  conversationId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('conversation_members')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)

  if (error) throw error
}

export function subscribeMessages(
  conversationId: string,
  onInsert: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onInsert(toMessage(payload.new as DbMessage))
    )
    .subscribe()

  return channel
}
