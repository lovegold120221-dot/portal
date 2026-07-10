import { LayoutGrid } from 'lucide-react'
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
import { Overview } from './components/overview'
import { UserMap } from './components/user-map'
import { Reports } from './components/reports'
import { Notifications } from './components/notifications'

export function Dashboard() {
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
                  Your workspace overview will appear here as data becomes
                  available.
                 </CardDescription>
               </CardHeader>
               <CardContent className='space-y-4'>
                 <Overview />
                 <UserMap />
               </CardContent>
             </Card>
           </TabsContent>
           <TabsContent value='analytics' className='space-y-4'>
             <Analytics />
           </TabsContent>
           <TabsContent value='reports' className='space-y-4'>
             <Reports />
           </TabsContent>
           <TabsContent value='notifications' className='space-y-4'>
             <Notifications />
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
