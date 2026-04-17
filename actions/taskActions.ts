"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

/**
 * Toggle the completion status of a task
 */
export async function toggleTaskCompletion(taskId: number, currentStatus: boolean) {
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
