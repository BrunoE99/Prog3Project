"use server";

import { redirect } from "next/navigation";
import {
  deleteGroup,
  deleteMember,
  findAllGroupsByName,
  getAllGroupMembers,
  getAllGroups,
  getGroupById,
  getGroupMemberCount,
  getUserInGroup,
  groupJoinPost,
  groupLeavePost,
  groupPost,
  groupUpdate,
} from "../../API/group/route";
import {
  meetingDelete,
  meetingGet,
  meetingPost,
} from "../../API/meeting/route";
import { groupReviewsGetAllPaged } from "../../API/reviews/route";
import {
  getGroupCreateSchema,
  getGroupEditSchema,
  getGroupJoinSchema,
  getMeetingFormSchema,
} from "@/app/lib/definitions";

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

export async function joinGroup(id: number) {
  const groupJoinSchema = await getGroupJoinSchema();
  const validateFields = groupJoinSchema.safeParse({ id: id });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await groupJoinPost(Number(id));

  return response;
}

export async function leaveGroup(id: number) {
  const groupJoinSchema = await getGroupJoinSchema();
  const validateFields = groupJoinSchema.safeParse({ id: id });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await groupLeavePost(Number(id));

  return response;
}

export async function isUserInGroup(id: number) {
  const response = await getUserInGroup(Number(id));

  return response.enGrupo;
}

export async function findRoleInGroup(groupId: number) {
  const response = await getUserInGroup(groupId);

  return response.rol;
}

export async function scheduleMeeting(_: any, formData: FormData) {
  const fecha = new Date(formData.get("date") as string);
  const link = formData.get("link") as string;

  const MeetingFormSchema = await getMeetingFormSchema();

  const validateFields = MeetingFormSchema.safeParse({
    fecha: fecha.toISOString(),
    link: link,
  });

  if (!validateFields.success) {
    return {
      success: false,
      error: validateFields.error.flatten().fieldErrors.link,
    };
  }

  const response = await meetingPost(fecha, link);

  if (response.status === 201) {
    return {
      success: true,
      message: response.message || "Meeting created successfully",
    };
  } else {
    return {
      status: response.status,
      error: response.message || "An unexpected error occurred",
    };
  }
}

export async function findMeeting() {
  const response = await meetingGet();

  return response;
}

export async function deleteMeeting() {
  const response = await meetingDelete();

  return response;
}

export async function editGroup(_: any, formData: FormData) {
  const id = formData.get("id") as string;
  const nombre = formData.get("group-name") as string;
  const descripcion = formData.get("group-description") as string;
  const editedFields = formData.get("changedFields") as string;
  const [nameChanged, descriptionChanged] = editedFields.split(",");

  const groupEditSchema = await getGroupEditSchema();

  const validateFields = groupEditSchema.safeParse({
    nombre: nameChanged === "true" ? nombre : undefined,
    descripcion: descriptionChanged === "true" ? descripcion : undefined,
  });

  if (!validateFields.success) {
    return {
      success: false,
      status: 400,
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await groupUpdate(
    Number(id),
    nameChanged === "true" ? nombre : undefined,
    descriptionChanged === "true" ? descripcion : undefined
  );

  return response;
}

export async function retrieveFilteredGroups(name: string) {
  const response = await findAllGroupsByName(name);

  return response;
}

export async function kickMember(userId: number, groupId: number) {
  const response = await deleteMember(userId, groupId);

  return response;
}

export async function findAllGroupReviews(groupId: number, page: number = 0) {
  const response = await groupReviewsGetAllPaged(groupId, page);
  if (response.body) {
    return response.body;
  }

  return [];
}

export async function createGroup(_: any, formData: FormData) {
  const nombre = formData.get("group-name") as string;
  const descripcion = formData.get("group-description") as string;
  const descriptionGiven = formData.get("descriptionGiven") as string;

  const groupCreateSchema = await getGroupCreateSchema();

  const validateFields = groupCreateSchema.safeParse({
    nombre: nombre,
    descripcion: descriptionGiven === "true" ? descripcion : undefined,
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await groupPost(
    nombre,
    descriptionGiven === "true" ? descripcion : undefined
  );

  if (response.status === 201) {
    return response.body;
  } else {
    return {
      status: response.status,
      error: response.message || "An unexpected error occurred",
    };
  }
}

export async function eraseGroup(id: number) {
  const response = await deleteGroup(id);

  return response;
}
