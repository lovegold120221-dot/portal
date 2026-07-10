import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Check, CheckCheck, CircleAlert, UserPlus, Download, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

type Notification = {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  icon: React.ReactNode
  tone: string
}

const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'New app deployed',
    body: 'Eburon Orbit is now live at orbit.eburon.ai',
    time: '2m ago',
    read: false,
    icon: <Rocket className='size-4' />,
    tone: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  },
  {
    id: 'n2',
    title: 'Download spike',
    body: 'Eburon Chat exceeded 1,000 downloads in the last hour',
    time: '18m ago',
    read: false,
    icon: <Download className='size-4' />,
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  },
  {
    id: 'n3',
    title: 'New user registered',
    body: 'Aisha Mohamed signed up as a Developer',
    time: '1h ago',
    read: false,
    icon: <UserPlus className='size-4' />,
    tone: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 'n4',
    title: 'Service degraded',
    body: 'Eburon API latency above 400ms in eu-west',
    time: '3h ago',
    read: true,
    icon: <CircleAlert className='size-4' />,
    tone: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  },
  {
    id: 'n5',
    title: 'Weekly digest ready',
    body: 'Your engagement summary for last week is available',
    time: '1d ago',
    read: true,
    icon: <Bell className='size-4' />,
    tone: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
]

export function Notifications() {
  const unread = notifications.filter((n) => !n.read).length
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-4 w-4' />
              Notifications
            </CardTitle>
            <CardDescription>
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' className='gap-1.5'>
            <CheckCheck className='size-3.5' />
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3',
                !n.read && 'bg-muted/40'
              )}
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full',
                  n.tone
                )}
              >
                {n.icon}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='text-sm font-medium'>{n.title}</p>
                  <span className='shrink-0 text-xs text-muted-foreground'>
                    {n.time}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>{n.body}</p>
              </div>
              {!n.read ? (
                <span className='mt-1.5 size-2 shrink-0 rounded-full bg-primary' />
              ) : (
                <Check className='mt-1 size-4 shrink-0 text-muted-foreground' />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
