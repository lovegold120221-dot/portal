import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type AnalyticsChartProps = {
  data: { name: string; value: number }[]
  loading?: boolean
}

export function AnalyticsChart({ data, loading }: AnalyticsChartProps) {
  if (!loading && data.length === 0) {
    return (
      <div className='flex h-[300px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
        Unread email data will appear here once available.
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
          allowDecimals={false}
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type='monotone'
          dataKey='value'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
