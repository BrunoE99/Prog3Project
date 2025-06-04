"use server";

import { redirect } from "next/navigation";
import {
  getAllGroupMembers,
  getAllGroups,
  getGroupById,
  groupJoinPost,
} from "../API/group/route";

export async function findAllGroups() {
  const response = await getAllGroups();

  if (response.status === 401) {
    //refresh token here
    redirect("/login");
  }

  return await response.json();
}

export async function findGroupById(id: number) {
  const response = await getGroupById(id);

  return await response.json();
}

export async function findAllGroupMembers(id: number) {
  const response = await getAllGroupMembers(id);

  return await response.json();
}

export async function joinGroup(id: number) {
  const response = await groupJoinPost(id);

  return response;
}
