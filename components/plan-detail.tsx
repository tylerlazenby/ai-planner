"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, CalendarCheck, Info, RefreshCw } from "lucide-react"
import type { Plan, Task } from "@prisma/client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskProvider } from "@/context/task-context"
import { PlanSchedule } from "@/components/plan-schedule"
import { TaskList } from "@/components/task-list"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

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
    const pathname = usePathname()
    const [formattedDate, setFormattedDate] = useState<string>("")

    // Format the date on the client side to ensure consistency
    useEffect(() => {
        try {
            // Check if we're on the Today's Plan page using Next.js pathname
            const isOnTodaysPlanPage = pathname === "/todays-plan"

            if (isOnTodaysPlanPage) {
                // If we're on the Today's Plan page, always use today's date
                const today = new Date()
                setFormattedDate(format(today, "EEEE, MMMM d, yyyy"))
            } else {
                // For other pages (past plans), use the date from the database
                if (typeof plan.date === "string") {
                    // Handle different date formats
                    let dateObj: Date

                    // Check if the date string contains a 'T' character (ISO format)
                    const dateStr = plan.date as string
                    if (dateStr.indexOf("T") !== -1) {
                        // If it's an ISO string like "2025-04-03T00:00:00.000Z" or "2025-04-03T06:00:00.000Z"
                        dateObj = new Date(dateStr)
                    } else {
                        // If it's just a date string like "2025-04-03"
                        // Extract just the date part (YYYY-MM-DD) and create a date in local timezone
                        const dateParts = dateStr.split("-").map(Number)
                        const year = dateParts[0]
                        const month = dateParts[1]
                        const day = dateParts[2]
                        dateObj = new Date(year, month - 1, day)
                    }

                    // Format the date
                    setFormattedDate(format(dateObj, "EEEE, MMMM d, yyyy"))
                } else if (plan.date instanceof Date) {
                    // If it's already a Date object
                    setFormattedDate(format(plan.date, "EEEE, MMMM d, yyyy"))
                } else {
                    // Fallback
                    setFormattedDate("Unknown date format")
                }
            }
        } catch (error) {
            console.error("Error formatting date:", error)
            // Fallback to displaying the raw date
            setFormattedDate(String(plan.date))
        }
    }, [plan.date, pathname])

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Plan for {formattedDate || "Loading..."}</h1>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()} title="Refresh data">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(backUrl)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {backLabel}
                    </Button>
                </div>
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

