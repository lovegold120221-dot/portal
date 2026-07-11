import { getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type User } from '@/features/users/data/schema'

export function RecentActivity({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <div className='rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground'>
        No recent activity yet.
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {users.map((u) => {
        const name = `${u.first_name} ${u.last_name}`.trim() || u.email
        return (
          <div key={u.id} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              <AvatarFallback>{getDisplayNameInitials(name)}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm leading-none font-medium'>{name}</p>
                <p className='text-sm text-muted-foreground'>{u.email}</p>
              </div>
              <div className='text-xs font-medium text-muted-foreground'>
                {u.role}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
