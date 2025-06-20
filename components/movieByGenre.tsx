"use server";

import { movieByGenre } from "@/app/API/movie/route";
import MovieCardFull from "./movieCardComplete";
import MovieFilter from "./filter";
import Pagination from "./pagination";
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

interface GenresProps {
  genre: string;
  filter: string;
  order: string;
  page: number;
}

export default async function ByGenre({
  genre,
  filter,
  order,
  page,
}: GenresProps) {
  const t = await getTranslations("ByGenre");
  const rating = filter === "rating" ? order : null;
  const alphabetic = filter === "alphabetic" ? order : null;

  const peliculas = await movieByGenre(genre, page, rating, alphabetic);

  const moviesWithReviews: MovieWithReviews[] = await Promise.all(
    peliculas.movies.map(async (pelicula: Movie) => {
      const reviewCount = await reviewsByMovieCount(pelicula.id);
      return {
        ...pelicula,
        reviewCount: typeof reviewCount === "number" ? reviewCount : 0,
      };
    })
  );

  if (peliculas.status === 500) {
    return (
      <section className="px-6 py-10 bg-[#003566]">
        <h1 className="text-center pb-4 text-3xl font-bold">
          {t("title")} {genre}
        </h1>
        <div className="mb-10 bg-[#001d3d]">
          <div>
            <MovieFilter />
          </div>
          <div className="grid grid-cols-1 gap-6 p-5">
            <p className="text-red-900">{t("error-msg")}</p>
          </div>
          <div>
            <Pagination
              currentPage={page}
              hasMovies={peliculas?.hasMovies ?? false}
            />
          </div>
        </div>
      </section>
    );
  }

  if (peliculas.status === 400) {
    return (
      <section className="px-6 py-10 bg-[#003566]">
        <h1 className="text-center pb-4 text-3xl font-bold">
          {t("title")} {genre}
        </h1>
        <div className="mb-10 bg-[#001d3d]">
          <div>
            <MovieFilter />
          </div>
          <div className="grid grid-cols-1 gap-6 p-5">
            <h1 className="text-red-900 text-center text-2xl">
              {peliculas.message}
            </h1>
          </div>
          <div>
            <Pagination
              currentPage={page}
              hasMovies={peliculas?.hasMovies ?? false}
            />
          </div>
        </div>
      </section>
    );
  }

  if (peliculas.status === 404) {
    return (
      <section className="px-6 py-10 bg-[#003566]">
        <h1 className="text-center pb-4 text-3xl font-bold">
          {t("title")} {genre}
        </h1>
        <div className="mb-10 bg-[#001d3d]">
          <div>
            <MovieFilter />
          </div>
          <div className="grid grid-cols-1 gap-6 p-5">
            <h1 className="text-red-900 text-center text-2xl">
              {peliculas.message}
            </h1>
          </div>
          <div>
            <Pagination
              currentPage={page}
              hasMovies={peliculas?.hasMovies ?? false}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 bg-[#003566]">
      <h1 className="text-center pb-4 text-3xl font-bold">
        {t("title")} {genre}
      </h1>
      <div className="mb-10 bg-[#001d3d]">
        <div>
          <MovieFilter />
        </div>
        <h2 className="text-2xl font-semibold mb-4 p-5">
          {peliculas.movies.nombre}
        </h2>
        <div className="grid grid-cols-1 gap-6 p-5">
          {moviesWithReviews.map(
            (pelicula: MovieWithReviews, index: number) => (
              <MovieCardFull pelicula={pelicula} key={index} />
            )
          )}
        </div>
        <div>
          <Pagination
            currentPage={page}
            hasMovies={peliculas?.hasMovies ?? false}
          />
        </div>
      </div>
    </section>
  );
}
