import { DecodeToken } from "@/actions";
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
    const request = await fetch(`${api_URL}/${id}`, {
      method: "POST",
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

export async function groupLeavePost(id: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    const request = await fetch(`${api_URL}/${id}/leave`, {
      method: "DELETE",
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

export async function getUserInGroup(grupoId: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    let decoded;
    if (token) {
      decoded = await DecodeToken(token);
    }

    const request = await fetch(
      `${api_URL}/${grupoId}/membership/${decoded?.sub}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

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

export async function groupUpdate(
  id: number,
  nombre?: string,
  descripcion?: string
) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const body: Record<string, string> = {};
    if (nombre !== undefined) body.nombre = nombre;
    if (descripcion !== undefined) body.descripcion = descripcion;

    const request = await fetch(`${api_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    const answer = request;
    const answerJson = await request.json();

    if (answer.status == 201) {
      return {
        status: answer.status,
        body: answerJson,
      };
    } else {
      return {
        status: answer.status,
        message: answerJson.message || "An unexpected error ocurred",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function findAllGroupsByName(name: string) {
  try {
    const params = new URLSearchParams({ q: name });
    const request = await fetch(`${api_URL}/search/name?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      error: "An unexpected error ocurred",
    };
  }
}
