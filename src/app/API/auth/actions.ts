"use server";
import { getDecodedToken } from "@/app/movie/[id]/actions";

export async function getAuthorization() {
  const token = await getDecodedToken();

  return token?.role === "admin";
}
