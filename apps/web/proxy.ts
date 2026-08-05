import { NextRequest, NextResponse } from "next/server";

const proxy = (req: NextRequest) => {
    const { pathname } = req.nextUrl
    const token = req.cookies.get("refreshToken")?.value

    if (pathname.startsWith("/admin") && !token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
}

export default proxy