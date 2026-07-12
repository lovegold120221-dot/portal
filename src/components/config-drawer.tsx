import { useState, useEffect } from 'react'
import {
  Moon,
  Sun,
  Monitor,
  Type,
  Languages,
  RotateCcw,
  Check,
  PanelLeft,
  PanelLeftClose,
  SlidersHorizontal,
  X,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { useLayout } from '@/context/layout-provider'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { fonts } from '@/config/fonts'

const themes = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
] as const

const sidebarModes = [
  { id: 'default', icon: PanelLeft, label: 'Default' },
  { id: 'inset', icon: PanelLeftClose, label: 'Inset' },
  { id: 'sidebar', icon: Monitor, label: 'Sidebar' },
] as const

export function ConfigDrawer() {
  const { theme, setTheme } = useTheme()
  const { font, setFont } = useFont()
  const { layout, sidebar, setLayout, setSidebar } = useLayout()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('eburon-theme') as 'light' | 'dark' | null
    if (savedTheme && savedTheme !== theme) setTheme(savedTheme)
    const savedFont = localStorage.getItem('eburon-font') as (typeof fonts)[number] | null
    if (savedFont && savedFont !== font) setFont(savedFont)
    const savedLayout = localStorage.getItem('eburon-layout')
    if (savedLayout) setLayout(savedLayout as 'default' | 'inset' | 'sidebar')
    const savedSidebar = localStorage.getItem('eburon-sidebar')
    if (savedSidebar) setSidebar(savedSidebar as 'default' | 'inset' | 'floating' | 'sidebar')
    }
    , [])

  useEffect(() => {
    localStorage.setItem('eburon-theme', theme)
    }, [theme])

  useEffect(() => {
    localStorage.setItem('eburon-font', font)
    }, [font])

  return (
     <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon' className='size-8'>
            <SlidersHorizontal className='size-4' />
            <span className='sr-only'>Open settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[340px] sm:w-[380px] overflow-y-auto'>
          <SheetHeader className='pb-4'>
            <SheetTitle className='flex items-center gap-2'>
              <SlidersHorizontal className='size-4' />
              Quick Settings
            </SheetTitle>
            <SheetDescription className='text-xs'>
              Customize your dashboard appearance.
            </SheetDescription>
          </SheetHeader>
          <div className='py-4 space-y-6'>
            {/* Theme */}
            <div>
              <h3 className='text-sm font-medium mb-3 flex items-center gap-2'>
                <Sun className='size-4' />
                Theme
              </h3>
              <div className='grid grid-cols-2 gap-2'>
                {themes.map((t) => {
                  const Icon = t.icon as React.ComponentType<{ className?: string }>
                  return (
                    <Button
                      key={t.id}
                      variant={theme === t.id ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'justify-start gap-2',
                        theme === t.id && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Icon className='size-4' />
                      {t.label}
                      {theme === t.id && <Check className='size-4 ms-auto' />}
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Font */}
            <div>
              <h3 className='text-sm font-medium mb-3 flex items-center gap-2'>
                <Type className='size-4' />
                Font Family
              </h3>
              <div className='space-y-2'>
                {fonts.map((f) => {
                  const isActive = font === f
                  return (
                    <button
                      key={f}
                      onClick={() => setFont(f)}
                      className={cn(
                        'w-full text-start px-3 py-2 rounded-lg text-sm transition-colors border',
                        isActive
                          ? 'bg-primary/10 border-primary/50 font-medium'
                          : 'hover:bg-accent border-transparent'
                      )}
                      style={{ fontFamily: f }}
                    >
                      <div className='flex items-center justify-between'>
                        <span style={{ fontFamily: f }}>{f}</span>
                        {isActive && <Check className='size-4 text-primary' />}
                      </div>
                      <p className='text-[10px] text-muted-foreground' style={{ fontFamily: f }}>
                        Aa Bb Cc 123
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Sidebar Mode */}
            <div>
              <h3 className='text-sm font-medium mb-3 flex items-center gap-2'>
                <PanelLeft className='size-4' />
                Sidebar Mode
              </h3>
              <div className='grid grid-cols-3 gap-2'>
                {sidebarModes.map((m) => {
                  const Icon = m.icon as React.ComponentType<{ className?: string }>
                  return (
                    <Button
                      key={m.id}
                      variant={sidebar === m.id ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setSidebar(m.id as 'default' | 'inset' | 'floating' | 'sidebar')}
                      className={cn('justify-center gap-1', sidebar === m.id && 'bg-primary text-primary-foreground')}
                    >
                      <Icon className='size-4' />
                      {m.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Reset */}
            <div>
              <h3 className='text-sm font-medium mb-3 flex items-center gap-2'>
                <RotateCcw className='size-4' />
                Reset All
              </h3>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => {
                  setTheme('light')
                  setFont(fonts[0])
                  setLayout('default')
                  setSidebar('default')
                  localStorage.removeItem('eburon-theme')
                  localStorage.removeItem('eburon-font')
                  localStorage.removeItem('eburon-layout')
                  localStorage.removeItem('eburon-sidebar')
                  window.location.reload()
                }}
                className='w-full justify-center gap-2'
              >
                <RotateCcw className='size-4' />
                Reset to Defaults
              </Button>
            </div>

            {/* Info Badge */}
            <div className='bg-accent/50 rounded-lg p-3'>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary' className='text-[10px]'>Info</Badge>
                <p className='text-xs text-muted-foreground'>
                  Settings are saved locally and persist across sessions.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
}
