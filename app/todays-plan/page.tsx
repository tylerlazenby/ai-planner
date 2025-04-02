"use client"

import { useState } from "react"
import { format, addMinutes, parse, isWithinInterval } from "date-fns"
import { CalendarCheck, Clock, Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Sample data - in a real app, this would come from your backend
const samplePlan = {
    date: new Date(),
    tasks: [
        {
            id: "1",
            title: "Prepare for meeting with Jessica",
            startTime: "11:00",
            endTime: "12:30",
            duration: "1.5 hours",
            description: "Review presentation slides and gather necessary data for the quarterly review meeting.",
            completed: false,
            priority: "high",
        },
        {
            id: "2",
            title: "Go for a 20 minute run",
            startTime: "13:00",
            endTime: "13:30",
            duration: "30 minutes",
            description: "Quick cardio session to boost energy levels before afternoon tasks.",
            completed: false,
            priority: "medium",
        },
        {
            id: "3",
            title: "Mow the lawn",
            startTime: "14:00",
            endTime: "15:00",
            duration: "1 hour",
            description: "Complete yard maintenance while the weather is good.",
            completed: false,
            priority: "medium",
        },
        {
            id: "4",
            title: "Help daughter with science project",
            startTime: "16:00",
            endTime: "17:30",
            duration: "1.5 hours",
            description: "Assist with the volcano experiment and help prepare the presentation board.",
            completed: false,
            priority: "high",
        },
    ],
    explanation:
        "We've prioritized the meeting preparation and science project help as these are tasks that can't be skipped. Since it's a school day, we've scheduled the science project help for late afternoon when your daughter will be home. We've also bundled the outdoor activities together in the early afternoon when you'll have a break between important commitments.",
}

// Generate time slots for the day (30-minute intervals)
const generateTimeSlots = () => {
    const slots = []
    const startTime = parse("08:00", "HH:mm", new Date())

    for (let i = 0; i < 28; i++) {
        // 8:00 AM to 10:00 PM
        const time = addMinutes(startTime, i * 30)
        slots.push({
            time,
            label: format(time, "h:mm a"),
            hour: format(time, "h a"),
            isHourStart: format(time, "mm") === "00",
        })
    }

    return slots
}

export default function TodaysPlanPage() {
    const [tasks, setTasks] = useState(samplePlan.tasks)
    const timeSlots = generateTimeSlots()

    // Toggle task completion status
    const toggleTaskCompletion = (taskId: string) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
    }

    // Check if a task falls within a time slot
    const isTaskInTimeSlot = (task: (typeof tasks)[0], slotTime: Date) => {
        const taskStart = parse(task.startTime, "HH:mm", new Date())
        const taskEnd = parse(task.endTime, "HH:mm", new Date())

        // For the current slot time, create an interval that spans 30 minutes
        const slotEnd = addMinutes(slotTime, 30)

        // Check if the task overlaps with this time slot
        return (
            isWithinInterval(slotTime, { start: taskStart, end: taskEnd }) ||
            isWithinInterval(slotEnd, { start: taskStart, end: taskEnd }) ||
            (slotTime <= taskStart && slotEnd >= taskEnd)
        )
    }

    // Get tasks for a specific time slot
    const getTasksForTimeSlot = (slotTime: Date) => {
        return tasks.filter((task) => isTaskInTimeSlot(task, slotTime))
    }

    // Calculate how many slots a task spans
    const getTaskSpan = (task: (typeof tasks)[0]) => {
        const taskStart = parse(task.startTime, "HH:mm", new Date())
        const taskEnd = parse(task.endTime, "HH:mm", new Date())

        // Calculate difference in minutes and divide by 30 to get number of slots
        const diffInMinutes = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60)
        return Math.ceil(diffInMinutes / 30)
    }

    // Check if this is the first slot for a task
    const isFirstSlotForTask = (task: (typeof tasks)[0], slotTime: Date) => {
        const taskStart = parse(task.startTime, "HH:mm", new Date())
        const slotTimeFormatted = format(slotTime, "HH:mm")
        const taskStartFormatted = format(taskStart, "HH:mm")

        return slotTimeFormatted === taskStartFormatted
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Today&#39;s Plan</h1>

            <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>AI Optimization Explanation</AlertTitle>
                <AlertDescription>{samplePlan.explanation}</AlertDescription>
            </Alert>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5" />
                        Your Schedule for {format(samplePlan.date, "EEEE, MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>Check off tasks as you complete them</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {/* Planner header */}
                        <div className="grid grid-cols-[80px_1fr] border-b">
                            <div className="p-2 font-medium text-center text-sm">Time</div>
                            <div className="p-2 font-medium text-sm">Tasks</div>
                        </div>

                        {/* Time slots */}
                        <div className="divide-y">
                            {timeSlots.map((slot, index) => {
                                const tasksInSlot = getTasksForTimeSlot(slot.time)
                                /*const hasTask = tasksInSlot.length > 0
*/
                                return (
                                    <div key={slot.label} className={`grid grid-cols-[80px_1fr] ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
                                        {/* Time label */}
                                        <div className="p-2 border-r text-sm flex items-center justify-center">
                                            {slot.isHourStart ? (
                                                <div className="font-medium">{slot.hour}</div>
                                            ) : (
                                                <div className="text-muted-foreground text-xs">:30</div>
                                            )}
                                        </div>

                                        {/* Task area */}
                                        <div className="min-h-[60px] p-1">
                                            {tasksInSlot.map((task) => {
                                                // Only render the task in its first time slot
                                                if (isFirstSlotForTask(task, slot.time)) {
                                                    const spanCount = getTaskSpan(task)

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className={`
                                h-full rounded-md border p-2 flex flex-col
                                ${task.completed ? "bg-muted border-muted" : "bg-card"}
                                ${task.priority === "high" ? "border-l-4 border-l-primary" : ""}
                              `}
                                                            style={{
                                                                minHeight: "58px",
                                                                height: `${Math.max(58, spanCount * 60 - 2)}px`,
                                                            }}
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-grow">
                                                                    <div className="font-medium flex items-center gap-1">
                                    <span className={task.completed ? "line-through opacity-70" : ""}>
                                      {task.title}
                                    </span>
                                                                        {task.priority === "high" && (
                                                                            <Badge variant="outline" className="ml-1">
                                                                                Priority
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                                                                        <Clock className="h-3 w-3 mr-1" />
                                                                        {task.startTime} - {task.endTime} ({task.duration})
                                                                    </div>
                                                                </div>
                                                                <Checkbox
                                                                    checked={task.completed}
                                                                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                                                                    aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                                                                />
                                                            </div>
                                                            {spanCount > 1 && <p className="text-xs mt-2 line-clamp-2">{task.description}</p>}
                                                        </div>
                                                    )
                                                }
                                                return null
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button variant="outline">Export Schedule</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

