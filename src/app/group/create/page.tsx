"use client";

import { useActionState, useEffect, useState } from "react";
import { createGroup } from "../actions";
import { redirect } from "next/navigation";

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

export default function GroupCreate() {
  const [descriptionGiven, setGiven] = useState(false);
  const [state, action, pending] = useActionState(createGroup, undefined);

  useEffect(() => {
    if (state && state.id) {
      redirect(`/group/${state.id}`);
    }
  });

  return (
    <div className="min-h-screen bg-[#001d3d]">
      <div className="flex flex-row gap-3 p-5">
        <button
          className="text-4xl font-semibold opacity-60 cursor-pointer hover:opacity-100"
          onClick={() => redirect("/group")}
        >
          &lt;
        </button>
        <span className="text-4xl font-semibold">Create Group</span>
      </div>
      <form action={action}>
        <div className="flex flex-col gap-6 p-5">
          <input
            className="hidden"
            name="descriptionGiven"
            id="descriptionGiven"
            readOnly
            value={descriptionGiven?.toString()}
          />
          <div className="flex flex-col items-start justify-center gap-2">
            <span className="font-semibold text-2xl">Name</span>
            <input
              className="border border-[#545454b7] w-full mb-1 p-1"
              type="text"
              id="group-name"
              name="group-name"
              required
            />
            {state?.error?.nombre ? (
              <span className="block text-red-500 justify-center items-center text-center">
                {state?.error.nombre.map((message: string) => message + " ")}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <span className="font-semibold text-2xl">Description</span>
            <textarea
              className="w-full border border-[#545454b7] mb-1 p-1"
              name="group-description"
              id="group-description"
              onChange={(e) => {
                if (e.target.value === "") {
                  setGiven(false);
                } else {
                  setGiven(true);
                }
              }}
            ></textarea>
            {state?.error?.texto ? (
              <span className="block text-red-500 justify-center items-center text-center">
                {state?.error.texto.map((message: string) => message + " ")}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col justify-end items-center">
            {typeof state?.error !== "object" ? (
              <span
                className={`${
                  state?.error ? "block" : "hidden"
                } text-red-500 justify-center items-center text-center`}
              >
                {state?.error}
              </span>
            ) : null}
            <input
              className={`bg-blue-700 rounded-md text-xl m-5 p-1 ${
                pending ? "" : "cursor-pointer hover:bg-blue-600"
              }`}
              type="submit"
              id="submit"
              name="submit"
              disabled={pending}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
