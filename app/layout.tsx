import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"

import { MainNavigation } from "@/components/main-navigation"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "AI Planner",
    description: "Optimize your day with AI-powered scheduling",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-40 border-b bg-background px-4 sm:px-6">
                    <div className="container mx-auto flex h-16 items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center">
                                <span className="text-xl font-bold">AI Planner</span>
                            </Link>
                        </div>
                        <MainNavigation />
                    </div>
                </header>
                <main className="flex-1">{children}</main>
                <footer className="border-t py-4 bg-muted/40 px-4 sm:px-6">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            &copy; {new Date().getFullYear()} AI Planner. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
        </body>
        </html>
    )
}

