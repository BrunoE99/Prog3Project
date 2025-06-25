"use server";

import { getAuthorization } from "@/app/API/auth/actions";
import {
  GroupEditForm,
  GroupEditHeader,
} from "../../../../../../components/groupEditForm";
import { findGroupById, findRoleInGroup } from "../../actions";
import { getTranslations } from "next-intl/server";
import NotFoundPage from "../../../../../../components/notFoundPage";

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

export default async function GroupEdit({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTranslations("GroupEdit");
  const { id } = await params;
  const group: Group = await findGroupById(Number(id));
  const userRole = await findRoleInGroup(Number(id));
  const isAdmin = await getAuthorization();

  return (
    <div className={`min-h-screen bg-[#001d3d]`}>
      <div
        className={`${
          (userRole && userRole === "lider") || isAdmin ? "" : "blur-sm"
        }`}
      >
        {group ? (
          <>
            <GroupEditHeader
              id={group.id}
              authorized={(userRole && userRole === "lider") || isAdmin}
            />
            <GroupEditForm
              group={group}
              authorized={(userRole && userRole === "lider") || isAdmin}
            />
          </>
        ) : (
          <NotFoundPage />
        )}
      </div>
      {(userRole && userRole === "lider") || isAdmin ? null : (
        <div className="flex justify-center items-center">
          <div className="fixed justify-center items-center blur-none">
            <span className="rounded-sm text-3xl font-bold z-2">
              {t("not-auth-message")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
