import { cookies } from "next/headers";
import "server-only";

const api_URL = "http:localhost:3000/api/grupos";

export async function getAllGroups() {
  const userCookie = await cookies();
  const token = userCookie.get("auth_token")?.value;
  const request = await fetch(api_URL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return request;
}

export async function getGroupById(id: number) {
  const userCookie = await cookies();
  const token = userCookie.get("auth_token")?.value;
  const request = await fetch(`${api_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return request;
}

export async function getAllGroupMembers(id: number) {
  const userCookie = await cookies();
  const token = userCookie.get("auth_token")?.value;
  const request = await fetch(`${api_URL}/${id}/members`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return request;
}

export async function groupJoinPost(id: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    const request = await fetch(`${api_URL}/${id}/members`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function getRoleInGroup(grupoId: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}/${grupoId}/members`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function getGroupMemberCount(id: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}/${id}/count-members`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}
