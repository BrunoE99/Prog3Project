import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

type JwtBody = {
    sub: number,
    role: 'user' | 'admin',
    iat: number,
    exp: number
}

export async function DecodeToken(token: string) {
    const decoded = jwtDecode<JwtBody>(token);

    return decoded;
}

export async function IsLogged() {
    const token = (await cookies()).get('auth_token')?.value;
    const isLogged = token ? true : false;

    return isLogged
}