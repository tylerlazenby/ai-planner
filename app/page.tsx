"use client"

import {CalendarCheck, History, ListTodo} from "lucide-react"
import {Instructions, NavCard, Top} from './HomeComponents'

// 'use client' to allow passing the icons
export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Top Elements */}
            <Top/>

            {/* Navigation Items */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <NavCard
                    title={'Enter Today\'s Tasks'}
                    description={'Tell us what you want to accomplish today'}
                    instructions={'Enter the tasks you need to complete today and our AI will help organize them optimally.'}
                    href={'/create-plan'}
                    Icon={ListTodo}
                    buttonText={'Create New Plan'}
                />
                <NavCard
                    title={'View Today\'s Plan'}
                    description={'See your optimized schedule for today'}
                    instructions={'Review your AI-optimized plan for today with detailed timings and explanations.'}
                    href={'/todays-plan'}
                    Icon={CalendarCheck}
                    buttonText={'View Today\'s Plan'}
                    btnVariant={'outline'}
                />
                <NavCard
                    title={'Past Plans'}
                    description={'Review your previous schedules'}
                    instructions={'Access and review your past plans to track your productivity and patterns over time.'}
                    href={'/past-plans'}
                    Icon={History}
                    buttonText={'View History'}
                    btnVariant={'outline'}
                />
            </div>

            {/* Instructional Elements */}
            <Instructions/>
        </div>
    )
}

