import { retrieveFilteredMovies } from "@/app/movie/[id]/actions";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  const [selectedMovie, setMovie] = useState<MovieComponents | undefined>(
    undefined
  );

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
          <div className="flex flex-row items-center justify-center relative w-1/2">
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            ></link>
            {!selectedMovie ? (
              <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2"></i>
            ) : null}
            {selectedMovie ? (
              <Image
                src={selectedMovie.urlImagen}
                alt="Movie's poster"
                width={36}
                height={36}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded"
              />
            ) : null}
            <input
              autoComplete="off"
              type="search"
              id="search"
              className={`rounded-sm border border-[#545454b7] w-full bg-[#041b3db8] ${
                selectedMovie ? "pl-12 py-5" : "pl-10 py-2"
              }`}
              placeholder="Search..."
              onChange={changeHandler}
              value={searchString}
              onFocus={() => {
                if (blurTimeout.current) {
                  clearTimeout(blurTimeout.current);
                }
              }}
              onBlur={() => {
                blurTimeout.current = setTimeout(() => setSearch(false), 100);
              }}
            />

            <div
              id="searchResults"
              className={`${
                hasSearched ? "flex flex-col" : "hidden"
              } absolute top-11 rounded-none bg-[#0b244a] w-full shadow-lg`}
            >
              {filteredMovies.map((movie, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-1 cursor-pointer"
                  onClick={() => {
                    setSearchString(movie.nombre);
                    setMovie(movie);
                    setSearch(false);
                  }}
                >
                  <Image
                    src={movie.urlImagen}
                    alt="Movie's poster"
                    width={50}
                    height={50}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-lg">{movie.nombre}</span>
                    <span className="text-xs">
                      {movie.fechaEstreno?.split("-")[0] || "Unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <button
              disabled={!selectedMovie}
              onClick={() => onConfirm(selectedMovie!)}
              className={`rounded-lg shadow-md p-1 pl-2 pr-2 ${
                !selectedMovie
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
