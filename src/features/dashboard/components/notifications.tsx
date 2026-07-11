import {
  Bell,
  Check,
  CheckCheck,
  CircleAlert,
  Mail,
  Rocket,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type DashboardNotification,
  type NotificationIcon,
} from '../data/use-dashboard-data'

const ICONS: Record<NotificationIcon, React.ReactNode> = {
  user: <UserPlus className='size-4' />,
  mail: <Mail className='size-4' />,
  app: <Rocket className='size-4' />,
  alert: <CircleAlert className='size-4' />,
}

export function Notifications({
  notifications,
  loading,
}: {
  notifications: DashboardNotification[]
  loading?: boolean
}) {
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
              {loading
                ? 'Loading activity…'
                : unread > 0
                  ? `${unread} unread`
                  : 'All caught up'}
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' className='gap-1.5'>
            <CheckCheck className='size-3.5' />
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!loading && notifications.length === 0 ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>
            No notifications yet.
          </div>
        ) : (
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
                  {ICONS[n.icon]}
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
        )}
      </CardContent>
    </Card>
  )
}
