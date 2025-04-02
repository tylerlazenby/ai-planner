"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarCheck, History, Home, ListTodo, Menu } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Navigation items
const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Create Plan", href: "/create-plan", icon: ListTodo },
    { name: "Today's Plan", href: "/todays-plan", icon: CalendarCheck },
    { name: "Past Plans", href: "/past-plans", icon: History },
]

export function MainNavigation() {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const [isOpen, setIsOpen] = useState(false)

    // Close the mobile menu when a link is clicked
    const handleLinkClick = () => {
        if (isMobile) {
            setIsOpen(false)
        }
    }

    return (
        <>
            {/* Desktop Navigation */}
            {!isMobile && (
                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                    <ThemeToggle />
                </div>
            )}

            {/* Mobile Navigation */}
            {isMobile && (
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Menu">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-left">AI Planner</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-2 mt-6">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={handleLinkClick}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            }`}
                                        >
                                            <item.icon className="mr-2 h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            )}
        </>
    )
}

