'use server'

import { PrismaClient, Priority } from "@prisma/client"
import OpenAI from "openai"
import { startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface TaskInput {
    id: string
    content: string
}

const addTasksAction = async (tasks: TaskInput[]) => {
    const prisma = new PrismaClient()

    if (!tasks.length) {
        console.error("No tasks to add.")
        return
    }

    const systemPrompt = `
You are an expert productivity assistant.

Given a list of short task titles, do the following:
1. Prioritize and schedule them realistically through the day.
2. For each task, return:
   - A short description (1-2 sentences)
   - startTime and endTime in 24-hour format (HH:MM)
   - A human-readable duration like "1 hour" or "45 minutes"

3. Then, provide a short paragraph explaining *why* you scheduled and prioritized the tasks the way you did. Mention time of day, urgency, natural groupings, etc.

Return your response in the following JSON format:

{
  "explanation": "string",
  "tasks": [
    {
      "content": "string",
      "description": "string",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "duration": "string"
    }
  ]
}
`

    const userPrompt = `Here are the tasks:\n${JSON.stringify(tasks, null, 2)}`

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
    })

    const aiResponse = completion.choices[0]?.message?.content ?? ""

    console.log(aiResponse)

    let parsed: {
        explanation: string
        tasks: {
            content: string
            description: string
            startTime: string
            endTime: string
            duration: string
        }[]
    }

    try {
        parsed = JSON.parse(aiResponse)
    } catch (err) {
        console.error("Failed to parse AI response:")
        console.error(err)
        console.error(aiResponse)
        return
    }

    const { explanation, tasks: enrichedTasks } = parsed

    const today = startOfDay(new Date());
    console.log("Creating plan for date: ", today.toISOString())

    // Create the plan with the explanation
    const plan = await prisma.plan.upsert({
        where: {date: today},
        update: {
            explanation,
        },
        create:  {
            date: today,
            explanation,
        }
    })

    // remove past tasks
    if (plan.createdAt !== plan.updatedAt) {
        await prisma.task.deleteMany({where: {planId: plan.id}})
    }

    const total = enrichedTasks.length

    const rawTasks = enrichedTasks.map((task, index) => {
        let priority
        const ratio = index / total
        if (ratio < 0.33) priority = Priority.HIGH
        else if (ratio < 0.66) priority = Priority.MEDIUM
        else priority = Priority.LOW

        return {
            title: task.content,
            description: task.description,
            startTime: task.startTime,
            endTime: task.endTime,
            duration: task.duration,
            priority,
            planId: plan.id,
        }
    })

    const result = await prisma.task.createMany({
        data: rawTasks,
    })

    revalidatePath("/todays-plan")
    revalidatePath("/past-plans")
    revalidatePath("/")

    return {
        planId: plan.id,
        tasksCreated: result.count,
        explanation,
    }
}

export default addTasksAction