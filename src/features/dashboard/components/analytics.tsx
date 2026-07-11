import { Boxes, Mail, Mailbox, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type DashboardData } from '../data/use-dashboard-data'
import { AnalyticsChart } from './analytics-chart'

export function Analytics({ data }: { data: DashboardData }) {
  const stats = [
    {
      title: 'Total Users',
      value: data.users.total.toLocaleString(),
      hint: 'from Clerk',
      icon: <Users className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: 'Total Apps',
      value: data.apps.total.toLocaleString(),
      hint: 'from Supabase',
      icon: <Boxes className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: 'Mailboxes',
      value: data.mail.total.toLocaleString(),
      hint: 'Hostinger Mail',
      icon: <Mailbox className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: 'Unread Emails',
      value: data.mail.unread.toLocaleString(),
      hint: 'across mailboxes',
      icon: <Mail className='h-4 w-4 text-muted-foreground' />,
    },
  ]

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{s.title}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{s.value}</div>
              <p className='text-xs text-muted-foreground'>{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unread emails per mailbox</CardTitle>
          <CardDescription>Live from Hostinger Mail</CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <AnalyticsChart
            data={data.mail.unreadByMailbox}
            loading={data.loading}
          />
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Apps by status</CardTitle>
            <CardDescription>Distribution of Eburon Apps</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={data.apps.byStatus}
              barClass='bg-primary'
              valueFormatter={(n) => `${n}`}
            />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Busiest mailboxes</CardTitle>
            <CardDescription>Mailboxes with the most unread</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={data.mail.unreadByMailbox.slice(0, 6)}
              barClass='bg-muted-foreground'
              valueFormatter={(n) => `${n}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  if (items.length === 0) {
    return (
      <div className='py-8 text-center text-sm text-muted-foreground'>
        No data available yet.
      </div>
    )
  }
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className='flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 truncate text-xs text-muted-foreground'>
                {i.name}
              </div>
              <div className='h-2.5 w-full rounded-full bg-muted'>
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>
              {valueFormatter(i.value)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
