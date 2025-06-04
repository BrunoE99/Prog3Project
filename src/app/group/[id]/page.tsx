"use server";

import { getGroupById } from "@/app/API/group/route";

export default async function Group({ params }: { params: { id: string } }) {
  const { id } = params;
  const group = await getGroupById(Number(id));
  return <div></div>;
}
