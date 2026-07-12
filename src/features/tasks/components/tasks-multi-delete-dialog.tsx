'use client'

import { useState, useCallback } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { deleteTask } from '@/lib/task-store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

const CONFIRM_WORD = 'DELETE'

export function TasksMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = useCallback(async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
      }

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedTaskIds = (selectedRows as unknown as { original: { id: string } }[])
        .map((r) => r.original.id)

    if (selectedTaskIds.length === 0) {
      toast.error('No tasks selected.')
      return
        }

    setLoading(true)
    try {
      for (const id of selectedTaskIds) {
        deleteTask(id)
          }
      toast.success(`Deleted ${selectedTaskIds.length} task(s) successfully.`)
      setValue('')
      table.resetRowSelection()
       } catch {
      toast.error('Failed to delete some tasks.')
      } finally {
      setLoading(false)
      onOpenChange(false)
        }
     }, [value, table, onOpenChange])

  return (
         <ConfirmDialog
         open={open}
         onOpenChange={onOpenChange}
         form='tasks-multi-delete-form'
         disabled={value.trim() !== CONFIRM_WORD || loading}
         title={
           <span className='text-destructive'>
             <AlertTriangle
              className='me-1 inline-block stroke-destructive'
              size={18}
             />{' '}
             Delete {(() => {
                const count = table.getFilteredSelectedRowModel().rows.length
                return count
              })()}{' '}
               {(() => {
                 const count = table.getFilteredSelectedRowModel().rows.length
                 return count > 1 ? 'tasks' : 'task'
               })()}
           </span>
         }
         desc={
           <form
            id='tasks-multi-delete-form'
            onSubmit={(e) => {
              e.preventDefault()
              handleDelete()
              }}
            className='space-y-4'
              >
                <p className='mb-2'>
                 Are you sure you want to delete the selected tasks? <br />
                 This action cannot be undone.
               </p>

               <Label className='my-4 flex flex-col items-start gap-1.5'>
                   <span className=''>Confirm by typing "{CONFIRM_WORD}":</span>
                   <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
                    autoFocus
                    />
               </Label>

               <Alert variant='destructive'>
                   <AlertTitle>Warning!</AlertTitle>
                   <AlertDescription>
                     Please be careful, this operation can not be rolled back.
                   </AlertDescription>
                 </Alert>
                 {loading && (
                   <p className='text-xs text-muted-foreground'>Deleting...</p>
                 )}
               </form>
           }
         confirmText={loading ? 'Deleting...' : 'Delete'}
         destructive
         />
       )
}
