"use client";

import { redirect } from "next/navigation";

export default function GroupMembersHeader({
  id,
  groupMemberCount,
}: {
  id: string;
  groupMemberCount: number;
}) {
  return (
    <div className="flex flex-row gap-3 m-6 items-center">
      <span
        className="text-4xl font-semibold opacity-60 hover:opacity-100 cursor-pointer"
        onClick={() => redirect(`/group/${id}`)}
      >
        &lt;
      </span>
      <h1 className="text-4xl font-semibold">Members:</h1>
      <span className="text-4xl font-semibold">{groupMemberCount}</span>
    </div>
  );
}
