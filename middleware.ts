import { NextRequest, NextResponse } from "next/server";
import { Tree, frameTree } from "./lib/frame-tree";

function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object'
}

function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export default function handler(req: NextRequest) {

    if (req.nextUrl.pathname.includes('/rewritten')) {
        const rewrittenPath = req.nextUrl.pathname.replace('/rewritten', '')
        return NextResponse.rewrite(`${req.nextUrl.origin}${rewrittenPath}`)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }