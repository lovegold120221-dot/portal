import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sales: Array<{
  name: string
  email: string
  amount: string
  initials: string
  avatar: string
}> = []

export function RecentSales() {
  if (sales.length === 0) {
    return (
      <div className='rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground'>
        No recent sales yet.
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {sales.map((sale) => (
        <div key={sale.email} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            {sale.avatar ? (
              <AvatarImage src={sale.avatar} alt={sale.name} />
            ) : null}
            <AvatarFallback>{sale.initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{sale.name}</p>
              <p className='text-sm text-muted-foreground'>{sale.email}</p>
            </div>
            <div className='font-medium'>+{sale.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
