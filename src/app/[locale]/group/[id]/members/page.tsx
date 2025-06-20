import {
  GroupMembersBody,
  GroupMembersHeader,
} from "../../../../../../components/groupMembers";
import { findAllGroupMembers, findRoleInGroup } from "../../actions";

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

export default async function Members({ params }: { params: { id: string } }) {
  const { id } = await params;
  const groupMembers: GroupMembership[] = await findAllGroupMembers(Number(id));
  const userRole = await findRoleInGroup(Number(id));

  return (
    <div className="bg-[#001d3d] min-h-screen">
      <div className="m-6">
        <GroupMembersHeader id={id} />
        <GroupMembersBody
          members={groupMembers}
          groupId={Number(id)}
          role={userRole}
        />
      </div>
    </div>
  );
}
