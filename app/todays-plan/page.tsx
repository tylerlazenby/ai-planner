import { PrismaClient } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { PlanDetail } from "@/components/plan-detail"

// Add this at the top of your file
export const dynamic = "force-dynamic"
export const revalidate = 0

// Initialize Prisma client
const prisma = new PrismaClient()

export default async function TodaysPlanPage() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to midnight for consistency

    // Fetch today's plan with tasks from the database
    const plan = await prisma.plan.findFirst({
        where: {
            date: today,
        },
        include: {
            tasks: true,
        },
    })

    // If no plan exists for today
    if (!plan) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Today&apos;s Plan</h1>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <h2 className="text-xl font-semibold mb-2">No plan found for today</h2>
                            <p className="text-muted-foreground mb-4">You haven&apos;t created a plan for today yet.</p>
                            <a href="/create-plan" className="text-primary hover:underline">
                                Create a new plan
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <PlanDetail plan={plan} backUrl="/" backLabel="Back to Home" />
}

