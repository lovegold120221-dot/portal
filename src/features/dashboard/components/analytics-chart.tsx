import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data: Array<{ name: string; clicks: number; uniques: number }> = []

export function AnalyticsChart() {
  if (data.length === 0) {
    return (
      <div className='flex h-[300px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
        Analytics data will appear here once available.
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
