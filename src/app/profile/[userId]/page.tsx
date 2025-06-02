import { cookies } from "next/headers";
import Profile from "../../../../components/profile"
import { DecodeToken, IsLogged } from "@/actions";

type UserData = {
    username: string,
    email: string,
    rol: string,
    creationDate: string,
    nivel: number
}

export default async function UserInformation() {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
        throw new Error("No auth token found");
    }

    const decoded = DecodeToken(token);

    return (
        <div>
            <Profile userId={(await decoded).sub} />
        </div>
    )
}