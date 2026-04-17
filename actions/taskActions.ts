"use server"

import { revalidatePath } from "next/cache"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

