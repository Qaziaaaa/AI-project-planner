import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/favicon.ico") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#CC4A2A"/><g transform="translate(4,4)" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="6" rx="2"/><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></g></svg>`
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/x-icon",
        "Cache-Control": "public, max-age=3600",
      },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/favicon.ico",
}
