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

export default function SearchChip(movie: MovieComponents) {
  const release_year = movie.fechaEstreno?.split("-")[0] || "Unknown";
  return (
    <div className="flex flex-row">
      <Image
        src={movie.urlImagen}
        alt="Movie's poster"
        width={50}
        height={50}
      />
      <div className="flex flex-col">
        <span>{movie.nombre}</span>
        <span>{release_year}</span>
      </div>
    </div>
  );
}
