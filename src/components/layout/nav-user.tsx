import { useUser } from '@clerk/react'
import { LogOut } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function NavUser() {
  const { user } = useUser()
  const [open, setOpen] = useDialogState()

  const name = user?.fullName || user?.username || 'User'
  const email = user?.primaryEmailAddress?.emailAddress || ''
  const avatarUrl = user?.imageUrl || ''
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <SidebarMenu>
        {/* User info — static display */}
        <SidebarMenuItem>
          <div className='flex items-center gap-3 rounded-md px-3 py-2 text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className='rounded-lg'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>{name}</span>
              <span className='truncate text-xs'>{email}</span>
            </div>
          </div>
        </SidebarMenuItem>

        {/* Sign out — direct action */}
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setOpen(true)}
            className='text-destructive hover:bg-destructive/10 hover:text-destructive'
          >
            <LogOut />
            <span>Sign out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
