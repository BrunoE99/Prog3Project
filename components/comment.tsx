import { useState } from "react";

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

export default function Comment({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: () => void;
}) {
  const [deleteOpen, setOpen] = useState(false);
  return (
    <div className="flex flex-col bg-[#001d3d] justify-start items-center">
      <div className="flex flex-row justify-between items-center">
        <span>{comment.user.username}</span>
        <div className="inline-block cursor-pointer">
          <button>Delete</button>
          <div className="bg-white h-0.5 w-0.5 rounded-full mt-1"></div>
          <div className="bg-white h-0.5 w-0.5 rounded-full mt-1"></div>
          <div className="bg-white h-0.5 w-0.5 rounded-full mt-1"></div>
        </div>
      </div>
      <p>{comment.texto}</p>
    </div>
  );
}
