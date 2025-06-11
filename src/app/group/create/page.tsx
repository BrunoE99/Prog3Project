"use client";

import { useActionState, useState } from "react";
import { createGroup } from "../actions";

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
  const [name, setName] = useState<string | undefined>(undefined);
  const [state, action, pending] = useActionState(createGroup, undefined);

  return (
    <form action={action} className="min-h-screen bg-[#001d3d]">
      <div className="flex flex-col gap-5 p-5">
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
            onChange={(e) => setName(e.target.value)}
          />
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
        </div>
        <div className="flex justify-end items-center">
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
  );
}
