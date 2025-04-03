"use client"

import { createContext, useContext, useState, useTransition, type ReactNode } from "react"
import type { Task } from "@prisma/client"
import { toggleTaskCompletion } from "./actions/toggleTaskCompletionAction"

interface TaskContextType {
    tasks: Task[]
    pendingTaskIds: Set<string>
    toggleTask: (taskId: string, currentStatus: boolean) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children, initialTasks }: { children: ReactNode; initialTasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [, startTransition] = useTransition()
    const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set())

    const toggleTask = (taskId: string, currentStatus: boolean) => {
        // Optimistically update the UI
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !currentStatus } : task)))

        // Add task to pending set
        setPendingTaskIds((prev) => {
            const newSet = new Set(prev)
            newSet.add(taskId)
            return newSet
        })

        // Call the server action
        startTransition(async () => {
            const result = await toggleTaskCompletion(taskId, currentStatus)

            // If the action failed, revert the optimistic update
            if (!result.success) {
                setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: currentStatus } : task)))
            }

            // Remove task from pending set
            setPendingTaskIds((prev) => {
                const newSet = new Set(prev)
                newSet.delete(taskId)
                return newSet
            })
        })
    }

    return <TaskContext.Provider value={{ tasks, pendingTaskIds, toggleTask }}>{children}</TaskContext.Provider>
}

export function useTasks() {
    const context = useContext(TaskContext)
    if (context === undefined) {
        throw new Error("useTasks must be used within a TaskProvider")
    }
    return context
}

