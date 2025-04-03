import PastPlansClient from "./PastPlansClient";
import {PrismaClient} from '@prisma/client'


export default async function PastPlansPage() {
    const prisma = new PrismaClient()
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
        include: {
            tasks: true
        },
        orderBy: {
            date: 'desc'
        }
    })

    return (
        <PastPlansClient
            pastPlans={plans}
        />
    )
}

