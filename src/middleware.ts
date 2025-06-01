import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { DecodeToken } from "./actions";

// atm this works for checking if the Token is valid, need to change/update it
const protectedRoutes = [/^\/profile(\/.*)?$/]
const publicRoutes = ["/", "/login", "/register", /^\/movie(\/.*)?$/]

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((regex) => regex.test(path));
    const isPublicRoute = publicRoutes.includes(path);

    const token = (await cookies()).get('auth_token')?.value;

    let role = null;
    let expiresAt = null;
    let userId = null;

    if (token) {

        try {
            const decoded = await DecodeToken(token);

            userId = decoded.sub;
            role = decoded.role;
            expiresAt = decoded.exp;
        } catch (e) {
            console.error('Invalid token');
        }
    }

    const isLogged = role === 'user' || role === 'admin';

    if (isProtectedRoute && !isLogged) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // if (isPublicRoute && isLogged) {
    //     return NextResponse.redirect(new URL(`/profile/${userId}`, req.nextUrl));
    // }

    return NextResponse.next();
};