import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = [/^\/$/, /^\/profile(\/.*)?$/]
const publicRoutes = ["/login", "/register"]

type JwtBody = {
    sub: number,
    role: 'user' | 'admin',
    iat: number,
    exp: number
}

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((regex) => regex.test(path));
    const isPublicRoute = publicRoutes.includes(path);

    const token = (await cookies()).get('auth_token')?.value;

    let role = null;
    let expiresAt = null;
    let userId = null;

    if (token) {
        const now = Math.floor(Date.now() / 1000);

        try {
            const decoded = jwtDecode<JwtBody>(token);
            userId = decoded.sub;
            role = decoded.role;
            expiresAt = decoded.exp;

            if (expiresAt < now) {
            NextResponse.redirect(new URL ("/login", req.nextUrl));
        }
        } catch (e) {
            console.error('Invalid token');
        }

        
    }

    const isLogged = role === 'user' || role === 'admin';

    if (isProtectedRoute && !isLogged) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && isLogged) {
        return NextResponse.redirect(new URL(`/profile/${userId}`, req.nextUrl));
    }

    return NextResponse.next();
};