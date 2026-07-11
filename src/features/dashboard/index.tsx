import { LayoutGrid, UserPlus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Notifications } from './components/notifications'
import { Overview } from './components/overview'
import { RecentActivity } from './components/recent-sales'
import { Reports } from './components/reports'
import { UserMap } from './components/user-map'
import { useDashboardData } from './data/use-dashboard-data'

export function Dashboard() {
  const data = useDashboardData()
  return (
    <>
      <Header>
        <TopNav links={topNav} className='me-auto' />
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <LayoutGrid className='h-4 w-4' />
                  Overview
                </CardTitle>
                <CardDescription>
                  Real workspace activity from your connected services.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Overview
                  data={data.apps.downloadsByApp}
                  loading={data.loading}
                />
                <UserMap />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <UserPlus className='h-4 w-4' />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest users registered (from Clerk)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity users={data.users.recent} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics data={data} />
          </TabsContent>
          <TabsContent value='reports' className='space-y-4'>
            <Reports />
          </TabsContent>
          <TabsContent value='notifications' className='space-y-4'>
            <Notifications
              notifications={data.notifications}
              loading={data.loading}
            />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
]
