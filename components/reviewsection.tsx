"use server";

import { getAllMovies } from "@/app/API/movie/route";
import MovieCard from "./movieCard";
import { reviewsByMovieCount } from "@/app/API/reviews/route";
import { getTranslations } from "next-intl/server";

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

export interface MovieWithReviews extends Movie {
  reviewCount: number;
}

export default async function AllReviews() {
  const t = await getTranslations("AllReviews");
  const rating = "desc";
  const alphabetic = "";
  const peliculas = await getAllMovies(0, rating);

  const moviesWithReviews: MovieWithReviews[] = await Promise.all(
    peliculas.movies.map(async (pelicula: Movie) => {
      const reviewCount = await reviewsByMovieCount(pelicula.id);
      return {
        ...pelicula,
        reviewCount: typeof reviewCount === "number" ? reviewCount : 0,
      };
    })
  );

  return (
    <section className="px-6 py-10 bg-[#003566]">
      <div>
        <div className="mb-10 bg-[#001d3d]">
          <h1 className="text-2xl font-bold text-center pt-3">{t("title")}</h1>
          <h2 className="text-2xl font-semibold mb-4 p-5">
            {peliculas.movies.nombre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 lg:grid-cols-5">
            {moviesWithReviews.map(
              (pelicula: MovieWithReviews, index: number) => (
                <MovieCard pelicula={pelicula} key={index} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
