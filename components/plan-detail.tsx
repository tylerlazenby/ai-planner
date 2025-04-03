"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, CalendarCheck, Info } from "lucide-react"
import type { Plan, Task } from "@prisma/client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskProvider } from "@/context/task-context"
import { PlanSchedule } from "@/components/plan-schedule"
import { TaskList } from "@/components/task-list"
import { useEffect, useState } from "react"

interface PlanWithTasks extends Plan {
    tasks: Task[]
}

interface PlanDetailProps {
    plan: PlanWithTasks
    backUrl?: string
    backLabel?: string
}

export function PlanDetail({ plan, backUrl = "/past-plans", backLabel = "Back to Past Plans" }: PlanDetailProps) {
    const router = useRouter()
    const [formattedDate, setFormattedDate] = useState<string>("")

    // Format the date on the client side to ensure consistency
    useEffect(() => {
        // Handle both string and Date objects
        const dateObj = typeof plan.date === "string" ? new Date(plan.date) : plan.date

        // Log for debugging
        console.log("Client date object:", dateObj)
        console.log("Original plan.date:", plan.date)

        // Format the date
        setFormattedDate(format(dateObj, "EEEE, MMMM d, yyyy"))
    }, [plan.date])

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Plan for {formattedDate || "Loading..."}</h1>

                <Button variant="outline" size="sm" onClick={() => router.push(backUrl)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {backLabel}
                </Button>
            </div>

            {plan.explanation && (
                <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertTitle>AI Optimization Explanation</AlertTitle>
                    <AlertDescription>{plan.explanation}</AlertDescription>
                </Alert>
            )}

            <TaskProvider initialTasks={plan.tasks}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarCheck className="h-5 w-5" />
                            Your Schedule
                        </CardTitle>
                        <CardDescription>Review your planned activities for this day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlanSchedule />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Task Summary</CardTitle>
                        <CardDescription>Overview of all tasks for this day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TaskList />
                    </CardContent>
                </Card>
            </TaskProvider>
        </div>
    )
}

