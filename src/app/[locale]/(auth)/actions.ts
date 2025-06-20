"use server";

import { deleteCookie } from "@/app/API/login/route";
import { redirect } from "next/navigation";

export async function logOut() {
  await deleteCookie();
  redirect("/login");
}
