import { deleteMeeting } from "@/app/group/actions";
import Button from "./button";

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

export default function MeetingCard({
  meeting,
  onDelete,
}: {
  meeting: Reunion;
  onDelete: () => void;
}) {
  const meetingDate = meeting.fecha.split("T")[0].split("-");

  const meetingInProgress = new Date(meeting.fecha).getTime() <= Date.now();
  return (
    <div
      className={`flex flex-col justify-between items-center font-semibold rounded-md m-3 w-full gap-4`}
    >
      <span className="tex-2xl">
        {meetingInProgress
          ? "NOW"
          : `${meetingDate[2]}/${meetingDate[1]}/${meetingDate[0]}`}
      </span>
      <div className="flex flex-row gap-2">
        <Button
          text="Go to Meeting"
          onClick={() => window.location.replace(meeting.link)}
        />
        <Button
          text="Delete"
          onClick={async () => {
            await deleteMeeting();
            onDelete();
          }}
        />
      </div>
    </div>
  );
}
