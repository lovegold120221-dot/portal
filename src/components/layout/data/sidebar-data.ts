import {
  LayoutDashboard,
  Monitor,
  AppWindow,
  Palette,
  HelpCircle,
  Settings,
  UserCog,
  Users,
  MessagesSquare,
  Database,
  Bug,
  Brain,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Eburon AI',
      logo: AppWindow,
      plan: 'AI-Powered Admin',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: MessagesSquare,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: AppWindow,
        },
        {
          title: 'Database',
          url: '/database',
          icon: Database,
        },
        {
          title: 'Models',
          url: '/models',
          icon: Brain,
        },
        {
          title: 'Issues',
          url: '/issues',
          icon: Bug,
        },
        {
          title: 'Chats',
          url: '/chats',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Settings,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Monitor,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
