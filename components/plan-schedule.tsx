"use client"

import { useState } from "react"
import { format, addMinutes, parse, differenceInMinutes } from "date-fns"
import { Clock } from "lucide-react"
import type { Task } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTasks } from "@/context/task-context"

interface TimeSlot {
    time: Date
    label: string
    hour: string
    isHourStart: boolean
    isNightHour: boolean
}

// Constants for layout calculations
const TIME_SLOT_HEIGHT = 60 // Height of each time slot in pixels
const SLOT_DURATION = 30 // Duration of each slot in minutes

// Helper function to format time in 12-hour format
const formatTimeToAmPm = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    return format(date, "h:mm a") // Format as 12-hour with am/pm
}

export function PlanSchedule() {
    const { tasks, pendingTaskIds, toggleTask } = useTasks()
    const [showFullDay, setShowFullDay] = useState(false)

    // Generate time slots for the day (30-minute intervals)
    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = []
        // Start at midnight (00:00)
        const startTime = parse("00:00", "HH:mm", new Date())

        for (let i = 0; i < 48; i++) {
            // 48 slots = 24 hours
            const time = addMinutes(startTime, i * 30)
            const hour = Number.parseInt(format(time, "H"))
            const isNightHour = hour < 6 || hour >= 22 // Consider 10 PM - 6 AM as night hours

            slots.push({
                time,
                label: format(time, "h:mm a"),
                hour: format(time, "h a"),
                isHourStart: format(time, "mm") === "00",
                isNightHour,
            })
        }

        return slots
    }

    const allTimeSlots = generateTimeSlots()

    // Filter time slots based on user preference
    const timeSlots = showFullDay
        ? allTimeSlots
        : allTimeSlots.filter((slot) => {
            const hour = Number.parseInt(format(slot.time, "H"))
            return hour >= 6 && hour < 22 // Default view: 6 AM - 10 PM
        })

    // Calculate position and size for a task
    const getTaskPosition = (task: Task) => {
        const taskStart = parse(task.startTime, "HH:mm", new Date())
        const taskEnd = parse(task.endTime, "HH:mm", new Date())

        // Find the index of the slot where this task starts
        const startSlotIndex = timeSlots.findIndex((slot) => format(slot.time, "HH:mm") === format(taskStart, "HH:mm"))

        if (startSlotIndex === -1) return null

        // Calculate duration in minutes and convert to slots
        const durationMinutes = differenceInMinutes(taskEnd, taskStart)
        const slotSpan = Math.max(1, Math.ceil(durationMinutes / SLOT_DURATION))

        return {
            top: startSlotIndex * TIME_SLOT_HEIGHT,
            height: slotSpan * TIME_SLOT_HEIGHT - 2, // -2 for border
            startSlotIndex,
        }
    }

    // Check if any tasks are scheduled during night hours
    const hasNightTasks = tasks.some((task) => {
        const hour = Number.parseInt(task.startTime.split(":")[0])
        return hour < 6 || hour >= 22
    })

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => setShowFullDay(!showFullDay)}>
                    {showFullDay ? "Show Default Hours (6 AM - 10 PM)" : "Show Full 24 Hours"}
                </Button>
            </div>

            {!showFullDay && hasNightTasks && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md text-sm">
                    <p>
                        <strong>Note:</strong> You have tasks scheduled outside the default view hours (6 AM - 10 PM). Click
                        &quot;Show Full 24 Hours&quot; to see all tasks.
                    </p>
                </div>
            )}

            <div className="rounded-md border">
                {/* Planner header */}
                <div className="grid grid-cols-[80px_1fr] border-b">
                    <div className="p-2 font-medium text-center text-sm">Time</div>
                    <div className="p-2 font-medium text-sm">Tasks</div>
                </div>

                {/* Time slots container */}
                <div className="relative">
                    {/* Time slots */}
                    <div className="divide-y">
                        {timeSlots.map((slot, index) => (
                            <div
                                key={slot.label}
                                className={`grid grid-cols-[80px_1fr] ${
                                    slot.isNightHour ? "bg-slate-100 dark:bg-slate-900/40" : index % 2 === 0 ? "bg-muted/30" : ""
                                }`}
                                style={{ height: `${TIME_SLOT_HEIGHT}px` }}
                            >
                                {/* Time label */}
                                <div className="p-2 border-r text-sm flex items-center justify-center">
                                    {slot.isHourStart ? (
                                        <div className="font-medium">{slot.hour}</div>
                                    ) : (
                                        <div className="text-muted-foreground text-xs">:30</div>
                                    )}
                                </div>

                                {/* Empty task area - tasks will be positioned absolutely */}
                                <div className="min-h-[60px]"></div>
                            </div>
                        ))}
                    </div>

                    {/* Tasks positioned absolutely */}
                    <div className="absolute top-0 left-[80px] right-0 pointer-events-none">
                        {tasks.map((task) => {
                            const position = getTaskPosition(task)
                            if (!position) return null

                            const isHighPriority = task.priority === "HIGH"
                            const isPendingTask = pendingTaskIds.has(task.id)

                            return (
                                <div
                                    key={task.id}
                                    className={`
                    absolute rounded-md border p-2 flex flex-col m-1
                    ${task.completed ? "bg-muted border-muted" : "bg-card"}
                    ${isHighPriority ? "border-l-4 border-l-primary" : ""}
                    ${isPendingTask ? "opacity-70" : ""}
                    pointer-events-auto
                  `}
                                    style={{
                                        top: `${position.top}px`,
                                        height: `${position.height}px`,
                                        left: "0",
                                        right: "8px",
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-grow">
                                            <div className="font-medium flex items-center gap-1">
                                                <span className={task.completed ? "line-through opacity-70" : ""}>{task.title}</span>
                                                {isHighPriority && (
                                                    <Badge variant="outline" className="ml-1">
                                                        Priority
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatTimeToAmPm(task.startTime)} - {formatTimeToAmPm(task.endTime)}{" "}
                                                {task.duration && `(${task.duration})`}
                                            </div>
                                        </div>
                                        <Checkbox
                                            checked={task.completed}
                                            disabled={isPendingTask}
                                            onCheckedChange={() => toggleTask(task.id, task.completed)}
                                            aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                                        />
                                    </div>
                                    {position.height > TIME_SLOT_HEIGHT && task.description && (
                                        <p className="text-xs mt-2 line-clamp-2">{task.description}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button variant="outline">Export Schedule</Button>
            </div>
        </>
    )
}

