import { NextRequest, NextResponse } from "next/server";

export default function handler (req: NextRequest) {
    if (req.nextUrl.pathname.includes('rewriteme-approuter')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/app-router/1/rewritten`)
    }

    if (req.nextUrl.pathname.includes('rewriteme-pagerouter')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/pages-router/1/rewritten`)
    }

    return NextResponse.next()
}