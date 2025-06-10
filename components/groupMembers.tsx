"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { findAllGroupMembers, kickMember } from "@/app/group/actions";
import { ModalConfirmation } from "./modalConfirmation";
import { getAuthToken } from "@/app/movie/[id]/actions";

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

export function GroupMembersHeader({ id }: { id: string }) {
  return (
    <div className="flex flex-row gap-3 m-6 items-center">
      <span
        className="text-4xl font-semibold opacity-60 hover:opacity-100 cursor-pointer"
        onClick={() => redirect(`/group/${id}`)}
      >
        &lt;
      </span>
      <h1 className="text-4xl font-semibold">Members</h1>
    </div>
  );
}

export function GroupMembersBody({
  members,
  groupId,
  role,
}: {
  members: GroupMembership[];
  groupId: number;
  role: string | undefined;
}) {
  const [groupMembers, setMembers] = useState(members);
  const [selectedMember, setMember] = useState<number | undefined>(undefined);
  const [selectedMemberName, setName] = useState<string | undefined>(undefined);
  const [kicked, setKicked] = useState(false);
  const [modalOpen, setOpen] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const handleModalOpen = () => {
    if (token) {
      setOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      redirect("/login");
    }
  };
  useEffect(() => {
    (async () => {
      const t = await getAuthToken();
      setToken(t);
    })();
    async function kickSelected() {
      if (kicked && selectedMember) {
        await kickMember(selectedMember, groupId);
        setMember(undefined);
        setName(undefined);
      }
    }
    kickSelected();
    if (kicked) {
      findAllGroupMembers(groupId).then((newMembers) => {
        setMembers(newMembers);
        setKicked(false);
      });
    }
  }, [kicked]);

  return (
    <div className="grid grid-cols-1 grid-rows-2 gap-5">
      {modalOpen ? (
        <ModalConfirmation
          message={`Are you sure you want to kick ${selectedMemberName}?`}
          onAccept={() => {
            setOpen(false);
            document.body.style.overflow = "unset";
            setKicked(true);
          }}
          onCancel={() => {
            setOpen(false);
            document.body.style.overflow = "unset";
            setMember(undefined);
            setName(undefined);
          }}
        />
      ) : null}
      <div>
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-4xl">Admins</h2>
          <span className="opacity-60">
            {groupMembers.filter((member) => member.rol === "lider").length}
          </span>
        </div>
        <div className="flex flex-row gap-3">
          {groupMembers.map((member, index) =>
            member.rol === "lider" ? (
              <div
                key={index}
                className="inline-flex flex-row items-center pt-3 gap-1 cursor-pointer"
                onClick={() => {
                  setMember(member.id);
                  setName(member.nombre);
                }}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <Image
                    src={/*member.user.urlImagen ||*/ "/default-user.png"}
                    alt={member.urlImagen}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-lg font-semibold">{member.nombre}</span>
                </div>
                {selectedMember &&
                selectedMember === member.id &&
                role &&
                role === "lider" ? (
                  <div className="flex flex-row items-center justify-center gap-1 rounded-sm bg-black shadow-md border border-[#545454b7] text-gray-300 text-sm p-1">
                    <i className="fa fa-trash-o pl-1 text-red-800"></i>
                    <button className="pr-1 cursor-pointer">Kick member</button>
                  </div>
                ) : null}
              </div>
            ) : null
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-4xl">Members</h2>
          <span className="opacity-60">
            {groupMembers.filter((member) => member.rol === "miembro").length}
          </span>
        </div>
        <div className="flex flex-row gap-3">
          {groupMembers.map((member, index) =>
            member.rol === "miembro" ? (
              <div
                key={index}
                className="inline-flex flex-row items-center pt-3 cursor-pointer gap-1"
                onClick={() => {
                  setMember(member.id);
                  setName(member.nombre);
                }}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <Image
                    src={/*member.user.urlImagen ||*/ "/default-user.png"}
                    alt={member.urlImagen}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-lg font-semibold">{member.nombre}</span>
                </div>
                {selectedMember &&
                selectedMember === member.id &&
                role &&
                role === "lider" ? (
                  <div
                    onClick={handleModalOpen}
                    className="flex flex-row items-center justify-center gap-1 rounded-sm bg-black shadow-md border border-[#545454b7] text-gray-300 text-sm p-1"
                  >
                    <i className="fa fa-trash-o pl-1 text-red-800"></i>
                    <span
                      className="pr-1 cursor-pointer"
                      onClick={handleModalOpen}
                    >
                      Kick member
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
