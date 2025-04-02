"use client"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {CalendarCheck, CalendarDays, History, ListTodo} from "lucide-react"

export function Top() {
    return (
        <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2">AI Planner</h1>
            <p className="text-muted-foreground text-lg">Optimize your day with AI-powered scheduling</p>
        </header>
    )
}

interface NavCardParams {
    title: string
    description: string
    instructions: string
    href: string
    buttonText: string
    Icon: typeof History | typeof CalendarCheck | typeof ListTodo
    btnVariant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}

export function NavCard({
                            title,
                            description,
                            instructions,
                            href,
                            buttonText,
                            Icon,
                            btnVariant = undefined
                        }: NavCardParams) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5"/>
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p>{instructions}</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" variant={btnVariant}>
                    <Link href={href} className="w-full">
                        {buttonText}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export const Instructions = () => {
    return (<div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <ListTodo className="h-6 w-6 text-primary"/>
                </div>
                <h3 className="font-medium">1. Enter Your Tasks</h3>
                <p className="text-sm text-muted-foreground text-center">List everything you want to accomplish
                    today</p>
            </div>

            <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <CalendarDays className="h-6 w-6 text-primary"/>
                </div>
                <h3 className="font-medium">2. AI Optimization</h3>
                <p className="text-sm text-muted-foreground text-center">
                    Our AI analyzes and creates the optimal schedule
                </p>
            </div>

            <div className="flex flex-col items-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <CalendarCheck className="h-6 w-6 text-primary"/>
                </div>
                <h3 className="font-medium">3. Follow Your Plan</h3>
                <p className="text-sm text-muted-foreground text-center">Execute your day with confidence and
                    clarity</p>
            </div>
        </div>
    </div>)
}