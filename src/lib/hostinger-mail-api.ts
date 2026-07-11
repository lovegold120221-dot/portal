import axios from 'axios'
import {
  type DeleteBulkRequest,
  type FlagOperation,
  type FoldersCollection,
  type Mailbox,
  type MailMessage,
  type MessageText,
  type MessagesCollection,
  type MoveBulkRequest,
  type MoveRequest,
  type Quota,
  type SearchCriteria,
  type SendEmailPayload,
} from './hostinger-mail'

const client = axios.create({
  baseURL: '/api/mail',
  headers: { 'Content-Type': 'application/json' },
})

async function getAccount(): Promise<Mailbox[]> {
  const { data } = await client.get('/me')
  return (data?.data?.mailboxes ?? []) as Mailbox[]
}

async function getFolders(
  mailboxId: string,
  page = 1,
  perPage = 100
): Promise<FoldersCollection> {
  const { data } = await client.get(`/mailboxes/${mailboxId}/folders`, {
    params: { page, perPage },
  })
  return data as FoldersCollection
}

async function getMessages(
  mailboxId: string,
  folder: string,
  page = 1,
  perPage = 25,
  sort = '-uid'
): Promise<MessagesCollection> {
  const { data } = await client.get(
    `/mailboxes/${mailboxId}/folders/${folder}/messages`,
    { params: { page, perPage, sort } }
  )
  return data as MessagesCollection
}

async function getMessage(
  mailboxId: string,
  folder: string,
  uid: number
): Promise<MailMessage> {
  const { data } = await client.get(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/${uid}`
  )
  return (data?.data ?? data) as MailMessage
}

async function getMessageText(
  mailboxId: string,
  folder: string,
  uid: number
): Promise<MessageText> {
  const { data } = await client.get(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/${uid}/text`
  )
  const payload = data?.data ?? data
  return {
    text: payload?.text ?? '',
    html: payload?.html ?? '',
  } as MessageText
}

async function sendEmail(
  mailboxId: string,
  payload: SendEmailPayload
): Promise<void> {
  await client.post(`/mailboxes/${mailboxId}/send`, payload)
}

async function deleteMessage(
  mailboxId: string,
  folder: string,
  uid: number
): Promise<void> {
  await client.delete(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/${uid}`
  )
}

async function deleteMessages(
  mailboxId: string,
  folder: string,
  uids: number[]
): Promise<void> {
  const body: DeleteBulkRequest = { uids }
  await client.post(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/delete`,
    body
  )
}

async function deleteAllMessages(
  mailboxId: string,
  folder: string
): Promise<void> {
  await client.delete(`/mailboxes/${mailboxId}/folders/${folder}/messages`)
}

async function updateMessageFlags(
  mailboxId: string,
  folder: string,
  uid: number,
  operation: FlagOperation
): Promise<MailMessage> {
  const { data } = await client.patch(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/${uid}`,
    operation
  )
  return (data?.data ?? data) as MailMessage
}

async function moveMessage(
  mailboxId: string,
  folder: string,
  uid: number,
  targetFolder: string
): Promise<void> {
  const body: MoveRequest = { targetFolder }
  await client.post(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/${uid}/move`,
    body
  )
}

async function moveMessages(
  mailboxId: string,
  folder: string,
  uids: number[],
  targetFolder: string
): Promise<void> {
  const body: MoveBulkRequest = { uids, targetFolder }
  await client.post(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/move`,
    body
  )
}

async function searchMessages(
  mailboxId: string,
  folder: string,
  criteria: SearchCriteria,
  page = 1,
  perPage = 25,
  sort = '-uid'
): Promise<MessagesCollection> {
  const { data } = await client.post(
    `/mailboxes/${mailboxId}/folders/${folder}/messages/search`,
    criteria,
    { params: { page, perPage, sort } }
  )
  return data as MessagesCollection
}

async function getQuota(mailboxId: string): Promise<Quota> {
  const { data } = await client.get(`/mailboxes/${mailboxId}/quota`)
  return (data?.data ?? data) as Quota
}

export const hostingerMail = {
  getAccount,
  getFolders,
  getMessages,
  getMessage,
  getMessageText,
  sendEmail,
  deleteMessage,
  deleteMessages,
  deleteAllMessages,
  updateMessageFlags,
  moveMessage,
  moveMessages,
  searchMessages,
  getQuota,
}
