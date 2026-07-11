import { createFileRoute } from '@tanstack/react-router'
import { MailFeature } from '@/features/mail'

export const Route = createFileRoute('/_authenticated/mail/')({
  component: MailFeature,
})
