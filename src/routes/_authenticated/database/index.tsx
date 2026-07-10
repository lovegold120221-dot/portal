import { createFileRoute } from '@tanstack/react-router'
import { Database } from '@/features/database'

export const Route = createFileRoute('/_authenticated/database/')({
  component: Database,
})
