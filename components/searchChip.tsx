import Image from "next/image";
import { redirect } from "next/navigation";

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

interface SearchChipProps {
  movie: MovieComponents;
  clearSearch: () => void;
}

export default function SearchChip({ movie, clearSearch }: SearchChipProps) {
  const release_year = movie.fechaEstreno?.split("-")[0] || "Unknown";
  return (
    <div
      className="flex flex-row gap-1 cursor-pointer"
      onClick={() => {
        clearSearch();
        redirect(`/movie/${movie.id}`);
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
        <span className="text-xs">{release_year}</span>
      </div>
    </div>
  );
}
