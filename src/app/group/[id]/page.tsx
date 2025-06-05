"use server";

import {
  GroupHeader,
  GroupMeetingColumn,
  GroupMembersPreview,
  GroupReviews,
} from "../../../../components/groupComponents";
import NotFoundPage from "../../../../components/notFoundPage";
import {
  findAllGroupMembers,
  findGroupById,
  findGroupMemberCount,
} from "../actions";

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

export default async function Group({ params }: { params: { id: string } }) {
  const { id } = await params;
  const group: Group = await findGroupById(Number(id));
  const groupMembers = await findAllGroupMembers(Number(id));
  const groupMemberCount: number = await findGroupMemberCount(Number(id));
  console.log(groupMembers);
  return (
    <div className="min-h-screen bg-[#001d3d]">
      {group ? (
        <div>
          <GroupHeader {...group} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 divide-x-1 divide-[#65686c] h-full">
            <GroupMeetingColumn {...group.reunion} />
            <GroupReviews reviews={group.reviews} />
            <GroupMembersPreview
              members={groupMembers}
              memberCount={groupMemberCount}
            />
          </div>
        </div>
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
}
