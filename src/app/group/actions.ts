"use server";

import { redirect } from "next/navigation";
import {
  getAllGroupMembers,
  getAllGroups,
  getGroupById,
  getGroupMemberCount,
  getRoleInGroup,
  groupJoinPost,
} from "../API/group/route";
import { groupJoinSchema } from "../lib/definitions";

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

export async function findGroupMemberCount(id: number) {
  const response = await getGroupMemberCount(id);

  return response;
}

export async function joinGroup(_: any, formData: FormData) {
  const id = formData.get("grupoId") as string;

  const validateFields = groupJoinSchema.safeParse({ id: id });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await groupJoinPost(Number(id));

  return response;
}

export async function findRoleInGroup(groupId: number) {
  const response = await getRoleInGroup(groupId);

  return response.rol;
}
