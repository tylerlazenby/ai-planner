import {PlanDetail} from "@/components/plan-detail"
import {PrismaClient} from '@prisma/client'
import { notFound } from "next/navigation"

export const dynamicParams = false
export const revalidate = 1440

const prisma = new PrismaClient()

export async function generateStaticParams() {
    const now = new Date()

    const startOfToday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    const startOfTomorrow = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1))

    const plans = await prisma.plan.findMany({
        where: {
            NOT: {
                date: {
                    gte: startOfToday,
                    lt: startOfTomorrow,
                },
            },
        },
        select: {
            id: true,
        },
    })

    return plans.map(plan => {
         return { id: plan.id }
    })
}

export default async function PlanDetailPage({params}: { params: Promise<{ id: string }> }) {
    // Await the params promise
    const resolvedParams = await params

    const now = new Date()

    const startOfToday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    const startOfTomorrow = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1))


    const plan = await prisma.plan.findUniqueOrThrow({
        where: {
            id: resolvedParams.id,
            NOT: {
                date: {
                    gte: startOfToday,
                    lt: startOfTomorrow,
                },
            },
        },
        include: {
            tasks: true
        }
    })
        .catch((err) => {
            console.log(`Attempted to access plan ${resolvedParams.id}. Plan not found. Error: ${err}`)
            return null
        })

    if (!plan) {
        notFound()
    }


    return <PlanDetail plan={plan}/>
}

