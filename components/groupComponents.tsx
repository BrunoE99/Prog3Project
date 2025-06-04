"use client";

import { redirect } from "next/navigation";
import MovieReview from "./genericreview";

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
  fecha: Date;
  link: string;
  groupoId: number;
  grupo: Group;
}

interface Group {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: Date;
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

export function GroupReviews({ reviews }: { reviews: ReviewComponents[] }) {
  return (
    <div>
      <div>
        {reviews.map((review, index) => (
          <MovieReview key={index} {...review} />
        ))}
      </div>
    </div>
  );
}
