import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { addTask } from '@/lib/task-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file.',
    })
    .refine(
      (files) => ['text/csv'].includes(files?.[0]?.type),
      'Please upload csv format.'
    ),
})

type TaskImportForm = z.infer<typeof formSchema>

type ParsedTask = {
  id: string
  title: string
  status: string
  label: string
  priority: string
}

type TasksImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function parseCsvText(text: string): ParsedTask[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headerLine = lines[0].split(',').map((h) => h.trim())
  const titleIdx = headerLine.findIndex((h) =>
    h.toLowerCase().includes('title')
  )
  const statusIdx = headerLine.findIndex((h) =>
    h.toLowerCase().includes('status')
  )
  const labelIdx = headerLine.findIndex((h) =>
    h.toLowerCase().includes('label')
  )
  const priorityIdx = headerLine.findIndex((h) =>
    h.toLowerCase().includes('priority')
  )

  const results: {
    id: string
    title: string
    status: string
    label: string
    priority: string
  }[] = []

  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map((v) => v.trim())
    if (vals.length === 0 || (vals.length === 1 && !vals[0])) continue

    const title = titleIdx >= 0 ? vals[titleIdx] || '' : `Task #${i}`
    if (!title) continue

    results.push({
      id: `TASK-${String(Date.now() + i).slice(-6)}`,
      title,
      status: statusIdx >= 0 ? vals[statusIdx] || 'todo' : 'todo',
      label: labelIdx >= 0 ? vals[labelIdx] || 'feature' : 'feature',
      priority: priorityIdx >= 0 ? vals[priorityIdx] || 'medium' : 'medium',
    })
  }
  return results
}

export function TasksImportDialog({
  open,
  onOpenChange,
}: TasksImportDialogProps) {
  const form = useForm<TaskImportForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const fileRef = form.register('file')
  const [parsing, setParsing] = useState(false)
  const [parsedCount, setParsedCount] = useState(0)

  const onSubmit = async () => {
    const file = form.getValues('file')
    if (!file || !file[0]) return

    setParsing(true)
    const text = await file[0].text()

    try {
      const tasks = parseCsvText(text)
      setParsedCount(tasks.length)
      if (tasks.length > 0) {
        tasks.forEach((t) => addTask(t))
        toast.success(`Imported ${tasks.length} task(s) successfully.`)
      } else {
        toast.error('No valid tasks found in CSV.')
      }
    } catch {
      toast.error('Failed to parse CSV file.')
    } finally {
      setParsing(false)
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
        setParsedCount(0)
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>
            Import tasks quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='task-import-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='my-2'>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='text/csv'
                      {...fileRef}
                      className='h-8 py-0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {parsedCount > 0 && (
              <p className='text-xs text-muted-foreground'>
                Ready to import {parsedCount} task(s).
              </p>
            )}
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' form='task-import-form' disabled={parsing}>
            {parsing ? 'Parsing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
