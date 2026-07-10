import { supabase } from './supabase'
import { supabaseIntegrations, type Service } from '@/features/apps/data/services'

/**
 * Fetch the list of connectable Supabase integrations.
 *
 * Reads from the `services` table in Supabase when available, and falls back
 * to the bundled catalog so the UI works before the table/migration exists.
 */
export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      return supabaseIntegrations
    }
    return data as Service[]
  } catch {
    return supabaseIntegrations
  }
}

/**
 * Toggle the connection state of a service in Supabase.
 * Falls back to a no-op when the table is not provisioned yet.
 */
export async function setServiceConnected(
  slug: string,
  connected: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('services')
      .update({ connected })
      .eq('slug', slug)

    return !error
  } catch {
    return false
  }
}
