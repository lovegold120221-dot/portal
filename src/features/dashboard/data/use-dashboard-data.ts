import { useEffect, useState } from 'react'
import { clerkUserToUser } from '@/lib/clerk-mapper'
import { clerkUsers } from '@/lib/clerk-users-api'
import { hostingerMail } from '@/lib/hostinger-mail-api'
import { getApps } from '@/lib/supabase-apps'
import { type User } from '@/features/users/data/schema'

export type NotificationIcon = 'user' | 'mail' | 'app' | 'alert'

export type DashboardNotification = {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  icon: NotificationIcon
  tone: string
}

export type DashboardData = {
  loading: boolean
  users: { total: number; recent: User[] }
  apps: {
    total: number
    downloadsByApp: { name: string; count: number }[]
    byStatus: { name: string; value: number }[]
  }
  mail: {
    total: number
    unread: number
    unreadByMailbox: { name: string; value: number }[]
  }
  notifications: DashboardNotification[]
}

const INITIAL: DashboardData = {
  loading: true,
  users: { total: 0, recent: [] },
  apps: { total: 0, downloadsByApp: [], byStatus: [] },
  mail: { total: 0, unread: 0, unreadByMailbox: [] },
  notifications: [],
}

export const TONES: Record<NotificationIcon, string> = {
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  mail: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  app: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  alert: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
}

export function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>(INITIAL)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [usersRes, apps, mailboxes] = await Promise.all([
          clerkUsers.listUsers(500),
          getApps(),
          hostingerMail.getAccount(),
        ])

        const users = usersRes.data.map(clerkUserToUser)
        const recent = [...users]
          .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
          .slice(0, 8)

        const downloadsByApp = apps
          .map((a) => ({ name: a.name, count: a.downloads?.length ?? 0 }))
          .sort((a, b) => b.count - a.count)

        const byStatus = apps.reduce<Record<string, number>>((acc, a) => {
          const key = a.status ?? 'Unknown'
          acc[key] = (acc[key] ?? 0) + 1
          return acc
        }, {})
        const byStatusArr = Object.entries(byStatus).map(([name, value]) => ({
          name,
          value,
        }))

        const mailTotal = mailboxes.length
        const folderResults = await Promise.all(
          mailboxes.slice(0, 25).map((m) =>
            hostingerMail
              .getFolders(m.resourceId)
              .then((f) => ({
                name: m.address,
                value: f.data.reduce((s, fld) => s + (fld.unreadCount ?? 0), 0),
              }))
              .catch(() => ({ name: m.address, value: 0 }))
          )
        )
        const unread = folderResults.reduce((s, r) => s + r.value, 0)
        const unreadByMailbox = folderResults
          .filter((r) => r.value > 0)
          .sort((a, b) => b.value - a.value)

        const notifications: DashboardNotification[] = []
        recent.forEach((u) => {
          const name = `${u.first_name} ${u.last_name}`.trim() || u.email
          notifications.push({
            id: `u-${u.id}`,
            title: 'New user registered',
            body: `${name} signed up as ${u.role}`,
            time: relativeTime(u.created_at),
            read: false,
            icon: 'user',
            tone: TONES.user,
          })
        })
        unreadByMailbox.slice(0, 6).forEach((m) => {
          notifications.push({
            id: `m-${m.name}`,
            title: 'Unread emails',
            body: `${m.value} unread in ${m.name}`,
            time: 'now',
            read: false,
            icon: 'mail',
            tone: TONES.mail,
          })
        })
        apps.slice(0, 6).forEach((a) => {
          notifications.push({
            id: `a-${a.name}`,
            title: 'App available',
            body: `${a.name} — ${a.desc}`,
            time: '—',
            read: true,
            icon: 'app',
            tone: TONES.app,
          })
        })

        if (active) {
          setData({
            loading: false,
            users: { total: users.length, recent },
            apps: { total: apps.length, downloadsByApp, byStatus: byStatusArr },
            mail: { total: mailTotal, unread, unreadByMailbox },
            notifications,
          })
        }
      } catch {
        if (active) setData({ ...INITIAL, loading: false })
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return data
}
