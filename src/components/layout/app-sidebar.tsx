import { useUser } from '@clerk/react'
import { isEbrunEmail } from '@/lib/user-mail'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { user } = useUser()
  const { collapsible, variant } = useLayout()
  const email = user?.primaryEmailAddress?.emailAddress ?? ''
  const hasMailAccess = isEbrunEmail(email)

    // Filter out mail items if user doesn't have access
  const navGroups = hasMailAccess
     ? sidebarData.navGroups
     : sidebarData.navGroups.map((group) => ({
         ...group,
        items: group.items.filter(
           (item) => typeof item.url === 'string' && item.url !== '/mail',
         ),
        }))

  return (
      <Sidebar collapsible={collapsible} variant={variant}>
        <SidebarHeader>
          <AppTitle />
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
}
