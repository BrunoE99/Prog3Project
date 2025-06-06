import { redirect } from "next/navigation";

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

export default function MeetingCard(meeting: Reunion) {
  const meetingDate = meeting.fecha.split("T")[0].split("-");
  const meetingInProgress = new Date(meeting.fecha).getTime() <= Date.now();
  return (
    <div
      className={`font-semibold rounded-md cursor-pointer m-3 ${
        meetingInProgress ? "bg-red-600" : "bg-[#003566]"
      }`}
      onClick={() => redirect(meeting.link)}
    >
      <span>
        {meetingInProgress
          ? "NOW"
          : `${meetingDate[2]}/${meetingDate[1]}/${meetingDate[0]}`}
      </span>
    </div>
  );
}
