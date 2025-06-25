import { movieByGenre } from "@/app/API/movie/movieRoute";
import MovieCardFull from "./movieCardComplete";
import { getAllGenres } from "@/app/API/genres/genreRoute";
import { MovieWithReviews } from "./reviewsection";

export interface Movie {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: number;
  fechaEstreno: string;
  duracion: number;
  urlImagen: any;
  calificacion: number;
}

export default async function AllGenre() {
  const generos = await getAllGenres();
  const peliculas = await movieByGenre("Romance", 0, "desc");

  return (
    <section className="px-6 py-10 bg-[#003566]">
      <h1 className="text-center pb-3 text-2xl">All movies</h1>
      <div className="mb-10 bg-[#001d3d]">
        <h2 className="text-2xl font-semibold mb-4 p-5">
          {peliculas.movies.nombre}
        </h2>
        <div className="grid grid-cols-1 gap-6 p-5">
          {peliculas.movies.map((pelicula: MovieWithReviews, index: number) => (
            <MovieCardFull pelicula={pelicula} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
