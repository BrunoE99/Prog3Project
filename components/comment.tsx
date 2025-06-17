import { useState } from "react";
import Image from "next/image";
import { ModalConfirmation } from "./modalConfirmation";
import { redirect } from "next/navigation";
import { eraseComment } from "@/app/reviews/actions";

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
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    if (authorized) {
      setModalOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      redirect("/login");
    }
  };
  const handleDelete = () => {
    eraseComment(comment.id);
    onDelete();
  };

  return (
    <div className="flex flex-col bg-[#001d3d] rounded-sm">
      {modalOpen ? (
        <ModalConfirmation
          message={`Are you sure you want to delete this comment?`}
          onAccept={() => {
            handleDelete();
            setModalOpen(false);
            document.body.style.overflow = "unset";
          }}
          onCancel={() => {
            setOpen(false);
            setModalOpen(false);
            document.body.style.overflow = "unset";
          }}
        />
      ) : null}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col w-full p-1.5">
          <div className="flex flex-row gap-3 items-center justify-start">
            <Image
              src={`http://localhost:3000${comment.user.urlImagen}`}
              alt="Commenter's Profile Picture"
              width={25}
              height={25}
              className="rounded-full"
            />
            <span className="text-xl font-semibold">
              {comment.user.username}
            </span>
          </div>
          <p className="text-xs p-2 pl-0 lg:pl-15 w-3/4 wrap-balanced md:text-base">
            {comment.texto}
          </p>
        </div>
        {authorized ? (
          <div className="flex flex-row items-center gap-2">
            {deleteOpen && authorized ? (
              <div
                className="flex flex-row items-center justify-center gap-1 rounded-sm bg-[#eeeeee] shadow-md text-[#000814] text-sm p-1.5 hover:bg-[#cccccc] cursor-pointer transition-colors delay-75 duration-200 ease-in-out"
                onClick={handleModalOpen}
              >
                <i className="fa fa-trash-o pl-1 text-orange-500"></i>
                <button className="pr-1 cursor-pointer">Delete</button>
              </div>
            ) : null}
            <div
              className="inline-block cursor-pointer pr-3 opacity-100 hover:opacity-60"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            >
              <div className="bg-white h-1 w-1 rounded-full mt-1"></div>
              <div className="bg-white h-1 w-1 rounded-full mt-1"></div>
              <div className="bg-white h-1 w-1 rounded-full mt-1"></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
