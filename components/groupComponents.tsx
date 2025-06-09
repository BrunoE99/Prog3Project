"use client";

import { redirect, useParams } from "next/navigation";
import MovieReview from "./genericreview";
import {
  findMeeting,
  findRoleInGroup,
  joinGroup,
  leaveGroup,
} from "@/app/group/actions";
import { useActionState, useEffect, useState } from "react";
import MeetingCard from "./meeting";
import Image from "next/image";
import ScheduleMeeting from "./scheduleMeeting";

interface MovieComponents {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: { id: number; nombre: string };
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
  nombre: string;
  urlImagen: string;
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
  const [role, setRole] = useState(undefined);

  if (group) {
    creationDate = group.createdAt.split("T")[0].split("-");
  }

  useEffect(() => {
    async function getRole() {
      const rol = await findRoleInGroup(group.id);
      setRole(rol);
    }
    getRole();
  });

  const joinLeaveFunc = role ? leaveGroup : joinGroup;

  const [state, action, pending] = useActionState(joinLeaveFunc, undefined);

  return (
    <div className="flex flex-col justify-between items-center pt-6">
      <div className="flex flex-row justify-between items-center w-full pl-6 pr-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-6xl">{group.nombre}</span>
            <span className="flex text-base text-[#b0b3b8] align-middle">
              Reviewing since {creationDate[2]}/{creationDate[1]}/
              {creationDate[0]}
            </span>
          </div>
          <p className="text-lg text-wrap w-2/3 pb-3">{group.descripcion}</p>
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
              className={`flex shadow-sm cursor-pointer m-5 pb-1 pt-1 pr-4 pl-4 ${
                !role ? "before:content-['+']" : "before:content-['-']"
              } before:pr-2 before:text-xl text-lg text-center rounded-sm font-semibold bg-blue-700 hover:bg-blue-800 transition-colors delay-75 duration-100 ease-in-out`}
            >
              {!role ? "Join" : "Leave"}
            </button>
          </form>
          <button
            className={`${
              role === "lider" ? "flex" : "hidden"
            } bg-[#1c1e21] shadow-sm cursor-pointer m-5 pb-1 pt-1 pr-4 pl-4 text-lg text-center rounded-sm font-semibold text-nowrap`}
          >
            Edit Group
          </button>
        </div>
      </div>
      <div className="w-full mt-1 border-1 border-solid border-[#65686c] rounded-sm shadow-2xl z-2"></div>
    </div>
  );
}

export function GroupMeetingColumn(props: { meeting?: Reunion; role: string }) {
  const { role } = props;
  const [isSidebarOpen, setOpen] = useState(false);
  const [meeting, setMeeting] = useState(props.meeting);
  const [submitted, setSubmit] = useState(false);
  const meetingInProgress = meeting
    ? new Date(meeting.fecha).getTime() <= Date.now()
    : false;
  const handleSidebarToggle = () => {
    if (isSidebarOpen) {
      setOpen((prev) => !prev);
      document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
    }
  };

  useEffect(() => {
    if (submitted) {
      findMeeting().then((newMeeting) => {
        setMeeting(newMeeting);
        handleSidebarToggle();
      });
    }
  }, [submitted]);

  return (
    <div className="col-span-1 pl-6 bg-[#003566] h-full shadow-2xl rounded-br-md">
      <div className={`${isSidebarOpen ? "flex" : "hidden"}`}>
        <button
          className="fixed top-3 left-3 text-4xl mr-4 mt-0.5 z-4 justify-center dark:text-white text-black cursor-pointer rounded-full hover:bg-[#bdbcb968] h-10 w-10 transition-all delay-75 duration-100 ease-in-out"
          onClick={() => handleSidebarToggle()}
        >
          &times;
        </button>
        <ScheduleMeeting
          onSubmit={() => {
            setSubmit(true);
          }}
        />
      </div>
      <div
        className={`${
          isSidebarOpen ? "fixed" : "hidden"
        } inset-0 bg-black opacity-60`}
      ></div>
      <div className="flex flex-row justify-between items-center mr-3 pt-4">
        <h2 className="font-semibold text-xl">Meeting</h2>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`${
            role && role === "lider" ? "flex" : "hidden"
          } shadow-sm cursor-pointer text-center self-center items-center justify-center pb-1 pt-1 pr-4 pl-4 before:content-['+'] before:pr-2 before:text-xl text-lg rounded-sm font-semibold bg-blue-700 hover:bg-blue-800 transition-colors delay-75 duration-100 ease-in-out`}
        >
          Schedule Meeting
        </button>
      </div>
      <div
        className={`flex flex-col items-center mr-3 ${
          meetingInProgress ? "bg-red-600" : ""
        }`}
      >
        {meeting !== undefined ? (
          <MeetingCard
            meeting={meeting}
            onDelete={() => setMeeting(undefined)}
          />
        ) : (
          <span className="mt-5">No meetings scheduled</span>
        )}
      </div>
    </div>
  );
}

export function GroupReviews({ reviews }: { reviews: ReviewComponents[] }) {
  return (
    <div className="flex flex-col col-span-2 items-center h-full pt-4">
      <div>
        <h2 className="text-4xl">Reviews</h2>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        {reviews ? (
          reviews.map((review, index) => (
            <MovieReview key={index} {...review} />
          ))
        ) : (
          <span className="mt-5">This group has no reviews yet.</span>
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
  memberCount: { cantidad: number };
}) {
  const params = useParams();

  let parsedCount = memberCount.cantidad;
  let unit = "";
  if (memberCount.cantidad >= 10000 && memberCount.cantidad < 1000000) {
    parsedCount = Math.round((memberCount.cantidad / 1000) * 10) / 10;
    unit = "k";
  } else if (memberCount.cantidad >= 1000000) {
    parsedCount = Math.round((memberCount.cantidad / 1000000) * 10) / 10;
    unit = "m";
  }
  return (
    <div className="flex flex-col col-span-1 items-start mr-6 h-full w-full pt-4 bg-[#003566] shadow-2xl rounded-bl-md">
      <div className="flex flex-col mb-2 ml-3">
        <span
          onClick={() => redirect(`/group/${params.id}/members`)}
          className="font-semibold text-xl hover:font-bold cursor-pointer transition-all delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
        >
          Members
        </span>
        <span className="opacity-60">
          {parsedCount}
          {unit}
        </span>
      </div>
      <div className="flex flex-col gap-2 w-full ml-3">
        {members.map((member, index) =>
          member.rol === "lider" ? (
            <div key={index} className="flex flex-row items-center gap-2 pt-3">
              <Image
                src={/*member.user.urlImagen ||*/ "/default-user.png"}
                alt={member.urlImagen}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-lg font-semibold">{member.nombre}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
