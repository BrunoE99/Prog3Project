"use server";

import { deleteCookie } from "@/app/API/login/loginRoute";
import { redirect } from "next/navigation";

export async function logOut() {
  await deleteCookie();
  redirect("/login");
}
