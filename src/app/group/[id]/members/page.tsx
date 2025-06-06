import { findAllGroupMembers } from "../../actions";
import Image from "next/image";

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
  nombre: string;
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
  console.log(groupMembers);
  const groupMemberCount = await findAllGroupMembers(Number(id));

  return (
    <div className="bg-[#001d3d] min-h-screen">
      <div className="m-6">
        <div className="flex flex-row gap-3">
          <span className="text-xl opacity-60 hover:opacity-100">&larr;</span>
          <h1 className="text-2xl font-semibold">Members</h1>
          <span className="opacity-60">{groupMemberCount.cantidad}</span>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-5">
          <div>
            <h2 className="text-4xl">Admins</h2>
            {groupMembers.map((member, index) =>
              member.rol === "lider" ? (
                <div
                  key={index}
                  className="inline-flex flex-row items-center gap-2 pt-3"
                >
                  <Image
                    src={/*member.user.urlImagen ||*/ "/default-user.png"}
                    alt={member.nombre}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-lg font-semibold">{member.nombre}</span>
                </div>
              ) : null
            )}
          </div>
          <div>
            <h2 className="text-4xl">Members</h2>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
