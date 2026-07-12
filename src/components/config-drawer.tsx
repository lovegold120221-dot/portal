import { useState, useEffect } from 'react'
import { fonts } from '@/config/fonts'
import {
  Moon,
  Sun,
  Monitor,
  Type,
  RotateCcw,
  Check,
  PanelLeft,
  PanelLeftClose,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFont } from '@/context/font-provider'
import { useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const themes = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
] as const

const sidebarModes = [
  { id: 'inset', icon: PanelLeftClose, label: 'Inset' },
  { id: 'sidebar', icon: PanelLeft, label: 'Sidebar' },
  { id: 'floating', icon: Monitor, label: 'Floating' },
] as const

export function ConfigDrawer() {
  const { theme, setTheme } = useTheme()
  const { font, setFont } = useFont()
  const { variant, setVariant, resetLayout } = useLayout()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('eburon-theme') as
      | 'light'
      | 'dark'
      | null
    if (savedTheme && savedTheme !== theme) setTheme(savedTheme)
    const savedFont = localStorage.getItem('eburon-font') as
      | (typeof fonts)[number]
      | null
    if (savedFont && savedFont !== font) setFont(savedFont)
  }, [theme, font, setTheme, setFont])

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
      <SheetContent
        side='right'
        className='w-[340px] overflow-y-auto sm:w-[380px]'
      >
        <SheetHeader className='pb-4'>
          <SheetTitle className='flex items-center gap-2'>
            <SlidersHorizontal className='size-4' />
            Quick Settings
          </SheetTitle>
          <SheetDescription className='text-xs'>
            Customize your dashboard appearance.
          </SheetDescription>
        </SheetHeader>
        <div className='space-y-6 py-4'>
          {/* Theme */}
          <div>
            <h3 className='mb-3 flex items-center gap-2 text-sm font-medium'>
              <Sun className='size-4' />
              Theme
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              {themes.map((t) => {
                const Icon = t.icon as React.ComponentType<{
                  className?: string
                }>
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
                    {theme === t.id && <Check className='ms-auto size-4' />}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Font */}
          <div>
            <h3 className='mb-3 flex items-center gap-2 text-sm font-medium'>
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
                      'w-full rounded-lg border px-3 py-2 text-start text-sm transition-colors',
                      isActive
                        ? 'border-primary/50 bg-primary/10 font-medium'
                        : 'border-transparent hover:bg-accent'
                    )}
                    style={{ fontFamily: f }}
                  >
                    <div className='flex items-center justify-between'>
                      <span style={{ fontFamily: f }}>{f}</span>
                      {isActive && <Check className='size-4 text-primary' />}
                    </div>
                    <p
                      className='text-[10px] text-muted-foreground'
                      style={{ fontFamily: f }}
                    >
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
            <h3 className='mb-3 flex items-center gap-2 text-sm font-medium'>
              <PanelLeft className='size-4' />
              Sidebar Mode
            </h3>
            <div className='grid grid-cols-3 gap-2'>
              {sidebarModes.map((m) => {
                const Icon = m.icon as React.ComponentType<{
                  className?: string
                }>
                return (
                  <Button
                    key={m.id}
                    variant={variant === m.id ? 'default' : 'outline'}
                    size='sm'
                    onClick={() =>
                      setVariant(m.id as 'inset' | 'sidebar' | 'floating')
                    }
                    className={cn(
                      'justify-center gap-1',
                      variant === m.id && 'bg-primary text-primary-foreground'
                    )}
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
            <h3 className='mb-3 flex items-center gap-2 text-sm font-medium'>
              <RotateCcw className='size-4' />
              Reset All
            </h3>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => {
                setTheme('light')
                setFont(fonts[0])
                resetLayout()
                localStorage.removeItem('eburon-theme')
                localStorage.removeItem('eburon-font')
              }}
              className='w-full justify-center gap-2'
            >
              <RotateCcw className='size-4' />
              Reset to Defaults
            </Button>
          </div>

          {/* Info Badge */}
          <div className='rounded-lg bg-accent/50 p-3'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-[10px]'>
                Info
              </Badge>
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
