import { PlanDetail } from "./plan-detail"

export default async function PlanDetailPage({ params }: { params: Promise<{ date: string }> }) {
    // Await the params promise
    const resolvedParams = await params

    return <PlanDetail date={resolvedParams.date} />
}

