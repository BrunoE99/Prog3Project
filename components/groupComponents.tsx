"use client";

import { redirect } from "next/navigation";
import MovieReview from "./genericreview";
import { findRoleInGroup, joinGroup } from "@/app/group/actions";
import { useActionState, useEffect, useRef } from "react";
import MeetingCard from "./meeting";
import Image from "next/image";

interface MovieComponents {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: string;
  fechaEstreno: string;
  duracion: number;
  urlImagen: string;
  calificacion: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  rol: string;
  fechaCreacion: Date;
  nivel: number;
  urlImagen: string;
  reviews: ReviewComponents[];
  deletedAt: Date;
  gruposRelacionados: GroupMembership[];
  comentarios: Comment[];
}

interface Reunion {
  id: number;
  fecha: string;
  link: string;
  groupoId: number;
  grupo: Group;
}

interface Group {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  usuariosRelacionados: GroupMembership[];
  reviews: ReviewComponents[];
  reunionId: number;
  reunion: Reunion;
}

interface GroupMembership {
  id: number;
  user: User;
  grupo: Group;
  rol: "miembro" | "lider";
}

interface Comment {
  id: number;
  texto: string;
  userId: number;
  user: User;
  reviewId: number;
  review: ReviewComponents;
}

interface ReviewComponents {
  id: number;
  userId: number;
  texto: string;
  puntuacion: number;
  user: User;
  peliculaId: number;
  pelicula: MovieComponents;
  grupo: Group | undefined;
  comentarios: Comment[];
}

export function GroupPreviewCard(group: Group) {
  return (
    <div
      className="rounded-sm cursor-pointer bg-[#003566] shadow-lg"
      onClick={() => redirect(`group/${group.id}`)}
    >
      <div className="flex flex-col">
        <span className="text-2xl">{group.nombre}</span>
        <span className="text-base">{group.descripcion}</span>
      </div>
    </div>
  );
}

export function GroupHeader(group: Group) {
  let creationDate: string[] = [];
  const [state, action, pending] = useActionState(joinGroup, undefined);
  const role = useRef(undefined);

  if (group) {
    creationDate = group.createdAt.split("T")[0].split("-");
  } else {
    redirect("/login");
  }

  useEffect(() => {
    async function getRole() {
      role.current = await findRoleInGroup(group.id);
    }
    getRole();
  });

  return (
    <div className="flex flex-col justify-between items-center m-6">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-6xl">{group.nombre}</span>
            <span className="flex text-base text-[#b0b3b8] align-middle">
              Here since {creationDate[2]}/{creationDate[1]}/{creationDate[0]}
            </span>
          </div>
          <p className="text-lg text-wrap w-2/3">{group.descripcion}</p>
        </div>
        <div className="flex flex-row justify-end items-end">
          <form action={action}>
            <input
              className="hidden"
              name="grupoId"
              id="grupoId"
              defaultValue={group.id}
            />
            <button
              disabled={pending}
              type="submit"
              name="submit"
              className="shadow-sm cursor-pointer flex m-5 pb-1 pt-1 pr-4 pl-4 before:content-['+'] before:pr-2 before:text-xl text-lg text-center rounded-sm font-semibold bg-blue-700 hover:bg-blue-800 transition-colors delay-75 duration-100 ease-in-out"
            >
              Join
            </button>
          </form>
          <button
            className={`${
              role.current === "lider" ? "flex" : "hidden"
            } bg-[#1c1e21] shadow-sm cursor-pointer m-5 pb-1 pt-1 pr-4 pl-4 text-lg text-center rounded-sm font-semibold`}
          >
            Edit Group
          </button>
        </div>
      </div>
      <div className="w-full mt-1 border-1 border-solid border-[#65686c] rounded-sm shadow-2xl m-1 z-2"></div>
    </div>
  );
}

export function GroupMeetingColumn(meeting: Reunion) {
  const meetingDate = meeting ? new Date(meeting.fecha) : undefined;
  return (
    <div className="col-span-1 ml-6 h-full">
      <div>
        <h2 className="font-semibold text-xl">Meetings</h2>
        <button className="shadow-sm cursor-pointer flex m-5 pb-1 pt-1 pr-4 pl-4 ml-0 mt-2 before:content-['+'] before:pr-2 before:text-xl text-lg text-center rounded-sm font-semibold bg-blue-700 hover:bg-blue-800 transition-colors delay-75 duration-100 ease-in-out">
          Schedule Meeting
        </button>
      </div>
      <div className="flex flex-col items-center">
        {meetingDate && meetingDate.getTime() <= Date.now() ? (
          <MeetingCard {...meeting} />
        ) : (
          <span>No meetings scheduled</span>
        )}
      </div>
    </div>
  );
}

export function GroupReviews({ reviews }: { reviews: ReviewComponents[] }) {
  return (
    <div className="flex flex-col col-span-2 items-center h-full">
      <h2 className="text-4xl">Reviews</h2>
      <div className="flex flex-col justify-center items-center gap-2">
        {reviews ? (
          reviews.map((review, index) => (
            <MovieReview key={index} {...review} />
          ))
        ) : (
          <span>This group has no reviews yet.</span>
        )}
      </div>
    </div>
  );
}

export function GroupMembersPreview({
  members,
  memberCount,
}: {
  members: GroupMembership[];
  memberCount: number;
}) {
  let parsedCount;
  let unit = "";
  if (memberCount >= 10000 && memberCount < 1000000) {
    parsedCount = Math.round((memberCount / 1000) * 100) / 100;
    unit = "k";
  } else if (memberCount >= 1000000) {
    parsedCount = Math.round((memberCount / 1000000) * 100) / 100;
    unit = "m";
  }
  return (
    <div className="flex flex-col col-span-1 items-start mr-6 h-full">
      <div>
        <span className="text-lg hover:font-semibold">Members</span>
        <span>
          {parsedCount}
          {unit}
        </span>
        <div className="flex flex-col gap-2">
          {members.map((member, index) => (
            <div key={index} className="flex flex-row items-center gap-2">
              <Image
                src={/*member.user.urlImagen ||*/ "/default-user.png"}
                alt={member.nombre}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{member.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
