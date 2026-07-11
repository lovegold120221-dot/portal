export type MailAddress = {
  name: string
  address: string
}

export type MailAttachment = {
  id: string
  filename: string | null
  contentType: string
  sizeBytes: number
  inline: boolean
  contentId: string | null
}

export type MailMessage = {
  uid: number
  path: string
  date: string
  flags: string[]
  unseen: boolean
  size: number
  subject: string | null
  from: MailAddress | null
  to: MailAddress[]
  cc: MailAddress[]
  bcc: MailAddress[]
  messageId: string | null
  inReplyTo: string | null
  attachments: MailAttachment[]
}

export type MailFolder = {
  path: string
  name: string
  delimiter: string
  specialUse: string | null
  messageCount: number
  unreadCount: number
}

export type Mailbox = {
  resourceId: string
  address: string
}

export type Pagination = {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type MessagesCollection = {
  data: MailMessage[]
  pagination: Pagination
}

export type FoldersCollection = {
  data: MailFolder[]
  pagination: Pagination
}

export type QuotaResource = {
  resourceName: string
  usage: number
  limit: number
  percentage: number
}

export type Quota = {
  quotas: QuotaResource[]
  totalUsage: number
  totalLimit: number
  totalPercentage: number
  supported: boolean
}

export type MessageText = {
  text: string
  html: string
}

export type SendEmailPayload = {
  to?: string[]
  displayName?: string
  cc?: string[]
  bcc?: string[]
  subject?: string
  text?: string
  html?: string
  attachments?: SendAttachment[]
}

export type SendAttachment = {
  filename: string
  content: string
  contentType?: string
  cid?: string
  encoding?: string
}

export type SearchCriteria = {
  since?: string
  before?: string
  flags?: string[]
  uid?: string
  subject?: string
  from?: string
  to?: string
  cc?: string
  body?: string
  header?: string
  larger?: number
  smaller?: number
  text?: string
}

export type FlagOperation = {
  addFlags?: string[]
  removeFlags?: string[]
}

export type DeleteBulkRequest = {
  uids: number[]
}

export type MoveRequest = {
  targetFolder: string
}

export type MoveBulkRequest = {
  uids: number[]
  targetFolder: string
}

export type FlagsBulkRequest = {
  uids: number[]
  addFlags?: string[]
  removeFlags?: string[]
}
