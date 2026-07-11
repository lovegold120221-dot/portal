import {
  eburonApps as seedApps,
  type EburonApp,
} from '@/features/apps/data/apps'
import { supabase } from './supabase'

type DbApp = {
  name: string
  icon: string
  desc: string
  color: string
  url: string
  downloads: unknown
  developers: unknown
  status: string | null
}

export async function getApps(): Promise<EburonApp[]> {
  try {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      return seedApps
    }

    // Merge DB data with seed data to preserve React components like logo
    const seedMap = new Map<string, EburonApp>(
      seedApps.map((app) => [app.name, app])
    )

    return (data as DbApp[]).map((dbApp) => {
      const seed = seedMap.get(dbApp.name)
      return {
        name: dbApp.name,
        icon: dbApp.icon,
        desc: dbApp.desc,
        color: dbApp.color,
        url: dbApp.url,
        downloads: dbApp.downloads as EburonApp['downloads'],
        status: dbApp.status ?? undefined,
        developers: dbApp.developers as string[] | undefined,
        // Use seed logo (ReactNode) or fallback
        logo: seed?.logo,
      } as EburonApp
    })
  } catch {
    return seedApps
  }
}

export async function addApp(app: EburonApp): Promise<EburonApp | null> {
  try {
    const { data, error } = await supabase
      .from('apps')
      .insert([
        {
          name: app.name,
          icon: app.icon,
          desc: app.desc,
          color: app.color,
          url: app.url,
          downloads: JSON.stringify(app.downloads),
          developers: JSON.stringify(app.developers || []),
          status: app.status || null,
        },
      ])
      .select()
      .single()

    if (error) return app
    return data as unknown as EburonApp
  } catch {
    return app
  }
}

export async function updateApp(app: EburonApp): Promise<EburonApp | null> {
  try {
    const { data, error } = await supabase
      .from('apps')
      .update({
        icon: app.icon,
        desc: app.desc,
        color: app.color,
        url: app.url,
        downloads: JSON.stringify(app.downloads),
        developers: JSON.stringify(app.developers || []),
        status: app.status || null,
      })
      .eq('name', app.name)
      .select()
      .single()

    if (error) return app
    return data as unknown as EburonApp
  } catch {
    return app
  }
}

export async function deleteApp(name: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('apps').delete().eq('name', name)
    return !error
  } catch {
    return false
  }
}
