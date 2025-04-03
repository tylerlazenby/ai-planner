import { PrismaClient, Priority } from "@prisma/client"
import { addDays, subDays } from "date-fns"

const prisma = new PrismaClient()

const main = async () => {
    // Clear existing data
    await prisma.task.deleteMany()
    await prisma.plan.deleteMany()

    console.log("Deleted existing data")

    // Create today's plan
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to midnight for consistency

    const todaysPlan = await prisma.plan.create({
        data: {
            date: today,
            explanation:
                "Today's plan prioritizes your most important tasks in the morning when your energy is highest. We've scheduled breaks between focused work sessions and grouped similar tasks together to minimize context switching.",
            tasks: {
                create: [
                    {
                        title: "Morning team standup",
                        description: "Daily sync with the development team to discuss progress and blockers",
                        startTime: "09:00",
                        endTime: "09:30",
                        duration: "30 minutes",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "Work on project proposal",
                        description: "Finalize the Q3 project proposal document with budget estimates",
                        startTime: "10:00",
                        endTime: "12:00",
                        duration: "2 hours",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "Lunch break",
                        description: "Take a proper break away from the desk",
                        startTime: "12:00",
                        endTime: "13:00",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.MEDIUM,
                    },
                    {
                        title: "Client call with Acme Corp",
                        description: "Discuss the new feature requirements and timeline",
                        startTime: "13:30",
                        endTime: "14:30",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "Email catch-up",
                        description: "Process inbox and respond to important messages",
                        startTime: "15:00",
                        endTime: "16:00",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.MEDIUM,
                    },
                    {
                        title: "Gym session",
                        description: "Cardio and strength training",
                        startTime: "17:30",
                        endTime: "18:30",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.MEDIUM,
                    },
                    {
                        title: "Dinner with family",
                        description: "Quality time with loved ones",
                        startTime: "19:00",
                        endTime: "20:00",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "Review tomorrow's schedule",
                        description: "Prepare for tomorrow and set priorities",
                        startTime: "21:00",
                        endTime: "21:15",
                        duration: "15 minutes",
                        completed: false,
                        priority: Priority.LOW,
                    },
                ],
            },
        },
    })

    console.log("Created today's plan:", todaysPlan.id)

    // Create some past plans (last 7 days)
    for (let i = 1; i <= 7; i++) {
        const pastDate = subDays(today, i)
        pastDate.setHours(0, 0, 0, 0) // Set to midnight for consistency

        const isWeekend = pastDate.getDay() === 0 || pastDate.getDay() === 6

        // Different plan explanation based on weekday/weekend
        const explanation = isWeekend
            ? "This weekend plan balances productive tasks with leisure time. We've scheduled the most energy-intensive activities earlier in the day, leaving the afternoon for relaxation and family time."
            : "This weekday plan prioritizes work commitments while ensuring breaks for meals and exercise. Morning hours are dedicated to important meetings and focused work, with personal activities scheduled after work hours."

        // Create the plan with different tasks based on weekday/weekend
        const pastPlan = await prisma.plan.create({
            data: {
                date: pastDate,
                explanation,
                tasks: {
                    create: isWeekend
                        ? [
                            {
                                title: "Morning run",
                                description: "5km jog around the neighborhood",
                                startTime: "08:00",
                                endTime: "08:45",
                                duration: "45 minutes",
                                completed: true,
                                priority: Priority.MEDIUM,
                            },
                            {
                                title: "Breakfast with family",
                                description: "Pancakes and coffee",
                                startTime: "09:00",
                                endTime: "10:00",
                                duration: "1 hour",
                                completed: true,
                                priority: Priority.MEDIUM,
                            },
                            {
                                title: "Grocery shopping",
                                description: "Get supplies for the week",
                                startTime: "11:00",
                                endTime: "12:30",
                                duration: "1.5 hours",
                                completed: true,
                                priority: Priority.HIGH,
                            },
                            {
                                title: "Home maintenance",
                                description: "Fix the leaky faucet and clean gutters",
                                startTime: "14:00",
                                endTime: "16:00",
                                duration: "2 hours",
                                completed: i > 3, // Only completed for older plans
                                priority: Priority.MEDIUM,
                            },
                            {
                                title: "Movie night",
                                description: "Watch the new sci-fi film with family",
                                startTime: "19:00",
                                endTime: "21:30",
                                duration: "2.5 hours",
                                completed: i > 2, // Only completed for older plans
                                priority: Priority.LOW,
                            },
                        ]
                        : [
                            {
                                title: "Morning review",
                                description: "Plan the day and check emails",
                                startTime: "08:30",
                                endTime: "09:00",
                                duration: "30 minutes",
                                completed: true,
                                priority: Priority.MEDIUM,
                            },
                            {
                                title: "Team meeting",
                                description: "Weekly progress update with the team",
                                startTime: "09:30",
                                endTime: "10:30",
                                duration: "1 hour",
                                completed: true,
                                priority: Priority.HIGH,
                            },
                            {
                                title: "Project development",
                                description: "Work on the main project tasks",
                                startTime: "11:00",
                                endTime: "12:30",
                                duration: "1.5 hours",
                                completed: true,
                                priority: Priority.HIGH,
                            },
                            {
                                title: "Lunch",
                                description: "Break for lunch",
                                startTime: "12:30",
                                endTime: "13:30",
                                duration: "1 hour",
                                completed: true,
                                priority: Priority.MEDIUM,
                            },
                            {
                                title: "Client presentation",
                                description: "Present the quarterly results",
                                startTime: "14:00",
                                endTime: "15:00",
                                duration: "1 hour",
                                completed: i > 2, // Only completed for older plans
                                priority: Priority.HIGH,
                            },
                            {
                                title: "Administrative tasks",
                                description: "Process invoices and expense reports",
                                startTime: "15:30",
                                endTime: "16:30",
                                duration: "1 hour",
                                completed: i > 3, // Only completed for older plans
                                priority: Priority.LOW,
                            },
                            {
                                title: "Evening workout",
                                description: "Gym session - leg day",
                                startTime: "18:00",
                                endTime: "19:00",
                                duration: "1 hour",
                                completed: i > 1, // Only completed for older plans
                                priority: Priority.MEDIUM,
                            },
                        ],
                },
            },
        })

        console.log(`Created past plan for ${pastDate.toISOString().split("T")[0]}:`, pastPlan.id)
    }

    // Create a future plan (tomorrow)
    const tomorrow = addDays(today, 1)
    tomorrow.setHours(0, 0, 0, 0) // Set to midnight for consistency

    const tomorrowPlan = await prisma.plan.create({
        data: {
            date: tomorrow,
            explanation:
                "Tomorrow's plan is structured to help you tackle the most challenging tasks during your peak productivity hours. We've included buffer time between meetings to allow for preparation and follow-up.",
            tasks: {
                create: [
                    {
                        title: "Review weekly goals",
                        description: "Check progress on weekly objectives and adjust as needed",
                        startTime: "08:30",
                        endTime: "09:00",
                        duration: "30 minutes",
                        completed: false,
                        priority: Priority.MEDIUM,
                    },
                    {
                        title: "Department meeting",
                        description: "Monthly department sync with all team leads",
                        startTime: "09:30",
                        endTime: "11:00",
                        duration: "1.5 hours",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "Focus block: Documentation",
                        description: "Update project documentation and knowledge base",
                        startTime: "11:30",
                        endTime: "12:30",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.MEDIUM,
                    },
                    {
                        title: "Lunch with mentor",
                        description: "Career discussion over lunch",
                        startTime: "12:30",
                        endTime: "13:30",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "Code review",
                        description: "Review pull requests from the team",
                        startTime: "14:00",
                        endTime: "15:30",
                        duration: "1.5 hours",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                    {
                        title: "One-on-one with direct report",
                        description: "Weekly check-in with junior developer",
                        startTime: "16:00",
                        endTime: "16:30",
                        duration: "30 minutes",
                        completed: false,
                        priority: Priority.MEDIUM,
                    },
                    {
                        title: "Dentist appointment",
                        description: "Regular checkup",
                        startTime: "17:30",
                        endTime: "18:30",
                        duration: "1 hour",
                        completed: false,
                        priority: Priority.HIGH,
                    },
                ],
            },
        },
    })

    console.log("Created tomorrow's plan:", tomorrowPlan.id)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

