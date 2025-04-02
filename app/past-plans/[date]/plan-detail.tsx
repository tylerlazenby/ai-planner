"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addMinutes, parse, isWithinInterval, parseISO } from "date-fns"
import { ArrowLeft, CalendarCheck, Clock, Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Define proper types for our data
interface Task {
    id: string
    title: string
    startTime: string
    endTime: string
    duration: string
    description: string
    completed: boolean
    priority: "low" | "medium" | "high"
}

interface Plan {
    date: Date
    tasks: Task[]
    explanation: string
}

interface TimeSlot {
    time: Date
    label: string
    hour: string
    isHourStart: boolean
}

// Sample data generator for a specific date
const generatePlanForDate = (dateStr: string): Plan => {
    const date = parseISO(dateStr)

    // Generate random tasks based on the date
    const dayOfWeek = date.getDay()
    const tasks: Task[] = []

    // Different task templates based on day of week
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend tasks
        tasks.push({
            id: `${dateStr}-1`,
            title: "Morning exercise",
            startTime: "09:00",
            endTime: "10:00",
            duration: "1 hour",
            description: "Weekend fitness routine to stay active.",
            completed: Math.random() > 0.3,
            priority: "medium",
        })

        tasks.push({
            id: `${dateStr}-2`,
            title: "Grocery shopping",
            startTime: "11:30",
            endTime: "12:30",
            duration: "1 hour",
            description: "Get supplies for the week ahead.",
            completed: Math.random() > 0.3,
            priority: "medium",
        })

        tasks.push({
            id: `${dateStr}-3`,
            title: "Family lunch",
            startTime: "13:00",
            endTime: "14:30",
            duration: "1.5 hours",
            description: "Enjoy a meal with the family.",
            completed: Math.random() > 0.3,
            priority: "high",
        })

        tasks.push({
            id: `${dateStr}-4`,
            title: "House cleaning",
            startTime: "15:30",
            endTime: "17:00",
            duration: "1.5 hours",
            description: "Weekly cleaning routine.",
            completed: Math.random() > 0.5,
            priority: "medium",
        })
    } else {
        // Weekday tasks
        tasks.push({
            id: `${dateStr}-1`,
            title: "Morning team meeting",
            startTime: "09:00",
            endTime: "10:00",
            duration: "1 hour",
            description: "Daily sync with the team to discuss priorities.",
            completed: Math.random() > 0.2,
            priority: "high",
        })

        tasks.push({
            id: `${dateStr}-2`,
            title: "Project work",
            startTime: "10:30",
            endTime: "12:00",
            duration: "1.5 hours",
            description: "Focus time on current project deliverables.",
            completed: Math.random() > 0.3,
            priority: "high",
        })

        tasks.push({
            id: `${dateStr}-3`,
            title: "Lunch break",
            startTime: "12:00",
            endTime: "13:00",
            duration: "1 hour",
            description: "Break for lunch and short walk.",
            completed: Math.random() > 0.1,
            priority: "medium",
        })

        tasks.push({
            id: `${dateStr}-4`,
            title: "Client call",
            startTime: "14:00",
            endTime: "15:00",
            duration: "1 hour",
            description: "Weekly check-in with the client.",
            completed: Math.random() > 0.3,
            priority: "high",
        })

        tasks.push({
            id: `${dateStr}-5`,
            title: "Gym session",
            startTime: "17:30",
            endTime: "18:30",
            duration: "1 hour",
            description: "Workout at the local gym.",
            completed: Math.random() > 0.5,
            priority: "medium",
        })
    }

    // Add some randomness to the tasks
    if (Math.random() > 0.5) {
        tasks.push({
            id: `${dateStr}-extra-1`,
            title: "Read book",
            startTime: "20:00",
            endTime: "21:00",
            duration: "1 hour",
            description: "Continue reading current book.",
            completed: Math.random() > 0.6,
            priority: "low",
        })
    }

    if (Math.random() > 0.7) {
        tasks.push({
            id: `${dateStr}-extra-2`,
            title: "Call parents",
            startTime: "19:00",
            endTime: "19:30",
            duration: "30 minutes",
            description: "Weekly check-in call with family.",
            completed: Math.random() > 0.4,
            priority: "medium",
        })
    }

    return {
        date: date,
        tasks: tasks,
        explanation:
            dayOfWeek === 0 || dayOfWeek === 6
                ? "This weekend plan balances productive tasks with family time. We've scheduled the most energy-intensive activities earlier in the day, leaving the afternoon for family lunch and later hours for household chores."
                : "This weekday plan prioritizes work commitments while ensuring breaks for meals and exercise. Morning hours are dedicated to important meetings and focused work, with personal activities scheduled after work hours.",
    }
}

// Generate time slots for the day (30-minute intervals)
const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
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

interface PlanDetailProps {
    date: string
}

export function PlanDetail({ date }: PlanDetailProps) {
    const router = useRouter()
    const [plan, setPlan] = useState<Plan | null>(null)
    const [loading, setLoading] = useState(true)
    const timeSlots = generateTimeSlots()

    useEffect(() => {
        // In a real app, this would be an API call
        const planData = generatePlanForDate(date)
        setPlan(planData)
        setLoading(false)
    }, [date])

    // Toggle task completion status
    const toggleTaskCompletion = (taskId: string) => {
        if (!plan) return

        setPlan({
            ...plan,
            tasks: plan.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
        })
    }

    // Check if a task falls within a time slot
    const isTaskInTimeSlot = (task: Task, slotTime: Date) => {
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
    const getTasksForTimeSlot = (slotTime: Date): Task[] => {
        if (!plan) return []
        return plan.tasks.filter((task) => isTaskInTimeSlot(task, slotTime))
    }

    // Calculate how many slots a task spans
    const getTaskSpan = (task: Task): number => {
        const taskStart = parse(task.startTime, "HH:mm", new Date())
        const taskEnd = parse(task.endTime, "HH:mm", new Date())

        // Calculate difference in minutes and divide by 30 to get number of slots
        const diffInMinutes = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60)
        return Math.ceil(diffInMinutes / 30)
    }

    // Check if this is the first slot for a task
    const isFirstSlotForTask = (task: Task, slotTime: Date): boolean => {
        const taskStart = parse(task.startTime, "HH:mm", new Date())
        const slotTimeFormatted = format(slotTime, "HH:mm")
        const taskStartFormatted = format(taskStart, "HH:mm")

        return slotTimeFormatted === taskStartFormatted
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Loading Plan...</h1>
            </div>
        )
    }

    if (!plan) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Plan Not Found</h1>
                <Button onClick={() => router.push("/past-plans")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Past Plans
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Plan for {format(plan.date, "EEEE, MMMM d, yyyy")}</h1>

                <Button variant="outline" size="sm" onClick={() => router.push("/past-plans")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Past Plans
                </Button>
            </div>

            <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>AI Optimization Explanation</AlertTitle>
                <AlertDescription>{plan.explanation}</AlertDescription>
            </Alert>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5" />
                        Your Schedule
                    </CardTitle>
                    <CardDescription>Review your planned activities for this day</CardDescription>
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Task Summary</CardTitle>
                    <CardDescription>Overview of all tasks for this day</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {plan.tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-3 rounded-md border flex items-center justify-between ${
                                    task.completed ? "bg-muted/50" : ""
                                }`}
                            >
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        <span className={task.completed ? "line-through opacity-70" : ""}>{task.title}</span>
                                        {task.priority === "high" && <Badge variant="outline">Priority</Badge>}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {task.startTime} - {task.endTime} ({task.duration})
                                    </div>
                                    <p className="text-sm mt-1">{task.description}</p>
                                </div>
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                                    aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

