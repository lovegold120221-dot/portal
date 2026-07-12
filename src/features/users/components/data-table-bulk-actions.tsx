import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { clerkUsers } from '@/lib/clerk-users-api'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    if (selectedUsers.length === 0) return
    setBusy(true)
    try {
      await Promise.all(
        selectedUsers.map((u) => clerkUsers.setUserStatus(u.id, status))
      )
      toast.success(
        `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
      )
      table.resetRowSelection()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update users.'
      )
    } finally {
      setBusy(false)
    }
  }

  const handleBulkInvite = async () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    if (selectedUsers.length === 0) return
    setBusy(true)
    try {
      const results = await Promise.allSettled(
        selectedUsers.map((u) =>
          clerkUsers.inviteUser({ emailAddress: u.email, role: u.role })
        )
      )
      const failed = results.filter((r) => r.status === 'rejected').length
      if (failed > 0) {
        toast.warning(
          `Sent ${results.length - failed} invitation(s), ${failed} failed.`
        )
      } else {
        toast.success(
          `Invitation emails sent to ${selectedUsers.length} user(s).`
        )
      }
      table.resetRowSelection()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to send invitations.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              disabled={busy}
              className='size-8'
              aria-label='Invite selected users'
              title='Invite selected users'
            >
              {busy ? <Loader2 className='size-4 animate-spin' /> : <Mail />}
              <span className='sr-only'>Invite selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              disabled={busy}
              className='size-8'
              aria-label='Activate selected users'
              title='Activate selected users'
            >
              {busy ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <UserCheck />
              )}
              <span className='sr-only'>Activate selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              disabled={busy}
              className='size-8'
              aria-label='Deactivate selected users'
              title='Deactivate selected users'
            >
              {busy ? <Loader2 className='size-4 animate-spin' /> : <UserX />}
              <span className='sr-only'>Deactivate selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected users'
              title='Delete selected users'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected users</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
