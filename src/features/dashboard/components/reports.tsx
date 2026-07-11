import {
  FileText,
  Download,
  Users,
  MousePointerClick,
  Activity,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const reports = [
  {
    title: 'Monthly Engagement Summary',
    description: 'Clicks, active users, and downloads across all apps',
    period: 'July 2026',
    icon: Activity,
    metric: '48,231 clicks',
  },
  {
    title: 'User Distribution Report',
    description: 'Geographic breakdown of app users by region',
    period: 'Q2 2026',
    icon: Users,
    metric: '1,205 users',
  },
  {
    title: 'App Performance Audit',
    description: 'Uptime, latency, and error rates per Eburon app',
    period: 'Last 30 days',
    icon: FileText,
    metric: '99.98% uptime',
  },
  {
    title: 'Traffic Acquisition',
    description: 'Top referrers and channel attribution',
    period: 'July 2026',
    icon: MousePointerClick,
    metric: '832 uniques',
  },
]

const scheduled = [
  { label: 'Weekly Engagement Digest', cadence: 'Every Monday, 09:00' },
  { label: 'Monthly User Report', cadence: '1st of month, 08:00' },
  { label: 'Quarterly Audit', cadence: 'Jan 1 / Apr 1 / Jul 1 / Oct 1' },
]

export function Reports() {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            Scheduled Reports
          </CardTitle>
          <CardDescription>
            Automated reports delivered to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='divide-y'>
            {scheduled.map((s) => (
              <li
                key={s.label}
                className='flex items-center justify-between py-3 first:pt-0 last:pb-0'
              >
                <div>
                  <p className='text-sm font-medium'>{s.label}</p>
                  <p className='text-xs text-muted-foreground'>{s.cadence}</p>
                </div>
                <Button variant='outline' size='sm'>
                  Manage
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-4 w-4' />
            Generated Reports
          </CardTitle>
          <CardDescription>
            Download on-demand analytics exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 sm:grid-cols-2'>
            {reports.map((r) => (
              <div
                key={r.title}
                className='flex flex-col rounded-lg border p-4'
              >
                <div className='mb-3 flex items-center gap-2'>
                  <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <r.icon className='size-4' />
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold'>{r.title}</p>
                    <p className='text-xs text-muted-foreground'>{r.period}</p>
                  </div>
                </div>
                <p className='mb-1 line-clamp-2 text-xs text-muted-foreground'>
                  {r.description}
                </p>
                <p className='mb-3 text-xs font-medium text-primary'>
                  {r.metric}
                </p>
                <Button
                  size='sm'
                  variant='secondary'
                  className='mt-auto gap-1.5'
                >
                  <Download className='size-3.5' />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
