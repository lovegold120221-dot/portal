import { useEffect, useRef, useState } from 'react'
import {
  AudioLines,
  BarChart3,
  Bot,
  Boxes,
  Brain,
  Code2,
  Database,
  Download,
  ExternalLink,
  Eye,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Network,
  Orbit,
  PanelRightOpen,
  Pencil,
  Scan,
  ScanText,
  Plus,
  Puzzle,
  Shield,
  Sparkles,
  Smartphone,
  Trash2,
  Workflow,
  X,
} from 'lucide-react'
import { getApps, addApp, updateApp, deleteApp } from '@/lib/supabase-apps'
import { getServices, setServiceConnected } from '@/lib/supabase-queries'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import type { Service } from '@/features/apps/data/services'
import type { User } from '@/features/users/data/schema'
import { users as allUsers } from '@/features/users/data/users'
import { eburonApps as defaultApps, type EburonApp } from './data/apps'

type Tab = 'apps' | 'services'

const iconOptions = [
  { name: 'Brain', icon: <Brain className='size-5' /> },
  { name: 'Code2', icon: <Code2 className='size-5' /> },
  { name: 'Mic', icon: <Mic className='size-5' /> },
  { name: 'Eye', icon: <Eye className='size-5' /> },
  { name: 'Workflow', icon: <Workflow className='size-5' /> },
  { name: 'Shield', icon: <Shield className='size-5' /> },
  { name: 'BarChart3', icon: <BarChart3 className='size-5' /> },
  { name: 'MessageSquare', icon: <MessageSquare className='size-5' /> },
  { name: 'Sparkles', icon: <Sparkles className='size-5' /> },
  { name: 'PanelRightOpen', icon: <PanelRightOpen className='size-5' /> },
  { name: 'Bot', icon: <Bot className='size-5' /> },
  { name: 'GraduationCap', icon: <GraduationCap className='size-5' /> },
  { name: 'AudioLines', icon: <AudioLines className='size-5' /> },
  { name: 'Database', icon: <Database className='size-5' /> },
  { name: 'Boxes', icon: <Boxes className='size-5' /> },
  { name: 'Network', icon: <Network className='size-5' /> },
  { name: 'Orbit', icon: <Orbit className='size-5' /> },
  { name: 'Scan', icon: <Scan className='size-5' /> },
  { name: 'ScanText', icon: <ScanText className='size-5' /> },
]

const colorOptions = [
  {
    value:
      'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    label: 'Violet',
  },
  {
    value: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    label: 'Blue',
  },
  {
    value:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    label: 'Emerald',
  },
  {
    value: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    label: 'Amber',
  },
  {
    value: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
    label: 'Rose',
  },
  {
    value: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    label: 'Red',
  },
  {
    value: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    label: 'Cyan',
  },
  {
    value:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    label: 'Indigo',
  },
  {
    value:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Yellow',
  },
  {
    value: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    label: 'Slate',
  },
]

const defaultDownloads = [
  { label: 'macOS (Apple Silicon)', url: null },
  { label: 'macOS (Intel)', url: null },
  { label: 'Debian / Ubuntu', url: null },
  { label: 'Windows', url: null },
  { label: 'APK', url: null },
]

const statusColors: Record<string, string> = {
  Stable:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  Beta: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  Alpha:
    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}

const emilAlvaro = allUsers.find((u) => u.email === 'emil.alvaro@eburon.ai')

const devUsers = allUsers.filter(
  (u) => u.role === 'developer' || u.role === 'admin'
)

export function Apps() {
  const { canManageApps } = useCurrentUser()
  const [tab, setTab] = useState<Tab>('apps')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    'macOS (Apple Silicon)'
  )
  const [apps, setApps] = useState(defaultApps)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newIcon, setNewIcon] = useState(iconOptions[0].name)
  const [newColor, setNewColor] = useState(colorOptions[0].value)
  const [selectedApp, setSelectedApp] = useState<EburonApp | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [appAssignees, setAppAssignees] = useState<Record<string, User[]>>(
    Object.fromEntries(
      defaultApps.map((app) => [app.name, emilAlvaro ? [emilAlvaro] : []])
    )
  )

  useEffect(() => {
    let active = true
    Promise.all([getServices(), getApps()]).then(([svcData, appData]) => {
      if (!active) return
      setServices(svcData)
      setApps(appData)
      setAppAssignees((prev) => {
        const next = { ...prev }
        appData.forEach((app) => {
          if (!next[app.name]) {
            next[app.name] = emilAlvaro ? [emilAlvaro] : []
          }
        })
        return next
      })
      setLoadingServices(false)
    })
    return () => {
      active = false
    }
  }, [])

  const handleConnect = async (slug: string) => {
    const next = !services.find((s) => s.slug === slug)?.connected
    setServices((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, connected: next } : s))
    )
    await setServiceConnected(slug, next)
  }

  const toggleAssignUser = (appName: string, user: User) => {
    setAppAssignees((prev) => {
      const current = prev[appName] || []
      const exists = current.some((u) => u.id === user.id)
      return {
        ...prev,
        [appName]: exists
          ? current.filter((u) => u.id !== user.id)
          : [...current, user],
      }
    })
  }

  const filteredApps = [...apps]
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const filteredServices = services
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const iconEl =
      iconOptions.find((i) => i.name === newIcon)?.icon ?? iconOptions[0].icon
    const newApp: EburonApp = {
      name: newName.trim(),
      logo: iconEl,
      icon: newIcon,
      desc: newDesc.trim(),
      color: newColor,
      url:
        newUrl.trim() ||
        `https://eburon.ai/${newName.trim().toLowerCase().replace(/\s+/g, '-')}`,
      downloads: defaultDownloads,
    }
    setApps((prev) => [...prev, newApp])
    setAppAssignees((prev) => ({
      ...prev,
      [newApp.name]: emilAlvaro ? [emilAlvaro] : [],
    }))
    addApp(newApp)
    setNewName('')
    setNewDesc('')
    setNewUrl('')
    setNewIcon(iconOptions[0].name)
    setNewColor(colorOptions[0].value)
    setDialogOpen(false)
  }

  // ── Edit App ─────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false)
  const [editApp, setEditApp] = useState<EburonApp | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [editIcon, setEditIcon] = useState(iconOptions[0].name)
  const [editColor, setEditColor] = useState(colorOptions[0].value)

  const openEdit = (app: EburonApp) => {
    setEditApp(app)
    setEditName(app.name)
    setEditDesc(app.desc)
    setEditUrl(app.url)
    setEditIcon(app.icon)
    setEditColor(app.color)
    setEditOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editApp || !editName.trim()) return
    const iconEl =
      iconOptions.find((i) => i.name === editIcon)?.icon ?? iconOptions[0].icon
    const updated: EburonApp = {
      ...editApp,
      logo: iconEl,
      icon: editIcon,
      desc: editDesc.trim(),
      color: editColor,
      url:
        editUrl.trim() ||
        `https://eburon.ai/${editName.trim().toLowerCase().replace(/\s+/g, '-')}`,
    }
    setApps((prev) => prev.map((a) => (a.name === editApp.name ? updated : a)))
    if (selectedApp?.name === editApp.name) setSelectedApp(updated)
    await updateApp(updated)
    setEditOpen(false)
    setEditApp(null)
  }

  // ── Remove App ──────────────────────────────────────────
  const handleRemove = async (app: EburonApp) => {
    setApps((prev) => prev.filter((a) => a.name !== app.name))
    setAppAssignees((prev) => {
      const next = { ...prev }
      delete next[app.name]
      return next
    })
    if (selectedApp?.name === app.name) setSelectedApp(null)
    await deleteApp(app.name)
  }

  // The closeDetails helper: resets the detail view
  const closeDetails = () => {
    setSelectedApp(null)
  }

  // ── Detail View (full content area) ──────────────────────
  if (selectedApp) {
    return (
      <>
        <Header>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main fixed>
          <AppDetailsPanel
            app={selectedApp}
            statusColors={statusColors}
            devUsers={devUsers}
            appAssignees={appAssignees}
            onToggleAssign={toggleAssignUser}
            onClose={closeDetails}
            canManageApps={canManageApps}
            onEdit={openEdit}
            onRemove={handleRemove}
          />
        </Main>
      </>
    )
  }

  // ── List View (no app selected) ──────────────────────────
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
            <h1 className='text-2xl font-bold tracking-tight'>Eburon Apps</h1>
            <p className='text-muted-foreground'>
              Your Eburon ecosystem apps and third-party service integrations.
            </p>
          </div>
        </div>

        <div className='mt-6'>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as Tab)}
            className='space-y-4'
          >
            <div className='sticky top-0 z-10 -mx-6 flex items-center justify-between bg-background px-6 py-2'>
              <TabsList>
                <TabsTrigger value='apps' className='gap-2'>
                  <LayoutDashboard className='size-4' />
                  Eburon Apps
                </TabsTrigger>
                <TabsTrigger value='services' className='gap-2'>
                  <Puzzle className='size-4' />
                  Services
                </TabsTrigger>
              </TabsList>
              <div className='flex items-center gap-2'>
                <Input
                  placeholder={`Search ${tab === 'apps' ? 'apps' : 'services'}...`}
                  className='h-9 w-60'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {canManageApps && (
                  <>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size='sm' className='h-9 gap-1.5'>
                          <Plus className='size-4' />
                          Add App
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-md'>
                        <DialogHeader>
                          <DialogTitle>Add New App</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='name'>App Name</Label>
                            <Input
                              id='name'
                              placeholder='e.g. Eburon Analytics'
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              required
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='desc'>Description</Label>
                            <Input
                              id='desc'
                              placeholder='What does this app do?'
                              value={newDesc}
                              onChange={(e) => setNewDesc(e.target.value)}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='url'>Website URL</Label>
                            <Input
                              id='url'
                              placeholder='https://eburon.ai/my-app'
                              value={newUrl}
                              onChange={(e) => setNewUrl(e.target.value)}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label>Icon</Label>
                 <div className='flex flex-wrap gap-2'>
                              {iconOptions.map((opt) => (
                                <button
                                  key={opt.name}
                                  type='button'
                                  onClick={() => setNewIcon(opt.name)}
                                  className={`flex size-10 items-center justify-center rounded-lg border ${
                                    newIcon === opt.name
                                      ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                      : 'border-border hover:bg-accent'
                                  }`}
                                >
                                  {opt.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label>Color</Label>
                            <div className='flex flex-wrap gap-2'>
                              {colorOptions.map((opt) => (
                                <button
                                  key={opt.label}
                                  type='button'
                                  onClick={() => setNewColor(opt.value)}
                                  className={`flex size-8 items-center justify-center rounded-lg border ${
                                    newColor === opt.value
                                      ? 'ring-2 ring-primary ring-offset-2'
                                      : 'border-border'
                                  } ${opt.value.split(' ')[0]} ${opt.value.split(' ')[1]}`}
                                >
                                  <span className='text-[10px] font-bold'>
                                    {opt.label[0]}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className='flex justify-end gap-2 pt-2'>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => setDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type='submit'>Add App</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                      <DialogContent className='sm:max-w-md'>
                        <DialogHeader>
                          <DialogTitle>Edit App</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className='space-y-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-name'>App Name</Label>
                            <Input
                              id='edit-name'
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              disabled
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-desc'>Description</Label>
                            <Input
                              id='edit-desc'
                              placeholder='What does this app do?'
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-url'>Website URL</Label>
                            <Input
                              id='edit-url'
                              placeholder='https://eburon.ai/my-app'
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label>Icon</Label>
                            <div className='flex flex-wrap gap-2'>
                              {iconOptions.map((opt) => (
                                <button
                                  key={opt.name}
                                  type='button'
                                  onClick={() => setEditIcon(opt.name)}
                                  className={`flex size-10 items-center justify-center rounded-lg border ${
                                    editIcon === opt.name
                                      ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                      : 'border-border hover:bg-accent'
                                  }`}
                                >
                                  {opt.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label>Color</Label>
                            <div className='flex flex-wrap gap-2'>
                              {colorOptions.map((opt) => (
                                <button
                                  key={opt.label}
                                  type='button'
                                  onClick={() => setEditColor(opt.value)}
                                  className={`flex size-8 items-center justify-center rounded-lg border ${
                                    editColor === opt.value
                                      ? 'ring-2 ring-primary ring-offset-2'
                                      : 'border-border'
                                  } ${opt.value.split(' ')[0]} ${opt.value.split(' ')[1]}`}
                                >
                                  <span className='text-[10px] font-bold'>
                                    {opt.label[0]}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className='flex justify-end gap-2 pt-2'>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => setEditOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type='submit'>Save Changes</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>

            <TabsContent value='apps' className='mt-0'>
              <Separator className='shadow-sm' />
              <div className='pt-4'>
                <div className='max-h-[calc(100vh-360px)] overflow-y-auto'>
                  <ul className='grid gap-4 pb-16 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
                    {filteredApps.map((app) => (
                      <li
                        key={app.name}
                        className='flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:shadow-md'
                        onClick={() => {
                          setSelectedApp(app)
                        }}
                      >
                        <div className='mb-3 flex items-center justify-between'>
                          <div
                            className={`flex size-10 items-center justify-center rounded-lg ${app.color} p-2`}
                          >
                            {app.logo}
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8'
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={app.url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <ExternalLink className='size-4' />
                            </a>
                          </Button>
                        </div>
                        <div className='mb-3 flex-1'>
                          <h2 className='mb-1 font-semibold'>{app.name}</h2>
                          {app.status && (
                            <Badge
                              variant='outline'
                              className={`mb-2 text-[10px] ${
                                statusColors[app.status] || ''
                              }`}
                            >
                              {app.status}
                            </Badge>
                          )}
                          <p className='line-clamp-2 text-sm text-muted-foreground'>
                            {app.desc}
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Select
                            value={selectedPlatform}
                            onValueChange={setSelectedPlatform}
                          >
                            <SelectTrigger
                              className='h-8 min-w-0 flex-2 text-xs'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='w-auto min-w-(--radix-select-trigger-width)'>
                              {app.downloads.map((dl) => (
                                <SelectItem
                                  key={dl.label}
                                  value={dl.label}
                                  className='text-xs'
                                >
                                  {dl.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {(() => {
                            const dl = app.downloads.find(
                              (d) => d.label === selectedPlatform
                            )
                            if (!dl?.url) {
                              return (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span tabIndex={0}>
                                        <Button
                                          size='sm'
                                          className='h-8 gap-1.5 text-xs'
                                          disabled
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Download className='size-3.5' />
                                          Download
                                        </Button>
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Not available
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            }
                            return (
                              <Button
                                size='sm'
                                className='h-8 gap-1.5 text-xs'
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a href={dl.url} download>
                                  <Download className='size-3.5' />
                                  Download
                                </a>
                              </Button>
                            )
                          })()}
                          <Button
                            variant='default'
                            size='sm'
                            className='h-8 shrink-0 gap-1.5 text-xs'
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApp(app)
                            }}
                          >
                            <Eye className='size-3.5' />
                            Details
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='services'
              className='mt-0 max-h-[calc(100vh-320px)] overflow-y-auto'
            >
              <Separator className='shadow-sm' />
              {loadingServices ? (
                <p className='py-12 text-center text-sm text-muted-foreground'>
                  Loading integrations…
                </p>
              ) : (
                <ul className='grid gap-4 pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredServices.map((svc) => (
                    <li
                      key={svc.slug}
                      className='rounded-lg border p-4 hover:shadow-md'
                    >
                      <div className='mb-8 flex items-center justify-between'>
                        <div className='flex size-10 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground uppercase'>
                          {svc.name.slice(0, 2)}
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            svc.availability === 'installed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : svc.availability === 'beta'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                                : svc.availability === 'alpha'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {svc.availability === 'official'
                            ? 'Official'
                            : svc.availability}
                        </span>
                      </div>
                      <div className='mb-3'>
                        <div className='mb-1 flex items-center gap-2'>
                          <h2 className='font-semibold'>{svc.name}</h2>
                          {svc.official && (
                            <span className='text-[10px] text-muted-foreground'>
                              · Official
                            </span>
                          )}
                        </div>
                        <p className='line-clamp-3 text-sm text-muted-foreground'>
                          {svc.description}
                        </p>
                      </div>
                      <Button
                        variant={svc.connected ? 'secondary' : 'outline'}
                        size='sm'
                        className='w-full'
                        onClick={() => handleConnect(svc.slug)}
                      >
                        {svc.connected ? 'Connected' : 'Connect'}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}

// ─── App Details Panel ─────────────────────────────────────

type AppDetailsPanelProps = {
  app: EburonApp
  statusColors: Record<string, string>
  devUsers: User[]
  appAssignees: Record<string, User[]>
  onToggleAssign: (appName: string, user: User) => void
  onClose: () => void
  canManageApps: boolean
  onEdit: (app: EburonApp) => void
  onRemove: (app: EburonApp) => void
}

function AppDetailsPanel({
  app,
  appAssignees,
  onClose,
  canManageApps,
  onEdit,
  onRemove,
}: AppDetailsPanelProps) {
  const [comment, setComment] = useState('')
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const handleSave = () => {
    if (!comment.trim()) return
    setSaved(true)
    clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className='relative flex h-full flex-col'>
      {/* ===== Floating Header (overlays content) ===== */}
      <div className='pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-8 py-4'>
        <div />
        <div className='pointer-events-auto flex items-center gap-2'>
          <div className='flex size-9 items-center justify-center'>
            {app.logo}
          </div>
          {canManageApps && (
            <>
              <button
                className='flex size-9 items-center justify-center text-muted-foreground hover:text-foreground'
                onClick={() => onEdit(app)}
                aria-label='Edit app'
              >
                <Pencil className='size-4' />
              </button>
              <button
                className='flex size-9 items-center justify-center text-muted-foreground hover:text-destructive'
                onClick={() => onRemove(app)}
                aria-label='Remove app'
              >
                <Trash2 className='size-4' />
              </button>
            </>
          )}
          <button
            className='flex size-9 items-center justify-center text-muted-foreground hover:text-foreground'
            onClick={onClose}
          >
            <X className='size-5' />
          </button>
        </div>
      </div>

      {/* ===== Scrollable Content ===== */}
      <div className='flex-1 overflow-y-auto py-6 pr-8 pl-2 lg:overflow-hidden'>
        <div className='flex flex-col gap-10 lg:h-full lg:flex-row lg:items-start lg:gap-12'>
          {/* ── 📱 LEFT: Realistic Phone Mockup (sticky on desktop) ── */}
          <div className='flex shrink-0 flex-col items-center gap-4 lg:sticky lg:top-0'>
            <div className='relative h-162.5 w-75 overflow-hidden rounded-[48px] border-12 border-zinc-800 bg-black shadow-2xl'>
              {/* Notch */}
              <div className='absolute top-2.5 left-1/2 z-20 h-7.5 w-30 -translate-x-1/2 rounded-[22px] bg-black shadow-[inset_0_-1px_2px_rgba(255,255,255,0.08)]' />
              {/* Screen */}
              <div className='relative flex h-full w-full flex-col bg-[#0b0f19]'>
                {/* Embedded URL */}
                <iframe
                  src={app.url}
                  title={`${app.name} preview`}
                  className='h-full w-full border-0'
                  sandbox='allow-scripts'
                  referrerPolicy='no-referrer'
                  loading='lazy'
                />
                {/* Status bar overlay */}
                <div className='pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-5 pt-3.5'>
                  <span className='text-[12px] font-semibold text-white drop-shadow-sm'>
                    9:41
                  </span>
                  <span className='text-[12px] text-white/90 drop-shadow-sm'>
                    {'📶'} {'🔋'}
                  </span>
                </div>
              </div>
            </div>
            <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
              <Smartphone className='size-3.5' />
              {app.url}
            </span>
          </div>

          {/* ── 📋 RIGHT: Stacked Cards (scrollable on desktop) ── */}
          <div className='flex min-w-0 flex-1 flex-col gap-8 lg:max-h-full lg:overflow-y-auto'>

               <div className='space-y-4'>
                 {/* App Name Header */}
                 <div>
                   <h1 className='text-2xl font-bold tracking-tight'>
                     {app.name}
                   </h1>
                   <p className='text-sm text-muted-foreground mt-1'>
                     {app.url}
                   </p>
                 </div>

                 <Tabs defaultValue='information' className='w-full'>
                   <TabsList className='grid w-full grid-cols-3'>
                     <TabsTrigger value='information'>
                       Information
                     </TabsTrigger>
                     <TabsTrigger value='users'>Users</TabsTrigger>
                     <TabsTrigger value='code'>
                       <Code2 className='mr-1.5 size-3.5' />
                       Source Code
                     </TabsTrigger>
                   </TabsList>

                   {/* ===== Information Tab ===== */}
                   <TabsContent value='information' className='mt-4 space-y-3'>
                     {/* Description */}
                     <div className='rounded-xl border bg-card p-5'>
                       <div className='mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                        Description
                       </div>
                       <p className='text-[15px] leading-relaxed text-foreground/90'>
                        {app.desc}
                       </p>
                     </div>

                     {/* Preview Button */}
                     <div className='space-y-3'>
                       <div className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                        Preview
                       </div>
                       <Button
                        variant='default'
                        className='h-9 gap-2 text-xs'
                        asChild
                       >
                         <a
                          href={app.url}
                          target='_blank'
                          rel='noopener noreferrer'
                         >
                           <ExternalLink className='size-3.5' />
                          Open in New Window
                         </a>
                       </Button>
                     </div>

                     {/* Comment Input */}
                     <div className='space-y-3'>
                       <div className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                        Comment
                       </div>
                       <div className='rounded-xl border bg-card p-4'>
                         <Textarea
                          placeholder='Add your notes, feedback, or observations...'
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value)
                            if (saved) setSaved(false)
                          }}
                          className='min-h-25 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0'
                         />
                         <div className='mt-3 flex items-center justify-between border-t pt-3'>
                          <span className='text-xs text-muted-foreground'>
                           {saved ? 'Comment saved!' : ''}
                          </span>
                          <Button
                           size='sm'
                           className='h-8 gap-1.5 text-xs'
                           onClick={handleSave}
                           disabled={!comment.trim()}
                          >
                           {saved ? 'Saved' : 'Save Comment'}
                          </Button>
                         </div>
                       </div>
                     </div>
                   </TabsContent>

                   {/* ===== Users Tab ===== */}
                   <TabsContent value='users' className='mt-4 space-y-3'>
                     {appAssignees[app.name] && appAssignees[app.name].length > 0 ? (
                       <div className='space-y-2'>
                         {appAssignees[app.name].map((user) => (
                           <div
                            key={user.id}
                            className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3'
                           >
                             <div className='flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>
                               {user.first_name[0]}
                               {user.last_name[0]}
                             </div>
                             <div className='flex-1'>
                               <p className='text-sm font-medium'>
                                 {user.first_name} {user.last_name}
                               </p>
                               <p className='text-xs text-muted-foreground'>
                                 {user.role}
                               </p>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className='rounded-xl border bg-card px-4 py-6 text-center'>
                         <p className='text-sm text-muted-foreground'>
                          No users assigned
                         </p>
                       </div>
                     )}
                   </TabsContent>

                   {/* ===== Source Code Tab ===== */}
                   <TabsContent value='code' className='mt-4 space-y-3'>
                     {isDevOrAdmin ? (
                       <>
                         {/* Zip Upload */}
                         <div className='space-y-3'>
                           <div className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                            Upload Zip File
                           </div>
                           <div className='rounded-xl border-2 border-dashed border-border bg-card p-6 text-center'>
                             <div className='flex flex-col items-center gap-3'>
                               <Database className='size-8 text-muted-foreground/50' />
                               <div>
                                 <p className='text-sm font-medium'>
                                  Drag & drop your zip file here
                                 </p>
                                 <p className='text-xs text-muted-foreground mt-1'>
                                  or click to browse
                                 </p>
                               </div>
                               <input
                                type='file'
                                accept='.zip'
                                className='hidden'
                                id='zip-upload'
                               />
                               <Button
                                variant='outline'
                                size='sm'
                                className='h-8 gap-1.5 text-xs'
                                onClick={() =>
                                  document.getElementById('zip-upload')?.click()
                                }
                               >
                                <Download className='size-3.5' />
                               Browse Files
                               </Button>
                             </div>
                           </div>
                         </div>

                         {/* Github Repo */}
                         <div className='space-y-3'>
                           <div className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                            Github Repository
                           </div>
                           <div className='space-y-2'>
                             <Input
                              placeholder='https://github.com/org/repo'
                              className='h-9 text-sm'
                             />
                             <div className='flex justify-end'>
                               <Button size='sm' className='h-8 gap-1.5 text-xs'>
                                <ExternalLink className='size-3.5' />
                               Connect Repo
                               </Button>
                             </div>
                           </div>
                         </div>
                       </>
                     ) : (
                       <div className='rounded-xl border bg-card px-4 py-10 text-center'>
                        <Shield className='mx-auto size-8 text-muted-foreground/50 mb-2' />
                        <p className='text-sm font-medium'>
                         Access Restricted
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                         Only developers and admins can view source code.
                        </p>
                       </div>
                     )}
                   </TabsContent>
                 </Tabs>
               </div>
          </div>
        </div>
      </div>
    </div>
  )
}
