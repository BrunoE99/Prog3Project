import { retrieveFilteredMovies } from "@/app/movie/[id]/actions";
import { useCallback, useEffect, useRef, useState } from "react";

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

interface ChangeHandlerEvent {
  target: { value: string };
}

export function MovieSelectModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: (movie: MovieComponents) => void;
  onCancel: () => void;
}) {
  const [hasSearched, setSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredMovies, setMovies] = useState<MovieComponents[]>([]);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);
  const selectedMovie = useRef<MovieComponents | undefined>(undefined);

  useEffect(() => {
    async function fetchMovies() {
      if (searchString && searchString !== "" && hasSearched) {
        const data = await retrieveFilteredMovies(searchString);
        if (data.length > 0) {
          setMovies(data);
        } else {
          setMovies([]);
        }
      }
    }
    fetchMovies();
  }, [hasSearched]);

  const changeHandler = useCallback((event: ChangeHandlerEvent): void => {
    const value = event.target.value;
    setSearchString(value);
    if (value.length > 2) {
      setTimeout(() => {
        setSearch(true);
      }, 300);
    } else {
      setSearch(false);
    }
  }, []);

  return (
    <div className="fixed">
      <div className="fixed inset-0 bg-black opacity-60 z-1"></div>
      <div className="fixed top-1/3 left-1/3 right-1/3 flex justify-center items-center rounded-lg bg-[#001d3d] shadow-lg z-2 w-auto">
        <div className="flex flex-col h-full pt-6 pb-6 gap-5 w-full items-center">
          <div>
            <span className="font-semibold text-lg text-wrap">{message}</span>
          </div>
          <div></div>
          <div className="flex flex-row justify-between items-center">
            <button
              disabled={!selectedMovie.current}
              onClick={() => onConfirm(selectedMovie.current!)}
              className={`rounded-lg shadow-md p-1 pl-2 pr-2 ${
                selectedMovie.current
                  ? "bg-gray-600 text-black"
                  : "bg-green-800 hover:bg-green-700 cursor-pointer"
              }`}
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="rounded-lg shadow-md bg-red-800 hover:bg-red-700 p-1 pl-2 pr-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
