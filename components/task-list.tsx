"use client"

import type { Priority } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useTasks } from "@/context/task-context"
import { format } from "date-fns"

// Helper function to format time in 12-hour format
const formatTimeToAmPm = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    return format(date, "h:mm a") // Format as 12-hour with am/pm
}

export function TaskList() {
    const { tasks, pendingTaskIds, toggleTask } = useTasks()

    // Get badge variant based on priority
    const getPriorityBadge = (priority: Priority) => {
        switch (priority) {
            case "HIGH":
                return { variant: "default" as const, label: "High Priority" }
            case "MEDIUM":
                return { variant: "secondary" as const, label: "Medium" }
            case "LOW":
                return { variant: "outline" as const, label: "Low" }
            default:
                return { variant: "outline" as const, label: "Medium" }
        }
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => {
                const priorityBadge = getPriorityBadge(task.priority)
                const isPendingTask = pendingTaskIds.has(task.id)

                return (
                    <div
                        key={task.id}
                        className={`p-3 rounded-md border flex items-center justify-between ${
                            task.completed ? "bg-muted/50" : ""
                        } ${isPendingTask ? "opacity-70" : ""}`}
                    >
                        <div>
                            <div className="font-medium flex items-center gap-2">
                                <span className={task.completed ? "line-through opacity-70" : ""}>{task.title}</span>
                                <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {formatTimeToAmPm(task.startTime)} - {formatTimeToAmPm(task.endTime)}{" "}
                                {task.duration && `(${task.duration})`}
                            </div>
                            {task.description && <p className="text-sm mt-1">{task.description}</p>}
                        </div>
                        <Checkbox
                            checked={task.completed}
                            disabled={isPendingTask}
                            onCheckedChange={() => toggleTask(task.id, task.completed)}
                            aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                        />
                    </div>
                )
            })}
        </div>
    )
}

