"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ArrowRight, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SortableTaskItem } from "./sortable-task-item"

// Task type definition
interface Task {
    id: string
    content: string
}

export default function CreatePlanPage() {
    const router = useRouter()
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    // Handle adding a new task
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault()
        if (newTask.trim()) {
            const task: Task = {
                id: `task-${Date.now()}`,
                content: newTask.trim(),
            }
            setTasks([...tasks, task])
            setNewTask("")
        }
    }

    // Handle removing a task
    const handleRemoveTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    // Handle drag end event
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (tasks.length === 0) return

        setIsSubmitting(true)

        // Here you would normally send the tasks to your API
        // For now, we'll simulate a delay and redirect
        setTimeout(() => {
            // In a real app, you'd send the tasks to your backend
            // and then redirect to the plan page after processing
            router.push("/todays-plan")
        }, 2000)
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Create Today&apos;s Plan</h1>

            <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>How this works</AlertTitle>
                <AlertDescription>
                    Enter all the tasks you want to accomplish today. Drag and drop to reorder them by priority (highest at the
                    top). Our AI will analyze your tasks and create an optimized schedule.
                </AlertDescription>
            </Alert>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Add Your Tasks</CardTitle>
                    <CardDescription>What would you like to accomplish today?</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="e.g., Go for a 20 minute run, prepare for meeting with Jessica..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit">Add</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Your Tasks</CardTitle>
                    <CardDescription>Drag to reorder by priority (highest at top)</CardDescription>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No tasks added yet. Add some tasks above to get started.
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                                <ul className="space-y-2">
                                    {tasks.map((task) => (
                                        <SortableTaskItem
                                            key={task.id}
                                            id={task.id}
                                            content={task.content}
                                            onRemove={() => handleRemoveTask(task.id)}
                                        />
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    )}
                </CardContent>
                {tasks.length > 0 && (
                    <CardFooter>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Creating your plan..." : "Create My Plan"}
                            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}