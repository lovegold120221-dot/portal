import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const tables: Array<{
  name: string
  rows: number
  size: string
  engine: string
}> = []

export function Database() {
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
            <p className='text-2xl font-bold'>{tables.length}</p>
          </div>
          <div className='rounded-lg border p-4'>
            <p className='text-sm text-muted-foreground'>Total Rows</p>
            <p className='text-2xl font-bold'>
              {tables.reduce((a, t) => a + t.rows, 0).toLocaleString()}
            </p>
          </div>
          <div className='rounded-lg border p-4'>
            <p className='text-sm text-muted-foreground'>Total Size</p>
            <p className='text-2xl font-bold'>
              {tables
                .reduce((a, t) => {
                  const num = parseFloat(t.size)
                  return a + num
                }, 0)
                .toFixed(0)}{' '}
              MB
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
          {tables.map((table) => (
            <div
              key={table.name}
              className='grid grid-cols-4 gap-4 border-b px-4 py-3 text-sm last:border-0'
            >
              <span className='font-medium'>{table.name}</span>
              <span>{table.rows.toLocaleString()}</span>
              <span>{table.size}</span>
              <span>{table.engine}</span>
            </div>
          ))}
        </div>
      </Main>
    </>
  )
}
