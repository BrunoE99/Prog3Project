"use client";

import { editGroup } from "@/app/group/actions";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";

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

export function GroupEditHeader({
  id,
  authorized,
}: {
  id: number;
  authorized: boolean;
}) {
  return (
    <div className="flex flex-row gap-3 m-6 items-center">
      <button
        disabled={!authorized}
        className={`text-4xl font-semibold opacity-60  ${
          authorized ? "cursor-pointer hover:opacity-100" : ""
        }`}
        onClick={() => redirect(`/group/${id}`)}
      >
        &lt;
      </button>
      <h1 className="text-4xl font-semibold">Edit Group</h1>
    </div>
  );
}

export function GroupEditForm({
  group,
  authorized,
}: {
  group: Group;
  authorized: boolean;
}) {
  const [fieldsEdited, setFieldsEdited] = useState([false, false]);
  const [fields, setFields] = useState([group.nombre, group.descripcion]);
  const [state, action, pending] = useActionState(editGroup, undefined);

  return (
    <form action={action} className="m-6">
      <div className="flex flex-col gap-10 justify-center">
        <input className="hidden" name="id" id="id" defaultValue={group.id} />
        <input
          className="hidden"
          name="changedFields"
          id="changedFields"
          readOnly
          value={fieldsEdited?.toString() ?? "true,true"}
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">Name</span>
          <input
            disabled={!authorized}
            className="border border-[#545454b7] w-full mb-1 p-1"
            type="text"
            id="group-name"
            name="group-name"
            onChange={(e) => {
              setFields([e.target.value, fields[1]]);
              setFieldsEdited([true, fieldsEdited[1]]);
            }}
            value={fields[0]}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">Description</span>
          <textarea
            disabled={!authorized}
            className="w-full border border-[#545454b7] mb-1 p-1"
            name="group-description"
            id="group-description"
            onChange={(e) => {
              setFields([fields[0], e.target.value]);
              setFieldsEdited([fieldsEdited[0], true]);
            }}
            value={fields[1]}
          ></textarea>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <input
          className={`bg-blue-700 rounded-md text-xl m-5 p-1 ${
            pending || !authorized ? "" : "cursor-pointer hover:bg-blue-600"
          }`}
          type="submit"
          id="submit"
          name="submit"
          disabled={pending || !authorized}
        />
      </div>
    </form>
  );
}
