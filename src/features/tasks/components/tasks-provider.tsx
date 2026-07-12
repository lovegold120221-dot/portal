import React, { createContext, useContext, useEffect, useState } from 'react'
import { getTasks, subscribe as subscribeTasks } from '@/lib/task-store'
import useDialogState from '@/hooks/use-dialog-state'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  data: Task[]
}

const TasksContext = createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(getTasks())
    return subscribeTasks(() => setTasks(getTasks()))
      }, [])

  return (
       <TasksContext
         value={{
          open,
          setOpen,
          currentRow,
          setCurrentRow,
          data: tasks,
           }}
         >
           {children}
         </TasksContext>
       )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = useContext(TasksContext)
  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
       }
    return tasksContext
      }
