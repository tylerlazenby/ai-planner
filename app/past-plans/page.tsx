"use client"

import { useState } from "react"
import Link from "next/link"
import { format, subDays } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Clock, History } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample data for past plans
const generateSamplePastPlans = () => {
    const today = new Date()
    const pastPlans = []

    for (let i = 0; i < 14; i++) {
        const date = subDays(today, i)
        const dateStr = format(date, "yyyy-MM-dd")

        // Skip generating a plan for today since we have a separate page for that
        if (i === 0) continue

        const taskCount = 3 + Math.floor(Math.random() * 3) // 3-5 tasks
        const completedCount = Math.floor(Math.random() * (taskCount + 1)) // 0 to taskCount completed

        const tasks = []
        for (let j = 0; j < taskCount; j++) {
            const taskTemplates = [
                "Meeting with team",
                "Project work",
                "Exercise",
                "Grocery shopping",
                "Doctor appointment",
                "Pick up kids",
                "Prepare presentation",
                "House cleaning",
                "Call parents",
                "Read book",
            ]

            tasks.push({
                title: taskTemplates[Math.floor(Math.random() * taskTemplates.length)],
                completed: j < completedCount,
            })
        }

        pastPlans.push({
            id: dateStr,
            date: date,
            tasks: tasks,
            completionRate: (completedCount / taskCount) * 100,
        })
    }

    return pastPlans
}

const samplePastPlans = generateSamplePastPlans()

export default function PastPlansPage() {
    const [currentPage, setCurrentPage] = useState(0)
    const plansPerPage = 7
    const totalPages = Math.ceil(samplePastPlans.length / plansPerPage)

    const currentPlans = samplePastPlans.slice(currentPage * plansPerPage, (currentPage + 1) * plansPerPage)

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    // Get completion status label and color
    const getCompletionStatus = (rate: number) => {
        if (rate === 100) return { label: "Completed", variant: "success" as const }
        if (rate >= 75) return { label: "Almost Complete", variant: "default" as const }
        if (rate >= 50) return { label: "In Progress", variant: "secondary" as const }
        if (rate > 0) return { label: "Started", variant: "outline" as const }
        return { label: "Not Started", variant: "destructive" as const }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <History className="h-7 w-7" />
                Past Plans
            </h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Your Planning History</CardTitle>
                    <CardDescription>Review and analyze your past plans to improve your productivity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentPlans.map((plan) => {
                            const formattedDate = format(plan.date, "EEEE, MMMM d, yyyy")
                            const status = getCompletionStatus(plan.completionRate)

                            return (
                                <Link key={plan.id} href={`/past-plans/${plan.id}`} className="block">
                                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <h3 className="font-medium">{formattedDate}</h3>
                                                    </div>

                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{plan.tasks.length} tasks planned</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:items-end gap-2">
                                                    <Badge variant={status.variant} className="w-fit">
                                                        {status.label}
                                                    </Badge>

                                                    <div className="w-full sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${plan.completionRate}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {Math.round(plan.completionRate)}% complete
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {plan.tasks.slice(0, 3).map((task, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className={task.completed ? "line-through opacity-70" : ""}
                                                    >
                                                        {task.title}
                                                    </Badge>
                                                ))}
                                                {plan.tasks.length > 3 && <Badge variant="outline">+{plan.tasks.length - 3} more</Badge>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}

                        {currentPlans.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">No past plans found.</div>
                        )}
                    </div>
                </CardContent>

                {totalPages > 1 && (
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 0}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        <div className="text-sm text-muted-foreground">
                            Page {currentPage + 1} of {totalPages}
                        </div>

                        <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages - 1}>
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}

