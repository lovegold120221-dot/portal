import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import {
  Inbox,
  Mail,
  Send,
  Trash2,
  Star,
  Reply,
  PenSquare,
  Loader2,
  Search,
  MailOpen,
  MailX,
  ChevronLeft,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react'
import { useUser } from '@clerk/react'
import { useUserMailAccess } from '@/lib/user-mail'
import {
  type MailFolder,
  type MailMessage,
  type Mailbox,
  type MessageText,
} from '@/lib/hostinger-mail'
import { hostingerMail } from '@/lib/hostinger-mail-api'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as GlobalSearch } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const FOLDER_ICONS: Record<string, React.ElementType> = {
  INBOX: Inbox,
  Sent: Send,
  Trash: Trash2,
  Drafts: Mail,
  Junk: AlertCircle,
  Spam: AlertCircle,
}

function getFolderIcon(folder: MailFolder): React.ElementType {
  if (folder.specialUse) {
    const map: Record<string, React.ElementType> = {
      '\\Inbox': Inbox,
      '\\Sent': Send,
      '\\Trash': Trash2,
      '\\Drafts': Mail,
      '\\Junk': AlertCircle,
    }
    return map[folder.specialUse] || FOLDER_ICONS[folder.name] || Mail
  }
  return FOLDER_ICONS[folder.name] || Mail
}

export function MailFeature() {
  useUser();
  const userMailAccess = useUserMailAccess()

  const [mailbox, setMailbox] = useState<Mailbox | null>(null)
  const [folders, setFolders] = useState<MailFolder[]>([])
  const [activeFolder, setActiveFolder] = useState<string>('INBOX')
  const [messages, setMessages] = useState<MailMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<MailMessage | null>(
    null,
  )
  const [messageText, setMessageText] = useState('')
  const [messageHtml, setMessageHtml] = useState('')
  const [loadingMailbox, setLoadingMailbox] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Only fetch mailboxes if user has ebrun-branded email
  useEffect(() => {
    if (!userMailAccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingMailbox(false)
      return
    }
    let active = true
    async function init() {
      try {
        const mailboxes = await hostingerMail.getAccount()
        if (!active) return
        if (mailboxes.length === 0) {
          setError('No mailboxes found for this token.')
          setLoadingMailbox(false)
          return
        }
        const mb = mailboxes[0]
        setMailbox(mb)
        const folderData = await hostingerMail.getFolders(mb.resourceId)
        if (!active) return
        setFolders(folderData.data)
        setLoadingMailbox(false)
      } catch {
        if (!active) return
        setError('Failed to connect to Hostinger Mail API.')
        setLoadingMailbox(false)
      }
    }
    init()
    return () => {
      active = false
    }
  }, [userMailAccess])

  const loadMessages = useCallback(
    async (folder: string, p: number = 1) => {
      if (!mailbox) return
      setLoadingMessages(true)
      setSelectedMessage(null)
      try {
        const data = await hostingerMail.getMessages(
          mailbox.resourceId,
          folder,
          p,
        )
        setMessages(data.data)
        setTotalPages(data.pagination?.totalPages ?? 1)
        setPage(p)
      } catch {
        setError('Failed to load messages.')
      } finally {
        setLoadingMessages(false)
      }
    },
    [mailbox],
  )

  useEffect(() => {
    if (!mailbox) return
    if (!userMailAccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingMessages(false)
      return
    }
    let active = true
    Promise.resolve().then(() => {
      if (!active) return
      setLoadingMessages(true)
      setSelectedMessage(null)
    })
    hostingerMail
      .getMessages(mailbox.resourceId, activeFolder, 1)
      .then((data) => {
        if (!active) return
        setMessages(data.data)
        setTotalPages(data.pagination?.totalPages ?? 1)
        setPage(1)
      })
      .catch(() => {
        if (active) setError('Failed to load messages.')
      })
      .finally(() => {
        if (active) setLoadingMessages(false)
      })
    return () => {
      active = false
    }
  }, [mailbox, activeFolder, userMailAccess])

  const openMessage = async (msg: MailMessage) => {
    if (!mailbox) return
    setLoadingDetail(true)
    setSelectedMessage(msg)
    try {
      const [full, textData] = await Promise.all([
        hostingerMail.getMessage(mailbox.resourceId, activeFolder, msg.uid),
        hostingerMail.getMessageText(mailbox.resourceId, activeFolder, msg.uid),
      ])
      setSelectedMessage({ ...full, ...msg })
      setMessageText((textData as MessageText).text)
      setMessageHtml((textData as MessageText).html)
      // getMessageText already marks the message as \Seen on the server
      if (msg.unseen) {
        setMessages((prev) =>
          prev.map((m) => (m.uid === msg.uid ? { ...m, unseen: false } : m)),
        )
      }
    } catch {
      setError('Failed to load message.')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleDelete = async (uid: number) => {
    if (!mailbox) return
    try {
      await hostingerMail.deleteMessage(mailbox.resourceId, activeFolder, uid)
      setMessages((prev) => prev.filter((m) => m.uid !== uid))
      setSelectedMessage(null)
      setMessageText('')
      setMessageHtml('')
    } catch {
      setError('Failed to delete message.')
    }
  }

  const handleStar = async (msg: MailMessage) => {
    if (!mailbox) return
    const isStarred = msg.flags.includes('\\Flagged')
    const operation = isStarred
      ? { removeFlags: ['\\Flagged'] }
      : { addFlags: ['\\Flagged'] }
    try {
      await hostingerMail.updateMessageFlags(
        mailbox.resourceId,
        activeFolder,
        msg.uid,
        operation,
      )
      setMessages((prev) =>
        prev.map((m) =>
          m.uid === msg.uid
            ? {
                ...m,
                flags: isStarred
                  ? m.flags.filter((f: string) => f !== '\\Flagged')
                  : [...m.flags, '\\Flagged'],
              }
            : m,
        ),
      )
      if (selectedMessage?.uid === msg.uid) {
        setSelectedMessage((prev) =>
          prev
            ? {
                ...prev,
                flags: isStarred
                  ? prev.flags.filter((f: string) => f !== '\\Flagged')
                  : [...prev.flags, '\\Flagged'],
              }
            : prev,
        )
      }
    } catch {
      setError('Failed to update flag.')
    }
  }

  const filteredMessages = messages.filter((m) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      m.subject?.toLowerCase().includes(q) ||
      m.from?.address?.toLowerCase().includes(q) ||
      m.from?.name?.toLowerCase().includes(q)
    )
  })

  const totalUnread = folders.reduce((acc, f) => acc + f.unreadCount, 0)

  return (
    <>
      <Header>
        <GlobalSearch className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        {loadingMailbox ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : !userMailAccess ? (
          <div className='flex h-full flex-col items-center justify-center gap-4'>
            <ShieldAlert className='size-12 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>
              Mail access is restricted to ebrun-branded accounts.
            </p>
            <p className='text-xs text-muted-foreground'>
              Sign in with an ebrun account to view your email.
            </p>
          </div>
        ) : error && !mailbox ? (
          <div className='flex h-full flex-col items-center justify-center gap-4'>
            <AlertCircle className='size-12 text-destructive' />
            <p className='text-muted-foreground'>{error}</p>
          </div>
        ) : (
          <div className='flex h-full gap-4'>
            {/* Folder Sidebar */}
            <div className='flex w-48 flex-col gap-1 sm:w-56'>
              <Button
                className='mb-2 w-full gap-2'
                onClick={() => setComposeOpen(true)}
              >
                <PenSquare className='size-4' />
                Compose
              </Button>
              <ScrollArea className='flex-1'>
                {folders.map((folder) => {
                  const Icon = getFolderIcon(folder)
                  const isActive = activeFolder === folder.path
                  return (
                    <button
                      key={folder.path}
                      onClick={() => setActiveFolder(folder.path)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        isActive ? 'bg-muted font-medium' : 'hover:bg-muted/50',
                      )}
                    >
                      <Icon className='size-4 shrink-0 text-muted-foreground' />
                      <span className='flex-1 truncate text-start'>
                        {folder.name}
                      </span>
                      {folder.unreadCount > 0 && (
                        <Badge variant='secondary' className='text-xs'>
                          {folder.unreadCount}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </ScrollArea>
              {mailbox && (
                <div className='border-t pt-2'>
                  <p className='truncate px-3 text-xs text-muted-foreground'>
                    {mailbox.address}
                  </p>
                  <p className='px-3 text-xs text-muted-foreground'>
                    {totalUnread} unread
                  </p>
                </div>
              )}
            </div>

            {/* Message List */}
            <div className='flex w-64 flex-col gap-2 sm:w-72'>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <Search className='absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    placeholder='Search mail...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='h-9 pl-8'
                  />
                </div>
              </div>
              <ScrollArea className='flex-1'>
                {loadingMessages ? (
                  <div className='flex h-full items-center justify-center py-8'>
                    <Loader2 className='size-6 animate-spin text-muted-foreground' />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className='flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground'>
                    <MailX className='size-8' />
                    <p className='text-sm'>No messages</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <button
                      key={msg.uid}
                      onClick={() => openMessage(msg)}
                      className={cn(
                        'flex w-full flex-col gap-1 border-b p-3 text-start transition-colors hover:bg-muted/50',
                        selectedMessage?.uid === msg.uid && 'bg-muted',
                        msg.unseen && 'font-semibold',
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        {!msg.unseen ? (
                          <MailOpen className='size-4 shrink-0 text-muted-foreground' />
                        ) : (
                          <Mail className='size-4 shrink-0 text-primary' />
                        )}
                        <span className='truncate text-sm'>
                          {msg.from?.name || msg.from?.address || 'Unknown'}
                        </span>
                        {msg.flags.includes('\\Flagged') && (
                          <Star className='size-3 shrink-0 fill-yellow-400 text-yellow-400' />
                        )}
                        <span className='ml-auto shrink-0 text-xs text-muted-foreground'>
                          {format(new Date(msg.date), 'MMM d')}
                        </span>
                      </div>
                      <p className='truncate text-sm'>
                        {msg.subject || '(no subject)'}
                      </p>
                      {msg.attachments?.length > 0 && (
                        <p className='text-xs text-muted-foreground'>
                          {msg.attachments.length} attachment(s)
                        </p>
                      )}
                    </button>
                  ))
                )}
              </ScrollArea>
              {totalPages > 1 && (
                <div className='flex items-center justify-between px-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={page <= 1}
                    onClick={() => loadMessages(activeFolder, page - 1)}
                  >
                    <ChevronLeft className='size-4' />
                    Prev
                  </Button>
                  <span className='text-xs text-muted-foreground'>
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={page >= totalPages}
                    onClick={() => loadMessages(activeFolder, page + 1)}
                  >
                    Next
                    <ChevronLeft className='size-4 rotate-180' />
                  </Button>
                </div>
              )}
            </div>

            {/* Message Detail */}
            <div className='flex flex-1 flex-col'>
              {selectedMessage ? (
                <>
                  <div className='flex items-start justify-between gap-2 border-b pb-3'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-10'>
                        <AvatarFallback>
                          {getDisplayNameInitials(
                            selectedMessage.from?.name ||
                              selectedMessage.from?.address ||
                              '?',
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>
                          {selectedMessage.from?.name ||
                            selectedMessage.from?.address ||
                            'Unknown'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {selectedMessage.from?.address}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleStar(selectedMessage)}
                      >
                        <Star
                          className={cn(
                            'size-4',
                            selectedMessage.flags.includes('\\Flagged') &&
                              'fill-yellow-400 text-yellow-400',
                          )}
                        />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleDelete(selectedMessage.uid)}
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='py-3'>
                    <h2 className='text-lg font-semibold'>
                      {selectedMessage.subject || '(no subject)'}
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      {format(new Date(selectedMessage.date), 'PPpp')}
                    </p>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <div className='text-xs text-muted-foreground'>
                        To:{' '}
                        {selectedMessage.to
                          ?.map((t: { address: string }) => t.address)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <ScrollArea className='flex-1'>
                    {loadingDetail ? (
                      <div className='flex h-full items-center justify-center py-8'>
                        <Loader2 className='size-6 animate-spin text-muted-foreground' />
                      </div>
                    ) : (
                      <div
                        className='prose prose-sm max-w-none py-4 text-sm leading-relaxed whitespace-pre-wrap'
                        dangerouslySetInnerHTML={{
                          __html: messageHtml || messageText,
                        }}
                      />
                    )}
                  </ScrollArea>
                  <div className='border-t pt-3'>
                    <Button
                      variant='outline'
                      onClick={() => setComposeOpen(true)}
                    >
                      <Reply className='size-4' />
                      Reply
                    </Button>
                  </div>
                </>
              ) : (
                <div className='flex h-full flex-col items-center justify-center gap-4 text-muted-foreground'>
                  <Mail className='size-12' />
                  <p>Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Main>

      <ComposeDialog
        key={`compose-${composeOpen}-${selectedMessage?.uid ?? 'none'}`}
        open={composeOpen}
        onOpenChange={setComposeOpen}
        mailbox={mailbox}
        initialTo={
          selectedMessage && composeOpen
            ? selectedMessage.from?.address || ''
            : ''
        }
        initialSubject={
          selectedMessage && composeOpen
            ? selectedMessage.subject?.startsWith('Re:')
              ? selectedMessage.subject
              : `Re: ${selectedMessage.subject || ''}`
            : ''
        }
      />
    </>
  )
}

function ComposeDialog({
  open,
  onOpenChange,
  mailbox,
  initialTo,
  initialSubject,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mailbox: Mailbox | null
  initialTo: string
  initialSubject: string
}) {
  const [to, setTo] = useState(initialTo)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mailbox || !to.trim()) return
    setSending(true)
    try {
      await hostingerMail.sendEmail(mailbox.resourceId, {
        to: to.split(',').map((s) => s.trim()),
        subject: subject.trim(),
        text: body,
      })
      onOpenChange(false)
      setTo('')
      setSubject('')
      setBody('')
    } catch {
      // Error handled by global handler
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSend} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='to'>To</Label>
            <Input
              id='to'
              placeholder='recipient@example.com'
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input
              id='subject'
              placeholder='Subject'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='body'>Message</Label>
            <Textarea
              id='body'
              placeholder='Write your message...'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className='min-h-32'
            />
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={sending}>
              {sending && <Loader2 className='size-4 animate-spin' />}
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
