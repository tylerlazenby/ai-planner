import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)

    // Add a header to force consistent timezone handling
    requestHeaders.set("x-timezone-offset", new Date().getTimezoneOffset().toString())

    // Return the response with the modified headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ["/todays-plan", "/past-plans/:path*", "/create-plan"],
}

