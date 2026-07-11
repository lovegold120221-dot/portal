import { type Task } from '@/features/tasks/data/schema'

const STORAGE_KEY = 'eburon-tasks'

function getInitialTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Task[]
    } catch {
      // fall through
    }
  }
  const defaults: Task[] = [
    { id: 'TASK-0001', title: 'Design system overhaul', status: 'in progress', label: 'documentation', priority: 'high' },
    { id: 'TASK-0002', title: 'User auth flow', status: 'done', label: 'feature', priority: 'medium' },
    { id: 'TASK-0003', title: 'Fix login redirect bug', status: 'backlog', label: 'bug', priority: 'critical' },
    { id: 'TASK-0004', title: 'Add dark mode support', status: 'todo', label: 'feature', priority: 'high' },
    { id: 'TASK-0005', title: 'Update API docs', status: 'canceled', label: 'documentation', priority: 'low' },
    { id: 'TASK-0006', title: 'Dashboard performance', status: 'in progress', label: 'bug', priority: 'medium' },
    { id: 'TASK-0007', title: 'Mobile responsive layout', status: 'todo', label: 'feature', priority: 'high' },
    { id: 'TASK-0008', title: 'Email template redesign', status: 'backlog', label: 'documentation', priority: 'low' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
  return defaults
}

let tasks: Task[] = getInitialTasks()
let listeners: Array<() => void> = []

export function getTasks(): Task[] {
  return tasks
}

export function saveTasks(newTasks: Task[]): void {
  tasks = newTasks
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
  for (const l of listeners) l()
}

export function addTask(task: Task): void {
  saveTasks([...tasks, task])
}

export function updateTask(id: string, updates: Partial<Task>): void {
  saveTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
}

export function deleteTask(id: string): void {
  saveTasks(tasks.filter((t) => t.id !== id))
}

export function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}
