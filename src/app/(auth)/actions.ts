'use server'

import { redirect } from "next/navigation";
import { deleteCookie } from "../API/login/route";

export async function logOut() {
    await deleteCookie();
    redirect("/login");
}