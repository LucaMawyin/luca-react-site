import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes } from "./lib/protectedRoutes";

const normalize = (p: string) => (p.startsWith("/") ? p : "/" + p);

export function proxy(req: NextRequest) {
    
    const path = req.nextUrl.pathname + req.nextUrl.search;

    // Check if the route is protected and if the user has a session cookie
    const session = req.cookies.get("session")?.value;
    const isProtected = protectedRoutes.some(route => {
        const base = normalize(route).replace(/\/$/, "");
        const current = path.replace(/\/$/, "");

        return (
            current === base ||
            current.startsWith(base + "/")
        );
    });
    
    if (isProtected && !session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", path);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};