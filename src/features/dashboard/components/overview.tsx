import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type OverviewProps = {
  data: { name: string; count: number }[]
  loading?: boolean
}

export function Overview({ data, loading }: OverviewProps) {
  if (!loading && data.length === 0) {
    return (
      <div className='flex h-[350px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
        No app download data available yet.
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      <p className='text-sm text-muted-foreground'>
        Download options available per app
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
            allowDecimals={false}
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey='count'
            fill='currentColor'
            radius={[4, 4, 0, 0]}
            className='fill-primary'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
