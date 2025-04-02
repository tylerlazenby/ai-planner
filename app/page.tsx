"use client"

import Link from "next/link"
import { CalendarCheck, CalendarDays, History, ListTodo } from "lucide-react"
import { Top } from './HomeElements'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
      <div className="container mx-auto px-4 py-8">
        <Top/>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Enter Today&#39;s Tasks
              </CardTitle>
              <CardDescription>Tell us what you want to accomplish today</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Enter the tasks you need to complete today and our AI will help organize them optimally.</p>
            </CardContent>
            <CardFooter>
              <Link href="/create-plan" className="w-full">
                <Button className="w-full">Create New Plan</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                View Today&#39;s Plan
              </CardTitle>
              <CardDescription>See your optimized schedule for today</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Review your AI-optimized plan for today with detailed timings and explanations.</p>
            </CardContent>
            <CardFooter>
              <Link href="/todays-plan" className="w-full">
                <Button variant="outline" className="w-full">
                  View Today&#39;s Plan
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Past Plans
              </CardTitle>
              <CardDescription>Review your previous schedules</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Access and review your past plans to track your productivity and patterns over time.</p>
            </CardContent>
            <CardFooter>
              <Link href="/past-plans" className="w-full">
                <Button variant="outline" className="w-full">
                  View History
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">1. Enter Your Tasks</h3>
              <p className="text-sm text-muted-foreground text-center">List everything you want to accomplish today</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">2. AI Optimization</h3>
              <p className="text-sm text-muted-foreground text-center">
                Our AI analyzes and creates the optimal schedule
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <CalendarCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">3. Follow Your Plan</h3>
              <p className="text-sm text-muted-foreground text-center">Execute your day with confidence and clarity</p>
            </div>
          </div>
        </div>
      </div>
  )
}

