import { movieByGenre } from "@/app/API/movies/route";
import MovieCard from "./movieCard";

export interface Movie {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: string;
  fechaEstreno: string;
  duracion: number;
  urlImagen: string;
  calificacion: number;
}

export default async function AllReviews() {
  const peliculas = await movieByGenre("Drama");

  return (
    <section className="px-6 py-10 bg-[#003566]">
      <div className="">
        <div className="mb-10 bg-[#001d3d]">
          <h2 className="text-2xl font-semibold mb-4 p-5">
            {peliculas.nombre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 lg:grid-cols-5">
            {peliculas.map((pelicula: Movie, index: number) => (
              <MovieCard pelicula={pelicula} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
