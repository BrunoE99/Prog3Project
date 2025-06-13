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
  findAllGroupReviews,
  findGroupById,
  findGroupMemberCount,
  findMeeting,
  findRoleInGroup,
} from "../actions";

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

export default async function Group({ params }: { params: { id: string } }) {
  const { id } = await params;
  const group: Group = await findGroupById(Number(id));
  const groupMembers = await findAllGroupMembers(Number(id));
  const groupMemberCount: { cantidad: number } = await findGroupMemberCount(
    Number(id)
  );
  const userRole = await findRoleInGroup(Number(id));
  const meeting = userRole ? await findMeeting() : undefined;
  const reviews = await findAllGroupReviews(Number(id));

  return (
    <div className="min-h-screen bg-[#001d3d] w-full overflow-x-hidden">
      {group ? (
        <div>
          <GroupHeader {...group} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 divide-x-1 divide-[#65686c] md:divide-x-0">
            <GroupMeetingColumn
              meeting={meeting && meeting.statusCode ? undefined : meeting}
              role={userRole}
            />
            <GroupReviews reviews={reviews} userRole={userRole} />
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
