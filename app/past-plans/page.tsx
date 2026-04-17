import PastPlansClient from "./PastPlansClient";
import { startOfDay, endOfDay } from "date-fns"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PastPlansPage() {


    // Get today's date range in UTC
    const today = new Date()
    const startOfToday = startOfDay(today)
    const endOfToday = endOfDay(today)

    console.log("Today's date range for past plans query:", {
        startOfToday: startOfToday.toISOString(),
        endOfToday: endOfToday.toISOString(),
    })

    const plans = await prisma.plan.findMany({
        where: {
            NOT: {
                date: {
                    gte: startOfToday.toISOString(),
                    lte: endOfToday.toISOString(),
                },
            },
        },
        include: {
            tasks: true
        },
        orderBy: {
            date: 'desc'
        }
    })

    return (
        <PastPlansClient pastPlans={plans} />
    )
}
