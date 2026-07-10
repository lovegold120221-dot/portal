const appUrl = 'https://eburon.ai'

export function UserMap() {
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        Traffic by region for {appUrl}
      </p>
      <div className='flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground'>
        Regional traffic data will appear here once available.
      </div>
    </div>
  )
}
