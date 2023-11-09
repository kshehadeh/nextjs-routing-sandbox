import { NextRequest, NextResponse } from "next/server";

export default function handler (req: NextRequest) {

    // APP ROUTER
    if (req.nextUrl.pathname.startsWith('/app-router/rewritten/dynamic/1/server')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/app-router/dynamic/1/server`)
    }

    if (req.nextUrl.pathname.startsWith('/app-router/rewritten/non-dynamic/server')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/app-router/non-dynamic/server`)
    }


    // PAGES ROUTER
    if (req.nextUrl.pathname.startsWith('/pages-router/rewritten/dynamic/1/client')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/pages-router/dynamic/1/client`)
    }

    if (req.nextUrl.pathname.startsWith('/pages-router/rewritten/dynamic/1/static')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/pages-router/dynamic/1/static`)
    }

    if (req.nextUrl.pathname.startsWith('/pages-router/rewritten/non-dynamic/client')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/pages-router/non-dynamic/client`)
    }

    if (req.nextUrl.pathname.startsWith('/pages-router/rewritten/non-dynamic/static')) {
        return NextResponse.rewrite(`${req.nextUrl.origin}/pages-router/non-dynamic/static`)
    }

    return NextResponse.next()
}