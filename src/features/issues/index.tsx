import { useState, useRef, type ChangeEvent } from 'react'
import { format } from 'date-fns'
import { Bug, Paperclip, X, Plus, ExternalLink, ImageUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { eburonApps } from '@/features/apps/data/apps'

type IssueStatus = 'open' | 'in progress' | 'resolved' | 'closed'

type Issue = {
  id: string
  title: string
  description: string
  status: IssueStatus
  app: string
  screenshot: string | null
  reporter: string
  createdAt: Date
}

const statusStyles: Record<IssueStatus, string> = {
  open: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'in progress':
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

const initialIssues: Issue[] = []

export function Issues() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [filter, setFilter] = useState<IssueStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newApp, setNewApp] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = issues
    .filter((i) => filter === 'all' || i.status === filter)
    .filter(
      (i) =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const handleScreenshot = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setScreenshot(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const createIssue = () => {
    if (!newTitle.trim() || !newApp) return
    const issue: Issue = {
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      title: newTitle,
      description: newDesc,
      status: 'open',
      app: newApp,
      screenshot,
      reporter: 'You',
      createdAt: new Date(),
    }
    setIssues([issue, ...issues])
    setNewTitle('')
    setNewDesc('')
    setNewApp('')
    setScreenshot(null)
    setOpen(false)
  }

  const counts = {
    all: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    'in progress': issues.filter((i) => i.status === 'in progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    closed: issues.filter((i) => i.status === 'closed').length,
  }

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Issues</h1>
            <p className='text-muted-foreground'>
              Report bugs and track issues across Eburon apps.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <Plus className='size-4' />
                New Issue
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
              <DialogHeader>
                <DialogTitle>Report an Issue</DialogTitle>
                <DialogDescription>
                  Describe the problem you found in any Eburon app.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>App</label>
                  <Select value={newApp} onValueChange={setNewApp}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select app...' />
                    </SelectTrigger>
                    <SelectContent>
                      {eburonApps.map((app) => (
                        <SelectItem key={app.name} value={app.name}>
                          {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Title</label>
                  <Input
                    placeholder='Brief description of the issue...'
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Description</label>
                  <Textarea
                    placeholder='Steps to reproduce, expected vs actual behavior...'
                    rows={4}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Screenshot</label>
                  <input
                    ref={fileRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleScreenshot}
                  />
                  {screenshot ? (
                    <div className='relative'>
                      <img
                        src={screenshot}
                        alt='Screenshot preview'
                        className='max-h-48 rounded-lg border object-contain'
                      />
                      <Button
                        size='icon'
                        variant='destructive'
                        className='absolute top-1 right-1 size-6'
                        onClick={() => setScreenshot(null)}
                      >
                        <X className='size-3' />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='outline'
                      className='gap-2'
                      onClick={() => fileRef.current?.click()}
                    >
                      <ImageUp className='size-4' />
                      Attach screenshot
                    </Button>
                  )}
                </div>
                <Button onClick={createIssue} disabled={!newTitle || !newApp}>
                  Submit Issue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className='mt-4 flex items-center gap-2'>
          {(['all', 'open', 'in progress', 'resolved', 'closed'] as const).map(
            (s) => (
              <Button
                key={s}
                variant={filter === s ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter(s)}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                <span className='ms-1.5 text-xs opacity-70'>({counts[s]})</span>
              </Button>
            )
          )}
          <Input
            placeholder='Search issues...'
            className='ms-auto h-9 w-56'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Separator className='my-4 shadow-sm' />

        <div className='space-y-3'>
          {filtered.map((issue) => (
            <Card key={issue.id}>
              <CardHeader className='p-4 pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted'>
                      <Bug className='size-4 text-muted-foreground' />
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-muted-foreground'>
                          {issue.id}
                        </span>
                        <Badge
                          className={`text-xs ${statusStyles[issue.status]}`}
                          variant='outline'
                        >
                          {issue.status}
                        </Badge>
                      </div>
                      <CardTitle className='mt-1 text-sm'>
                        {issue.title}
                      </CardTitle>
                      <CardDescription className='mt-1 text-xs'>
                        {issue.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <Badge variant='secondary' className='text-xs'>
                      {issue.app}
                    </Badge>
                    {issue.screenshot && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-6'
                          >
                            <ExternalLink className='size-3' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-2xl'>
                          <img
                            src={issue.screenshot}
                            alt='Issue screenshot'
                            className='w-full rounded-lg'
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='px-4 pb-3'>
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <Avatar className='size-5'>
                      <AvatarFallback className='text-[10px]'>
                        {issue.reporter
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {issue.reporter}
                  </div>
                  <span>&middot;</span>
                  <span>{format(issue.createdAt, 'MMM d, yyyy')}</span>
                  {issue.screenshot && (
                    <>
                      <span>&middot;</span>
                      <span className='flex items-center gap-1'>
                        <Paperclip className='size-3' />
                        Screenshot
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className='py-12 text-center text-sm text-muted-foreground'>
              No issues found.
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
