import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const appUrl = 'https://eburon.ai'

const data = [
  { name: 'Jan', clicks: 3200, downloads: 210 },
  { name: 'Feb', clicks: 2800, downloads: 180 },
  { name: 'Mar', clicks: 4100, downloads: 290 },
  { name: 'Apr', clicks: 3800, downloads: 260 },
  { name: 'May', clicks: 5200, downloads: 340 },
  { name: 'Jun', clicks: 4900, downloads: 310 },
  { name: 'Jul', clicks: 6100, downloads: 420 },
  { name: 'Aug', clicks: 5800, downloads: 390 },
  { name: 'Sep', clicks: 6400, downloads: 450 },
  { name: 'Oct', clicks: 7200, downloads: 510 },
  { name: 'Nov', clicks: 6900, downloads: 480 },
  { name: 'Dec', clicks: 8500, downloads: 620 },
]

export function Overview() {
  return (
    <div className='space-y-2'>
      <p className='text-sm text-muted-foreground'>
        Tracking activity for {appUrl}
      </p>
      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            direction='ltr'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Bar
            dataKey='clicks'
            fill='currentColor'
            radius={[4, 4, 0, 0]}
            className='fill-primary'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
