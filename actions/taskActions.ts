"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

/**
 * Toggle the completion status of a task
 */
export async function toggleTaskCompletion(taskId: string, currentStatus: boolean) {
    try {
        // Update the task in the database
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                completed: !currentStatus,
            },
        })

        // Revalidate the today's plan page to reflect the changes
        revalidatePath("/todays-plan")
        // Also revalidate the past plans page
        revalidatePath("/past-plans")

        return { success: true }
    } catch (error) {
        console.error("Error updating task:", error)
        return { success: false, error: "Failed to update task" }
    }
}

