"use server";

import { getDecodedToken } from "@/app/[locale]/movie/[id]/actions";

export async function getAuthorization() {
  const token = await getDecodedToken();

  return token?.role === "admin";
}
