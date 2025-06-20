import { cookies } from "next/headers";
import Profile from "../../../../../components/profile";
import { DecodeToken } from "@/actions";

type UserData = {
  username: string;
  email: string;
  rol: string;
  creationDate: string;
  nivel: number;
};

interface ProfilePage {
  searchParams?: {
    page?: string;
  };
}

export default async function UserInformation({ searchParams }: ProfilePage) {
  const token = (await cookies()).get("auth_token")?.value;
  const awaitedSearchParams = await searchParams;

  const page: number = awaitedSearchParams?.page
    ? Number(awaitedSearchParams.page) || 0
    : 0;

  if (!token) {
    throw new Error("No auth token found");
  }

  const decoded = DecodeToken(token);

  return (
    <div>
      <Profile userId={(await decoded).sub} pagination={page} />
    </div>
  );
}
