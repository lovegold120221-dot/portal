import { useEffect, useMemo, useRef, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { useUser } from '@clerk/react'
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Paperclip,
  Phone,
  ImagePlus,
  Plus,
  Search as SearchIcon,
  Send,
  Video,
  MessagesSquare,
  VolumeX,
  Volume2,
  LogOut,
  Eraser,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { clerkUserToUser } from '@/lib/clerk-mapper'
import { clerkUsers } from '@/lib/clerk-users-api'
import { supabase } from '@/lib/supabase'
import {
  type ChatMessage,
  type Conversation,
  clearMessages,
  createGroupConversation,
  getOrCreateDirectConversation,
  leaveConversation,
  listConversations,
  markRead,
  sendMessage,
  uploadAttachment,
} from '@/lib/supabase-chats'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NewChat } from './components/new-chat'
import { type ChatUser } from './data/chat-types'

export function Chats() {
  const { user: clerkUser } = useUser()
  const meId = clerkUser?.id ?? ''

  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [directoryUsers, setDirectoryUsers] = useState<ChatUser[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [mobileSelectedConversationId, setMobileSelectedConversationId] =
    useState<string | null>(null)
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)
  const [messageText, setMessageText] = useState('')
  const [muted, setMuted] = useState<Set<string>>(new Set())
  const mutedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    mutedRef.current = muted
  }, [muted])
  const [call, setCall] = useState<{ type: 'video' | 'audio' } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedIdRef = useRef<string | null>(null)
  useEffect(() => {
    selectedIdRef.current = selectedConversationId
  }, [selectedConversationId])

  const directoryById = useMemo(
    () => Object.fromEntries(directoryUsers.map((u) => [u.id, u])),
    [directoryUsers]
  )

  useEffect(() => {
    if (!meId) return
    let active = true

    listConversations(meId)
      .then((c) => {
        if (active) setConversations(c)
      })
      .catch(() => {
        // Conversations unavailable — start empty
      })

    const channel = supabase
      .channel('messages:global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new as {
            id: string
            conversation_id: string
            sender_id: string
            body: string
            created_at: string
            reply_to: string | null
          }
          const msg: ChatMessage = {
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            body: row.body,
            createdAt: row.created_at,
            replyTo: row.reply_to,
          }
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== msg.conversationId) return c
              if (c.messages.some((m) => m.id === msg.id)) return c
              const isMine = msg.senderId === meId
              const isOpen = selectedIdRef.current === c.id
              const isMuted = mutedRef.current.has(c.id)
              return {
                ...c,
                messages: [...c.messages, msg],
                lastMessageAt: msg.createdAt,
                unread: isMine || isOpen || isMuted ? 0 : c.unread + 1,
              }
            })
          )
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [meId])

  useEffect(() => {
    if (!meId) return
    let active = true
    async function loadDirectory() {
      try {
        const { data: rawUsers } = await clerkUsers.listUsers(500)
        const directory = rawUsers
          .map(clerkUserToUser)
          .filter((u) => u.id !== meId)
          .map((u) => ({
            id: u.id,
            fullName: `${u.first_name} ${u.last_name}`.trim() || u.email,
            username: u.email || u.username,
            profile: '',
            title: u.role,
            messages: [],
          }))
        if (active) setDirectoryUsers(directory)
      } catch {
        // Directory unavailable — fall back to existing conversation list only
      }
    }
    loadDirectory()
    return () => {
      active = false
    }
  }, [meId])

  const convDisplay = (conv: Conversation) => {
    if (conv.type === 'group') {
      return {
        title: conv.name ?? 'Group',
        subtitle: `${conv.members.length} members`,
        profile: '',
        isGroup: true,
      }
    }
    const peer = conv.members.find((m) => m.userId !== meId)
    const peerUser = peer ? directoryById[peer.userId] : undefined
    return {
      title: peerUser?.fullName ?? peer?.userId ?? 'Unknown',
      subtitle: peerUser?.title ?? '',
      profile: peerUser?.profile ?? '',
      isGroup: false,
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    convDisplay(conv).title.toLowerCase().includes(search.trim().toLowerCase())
  )

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? null
  const selectedIsGroup = selectedConversation?.type === 'group'
  const selectedPeer = selectedConversation?.members.find(
    (m) => m.userId !== meId
  )
  const selectedPeerUser = selectedPeer
    ? directoryById[selectedPeer.userId]
    : undefined
  const selectedTitle = selectedIsGroup
    ? (selectedConversation?.name ?? 'Group')
    : (selectedPeerUser?.fullName ?? selectedPeer?.userId ?? '')
  const selectedSubtitle = selectedIsGroup
    ? `${selectedConversation?.members.length} members`
    : (selectedPeerUser?.title ?? '')
  const selectedProfile = selectedIsGroup
    ? ''
    : (selectedPeerUser?.profile ?? '')

  const currentMessage = useMemo(() => {
    const messages = selectedConversation?.messages ?? []
    return messages.reduce<Record<string, ChatMessage[]>>((acc, obj) => {
      const key = format(new Date(obj.createdAt), 'd MMM, yyyy')
      if (!acc[key]) acc[key] = []
      acc[key].push(obj)
      return acc
    }, {})
  }, [selectedConversation])

  const handleSelect = (convId: string) => {
    setSelectedConversationId(convId)
    setMobileSelectedConversationId(convId)
    if (meId) {
      markRead(convId, meId).catch(() => {})
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c))
      )
    }
  }

  const handleStartConversation = async (
    recipients: ChatUser[],
    groupName?: string
  ) => {
    if (!meId || recipients.length === 0) return
    try {
      let convId: string
      if (recipients.length === 1) {
        convId = await getOrCreateDirectConversation(meId, recipients[0].id)
      } else {
        convId = await createGroupConversation(
          groupName ?? 'Group',
          [meId, ...recipients.map((r) => r.id)],
          meId
        )
      }
      const refreshed = await listConversations(meId)
      setConversations(refreshed)
      handleSelect(convId)
    } catch {
      // Failed to create conversation
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversationId || !meId) return
    const text = messageText.trim()
    setMessageText('')
    try {
      const saved = await sendMessage(selectedConversationId, meId, text)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                messages: [...c.messages, saved],
                lastMessageAt: saved.createdAt,
              }
            : c
        )
      )
    } catch {
      // Failed to send
    }
  }

  const toggleMute = (convId: string) => {
    setMuted((prev) => {
      const next = new Set(prev)
      if (next.has(convId)) {
        next.delete(convId)
        toast.success('Unmuted conversation')
      } else {
        next.add(convId)
        toast.success('Muted conversation')
      }
      return next
    })
  }

  const handleClearMessages = async () => {
    if (!selectedConversationId) return
    try {
      await clearMessages(selectedConversationId)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? { ...c, messages: [], unread: 0 }
            : c
        )
      )
      toast.success('Conversation cleared')
    } catch {
      toast.error('Failed to clear conversation')
    }
  }

  const handleLeave = async () => {
    if (!selectedConversationId || !meId) return
    try {
      await leaveConversation(selectedConversationId, meId)
      setConversations((prev) =>
        prev.filter((c) => c.id !== selectedConversationId)
      )
      setSelectedConversationId(null)
      setMobileSelectedConversationId(null)
      toast.success('Left conversation')
    } catch {
      toast.error('Failed to leave conversation')
    }
  }

  const attachIsImageRef = useRef(false)
  const openFilePicker = (isImage: boolean) => {
    attachIsImageRef.current = isImage
    const input = fileInputRef.current
    if (input) {
      input.accept = isImage ? 'image/*' : '*/*'
      input.click()
    }
  }

  const handleAttach = async (file: File) => {
    if (!selectedConversationId || !meId) return
    const isImage = attachIsImageRef.current
    try {
      let body: string
      try {
        const url = await uploadAttachment(selectedConversationId, file)
        body = `${isImage ? '🖼️' : '📎'} ${file.name}\n${url}`
      } catch {
        body = `${isImage ? '🖼️' : '📎'} ${file.name}`
        toast.warning('Attachment upload failed; shared as a file name.')
      }
      const saved = await sendMessage(selectedConversationId, meId, body)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                messages: [...c.messages, saved],
                lastMessageAt: saved.createdAt,
              }
            : c
        )
      )
    } catch {
      toast.error('Failed to send attachment')
    }
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Inbox</h1>
                  <MessagesSquare size={20} />
                </div>

                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setCreateConversationDialog(true)}
                  className='rounded-lg'
                >
                  <Edit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label
                className={cn(
                  'focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden',
                  'flex h-10 w-full items-center space-x-0 rounded-md border border-border ps-2'
                )}
              >
                <SearchIcon size={15} className='me-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden'
                  placeholder='Search chat...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full overflow-scroll p-3'>
              {filteredConversations.map((conv) => {
                const { title, subtitle, profile, isGroup } = convDisplay(conv)
                const last = conv.messages[conv.messages.length - 1]
                const lastMsg = last
                  ? last.senderId === meId
                    ? `You: ${last.body}`
                    : last.body
                  : 'No messages yet'
                return (
                  <Fragment key={conv.id}>
                    <button
                      type='button'
                      className={cn(
                        'group hover:bg-accent hover:text-accent-foreground',
                        `flex w-full rounded-md px-2 py-2 text-start text-sm`,
                        selectedConversationId === conv.id && 'sm:bg-muted'
                      )}
                      onClick={() => handleSelect(conv.id)}
                    >
                      <div className='flex w-full gap-2'>
                        <div className='relative'>
                          <Avatar>
                            <AvatarImage src={profile} alt={title} />
                            <AvatarFallback>
                              {getDisplayNameInitials(title)}
                            </AvatarFallback>
                          </Avatar>
                          {conv.unread > 0 && (
                            <span className='absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground'>
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <span className='col-start-2 row-span-2 block truncate font-medium'>
                            {title}
                            {isGroup && (
                              <MessagesSquare
                                size={12}
                                className='ms-1 inline stroke-muted-foreground'
                              />
                            )}
                          </span>
                          <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 block text-ellipsis text-muted-foreground group-hover:text-accent-foreground/90'>
                            {lastMsg}
                          </span>
                          {subtitle && (
                            <span className='block truncate text-xs text-muted-foreground'>
                              {subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    <Separator className='my-1' />
                  </Fragment>
                )
              })}
            </ScrollArea>
          </div>

          {/* Right Side */}
          {selectedConversation ? (
            <div
              className={cn(
                'absolute inset-0 inset-s-full z-50 hidden w-full flex-1 flex-col border bg-background shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md',
                mobileSelectedConversationId && 'inset-s-0 flex'
              )}
            >
              {/* Top Part */}
              <div className='mb-1 flex flex-none justify-between bg-card p-4 shadow-lg sm:rounded-t-md'>
                {/* Left */}
                <div className='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ms-2 h-full sm:hidden'
                    onClick={() => setMobileSelectedConversationId(null)}
                  >
                    <ArrowLeft className='rtl:rotate-180' />
                  </Button>
                  <div className='flex items-center gap-2 lg:gap-4'>
                    <Avatar className='size-9 lg:size-11'>
                      <AvatarImage src={selectedProfile} alt={selectedTitle} />
                      <AvatarFallback>
                        {getDisplayNameInitials(selectedTitle)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className='col-start-2 row-span-2 block text-sm font-medium lg:text-base'>
                        {selectedTitle}
                      </span>
                      <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis text-muted-foreground lg:max-w-none lg:text-sm'>
                        {selectedSubtitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className='-me-1 flex items-center gap-1 lg:gap-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setCall({ type: 'video' })}
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <Video size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setCall({ type: 'audio' })}
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <Phone size={22} className='stroke-muted-foreground' />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                      >
                        <MoreVertical className='stroke-muted-foreground sm:size-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() =>
                          selectedConversationId &&
                          toggleMute(selectedConversationId)
                        }
                      >
                        {selectedConversationId &&
                        muted.has(selectedConversationId) ? (
                          <Volume2 className='me-2 size-4' />
                        ) : (
                          <VolumeX className='me-2 size-4' />
                        )}
                        {selectedConversationId &&
                        muted.has(selectedConversationId)
                          ? 'Unmute'
                          : 'Mute'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClearMessages}>
                        <Eraser className='me-2 size-4' />
                        Clear messages
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLeave}
                        className='text-destructive focus:text-destructive'
                      >
                        <LogOut className='me-2 size-4' />
                        Leave conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Conversation */}
              <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4'>
                <div className='flex size-full flex-1'>
                  <div className='chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div className='chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4'>
                      {Object.keys(currentMessage).map((key) => (
                        <Fragment key={key}>
                          {currentMessage[key].map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                'chat-box max-w-72 px-3 py-2 wrap-break-word shadow-lg',
                                msg.senderId === meId
                                  ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75'
                                  : 'self-start rounded-[16px_16px_16px_0] bg-muted'
                              )}
                            >
                              {msg.body}{' '}
                              <span
                                className={cn(
                                  'mt-1 block text-xs font-light text-foreground/75 italic',
                                  msg.senderId === meId &&
                                    'text-end text-primary-foreground/85'
                                )}
                              >
                                {format(new Date(msg.createdAt), 'h:mm a')}
                              </span>
                            </div>
                          ))}
                          <div className='text-center text-xs'>{key}</div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <form
                  className='flex w-full flex-none gap-2'
                  onSubmit={handleSend}
                >
                  <div className='flex flex-1 items-center gap-2 rounded-md border border-input bg-card px-2 py-1 focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden lg:gap-4'>
                    <div className='space-x-1'>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        onClick={() => openFilePicker(false)}
                        className='h-8 rounded-md'
                      >
                        <Plus size={20} className='stroke-muted-foreground' />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        onClick={() => openFilePicker(true)}
                        className='hidden h-8 rounded-md lg:inline-flex'
                      >
                        <ImagePlus
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        onClick={() => openFilePicker(false)}
                        className='hidden h-8 rounded-md lg:inline-flex'
                      >
                        <Paperclip
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type='file'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleAttach(file)
                        e.target.value = ''
                      }}
                    />
                    <label className='flex-1'>
                      <span className='sr-only'>Chat Text Box</span>
                      <input
                        type='text'
                        placeholder='Type your messages...'
                        className='h-8 w-full bg-inherit focus-visible:outline-hidden'
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                    </label>
                    <Button
                      variant='ghost'
                      size='icon'
                      type='submit'
                      className='hidden sm:inline-flex'
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                  <Button type='submit' className='h-full sm:hidden'>
                    <Send size={18} /> Send
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'absolute inset-0 inset-s-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-card shadow-xs sm:static sm:z-auto sm:flex'
              )}
            >
              <div className='flex flex-col items-center space-y-6'>
                <div className='flex size-16 items-center justify-center rounded-full border-2 border-border'>
                  <MessagesSquare className='size-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h1 className='text-xl font-semibold'>Your messages</h1>
                  <p className='text-sm text-muted-foreground'>
                    Send a message to start a chat.
                  </p>
                </div>
                <Button onClick={() => setCreateConversationDialog(true)}>
                  Send message
                </Button>
              </div>
            </div>
          )}
        </section>
        <NewChat
          users={directoryUsers}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
          onStartConversation={handleStartConversation}
        />
      </Main>

      <Dialog open={call !== null} onOpenChange={(o) => !o && setCall(null)}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {call?.type === 'video' ? (
                <Video className='size-5' />
              ) : (
                <Phone className='size-5' />
              )}
              {call?.type === 'video' ? 'Video' : 'Voice'} call
            </DialogTitle>
            <DialogDescription>
              Calling {selectedTitle || 'unknown'}…
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col items-center gap-6 py-4'>
            <Avatar className='size-20'>
              <AvatarImage src={selectedProfile} alt={selectedTitle} />
              <AvatarFallback>
                {getDisplayNameInitials(selectedTitle)}
              </AvatarFallback>
            </Avatar>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Loader2 className='size-4 animate-spin' />
              Ringing…
            </div>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => setCall(null)}
            >
              End call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
