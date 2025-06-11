import { eraseComment } from "@/app/API/comment/actions";
import { useEffect, useState } from "react";

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
  authorized,
}: {
  comment: Comment;
  onDelete: () => void;
  authorized: boolean;
}) {
  const [deleteOpen, setOpen] = useState(false);
  const [deleteClicked, setClicked] = useState(false);
  useEffect(() => {
    async function deleteThis() {
      if (deleteClicked) {
        await eraseComment(comment.id);
        onDelete();
      }
    }
    deleteThis();
  }, [deleteClicked]);

  return (
    <div className="flex flex-col bg-[#001d3d] justify-start items-center">
      <div className="flex flex-row justify-between items-center">
        <span className="text-2xl">{comment.user.username}</span>
        {authorized ? (
          <div className="flex flex-row justify-end items-center">
            {deleteOpen && authorized ? (
              <div
                className="flex flex-row items-center justify-center gap-1 rounded-sm bg-black shadow-md border border-[#545454b7] text-gray-300 text-sm p-1"
                onClick={() => {
                  setClicked(true);
                  onDelete();
                }}
              >
                <i className="fa fa-trash-o pl-1 text-red-800"></i>
                <button className="pr-1 cursor-pointer">Delete</button>
              </div>
            ) : null}
            <div
              className="inline-block cursor-pointer"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            >
              <div className="bg-white h-0.5 w-0.5 rounded-full mt-1"></div>
              <div className="bg-white h-0.5 w-0.5 rounded-full mt-1"></div>
              <div className="bg-white h-0.5 w-0.5 rounded-full mt-1"></div>
            </div>
          </div>
        ) : null}
      </div>
      <p className="text-lg">{comment.texto}</p>
    </div>
  );
}
