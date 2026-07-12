import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { supabase } from '@/lib/supabase'

interface DbTable {
  name: string
  rows: number
  size: string
  engine: string
}

const fallbackTables: DbTable[] = [
  { name: 'public.users', rows: 0, size: '0.5 MB', engine: 'InnoDB' },
  { name: 'public.apps', rows: 0, size: '0.3 MB', engine: 'InnoDB' },
  { name: 'public.services', rows: 0, size: '0.1 MB', engine: 'InnoDB' },
]

export function Database() {
  const [tables, setTables] = useState<DbTable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function fetchTables() {
      try {
        // Fetch all tables from the database
        const { data: tablesData, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename, tableowner')
          .order('tablename')

        if (tablesError && active) {
          // If pg_tables query fails, try fetching from a known table
          setError('Database connection unavailable. Showing placeholder tables.')
          setTables([])
          return
        }

        if (tablesData && active) {
          const dbTables: DbTable[] = tablesData
            .filter((t) => !t.tablename.startsWith('pg_') && t.tablename !== 'spatial_ref_sys')
            .map((t) => ({
              name: t.tablename,
              rows: 0,
              size: '—',
              engine: 'InnoDB',
            }))
          setTables(dbTables)
        }
       } catch {
        if (active) {
          setError('Failed to connect to database.')
         }
       } finally {
        if (active) setLoading(false)
         }
       }

    fetchTables()
    return () => { active = false }
     }, [])

  // Fallback: if DB tables couldn't be fetched, try a direct query
  useEffect(() => {
    if (tables.length === 0 && !error) {
      let active = true
      async function tryFetchApps() {
        try {
          const { data, error } = await supabase.from('apps').select('*')
          if (!error && data && active) {
            setTables([{ name: 'apps', rows: data.length, size: '0.5 MB', engine: 'InnoDB' }])
            setLoading(false)
           }
          } catch {
            // Silent
           }
         }
      tryFetchApps()
      return () => { active = false }
       }
      , [tables.length, error])

  const totalRows = tables.reduce((sum, t) => sum + t.rows, 0)
  const totalSizeMB = tables
    .reduce((sum, t) => {
       const num = parseFloat(t.size)
       return isNaN(num) ? sum : sum + num
      }, 0)
    .toFixed(1)

  return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>

        <Main fixed>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Database</h1>
            <p className='text-muted-foreground'>
              Overview of your database tables and storage.
            </p>
          </div>

          <div className='my-6 grid gap-4 md:grid-cols-4'>
            <div className='rounded-lg border p-4'>
              <p className='text-sm text-muted-foreground'>Total Tables</p>
              <p className='text-2xl font-bold'>{loading ? '...' : tables.length}</p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-sm text-muted-foreground'>Total Rows</p>
              <p className='text-2xl font-bold'>
                {loading ? '...' : totalRows.toLocaleString()}
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-sm text-muted-foreground'>Total Size</p>
              <p className='text-2xl font-bold'>
                {loading ? '...' : `${totalSizeMB} MB`}
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-sm text-muted-foreground'>Engine</p>
              <p className='text-2xl font-bold'>InnoDB</p>
            </div>
          </div>

          <div className='rounded-lg border'>
            <div className='grid grid-cols-4 gap-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground'>
              <span>Table Name</span>
              <span>Rows</span>
              <span>Size</span>
              <span>Engine</span>
            </div>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='size-6 animate-spin text-muted-foreground' />
              </div>
            ) : error ? (
              <div className='px-4 py-3 text-sm text-muted-foreground'>{error}</div>
            ) : tables.length === 0 ? (
              <div className='px-4 py-12 text-center text-sm text-muted-foreground'>
                No tables found. Make sure the Supabase schema is applied.
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.name}
                  className='grid grid-cols-4 gap-4 border-b px-4 py-3 text-sm last:border-0'
                >
                  <span className='font-medium'>{table.name}</span>
                  <span>{table.rows > 0 ? table.rows.toLocaleString() : '—'}</span>
                  <span>{table.size}</span>
                  <span>{table.engine}</span>
                </div>
              ))
            )}
          </div>
        </Main>
      </>
     )
}
