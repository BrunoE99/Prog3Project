"use server";

import MovieCardFull from "./movieCardComplete";
import MovieFilter from "./filter";
import Pagination from "./pagination";
import { reviewsByMovieCount } from "@/app/API/reviews/reviewsRoute";
import { getTranslations } from "next-intl/server";
import { retrieveFilteredMovies } from "@/app/[locale]/movie/[id]/actions";
import { Movie } from "./reviewsection";

interface GenresProps {
  name: string;
  filter: string;
  order: "asc" | "desc";
  page: number;
}

export default async function MoviesByName({
  name,
  filter,
  order,
  page,
}: GenresProps) {
  const t = await getTranslations("MoviesByName");
  const rating = filter === "rating" ? order : undefined;
  const alphabetic = filter === "alphabetic" ? order : undefined;

  const movies = await retrieveFilteredMovies(name, page, alphabetic, rating);

  async function moviesWithReviews() {
    return await Promise.all(
      movies.movies.map(async (pelicula: Movie) => {
        const reviewCount = await reviewsByMovieCount(pelicula.id);
        return {
          ...pelicula,
          reviewCount: typeof reviewCount === "number" ? reviewCount : 0,
        };
      })
    );
  }

  if (movies.status === 500) {
    return (
      <section className="px-6 py-10 bg-[#003566]">
        <h1 className="text-center pb-4 text-3xl font-bold">{`${t(
          "title"
        )} "${name}"`}</h1>
        <div className="mb-10 bg-[#001d3d]">
          <div>
            <MovieFilter />
          </div>
          <div className="grid grid-cols-1 gap-6 p-5">
            <p className="text-red-900">{t("error-msg")}</p>
          </div>
          <div>
            <Pagination currentPage={page} hasMovies={false} />
          </div>
        </div>
      </section>
    );
  }

  if (movies.status !== 200) {
    return (
      <section className="px-6 py-10 bg-[#003566]">
        <h1 className="text-center pb-4 text-3xl font-bold">{`${t(
          "title"
        )} "${name}"`}</h1>
        <div className="mb-10 bg-[#001d3d]">
          <div>
            <MovieFilter />
          </div>
          <div className="grid grid-cols-1 gap-6 p-5">
            <h1 className="text-red-900 text-center text-2xl">
              {movies.message}
            </h1>
          </div>
          <div>
            <Pagination currentPage={page} hasMovies={false} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 bg-[#003566]">
      <h1 className="text-center pb-4 text-3xl font-bold">{`${t(
        "title"
      )} "${name}"`}</h1>
      <div className="mb-10 bg-[#001d3d]">
        <div>
          <MovieFilter />
        </div>
        <h2 className="text-2xl font-semibold mb-4 p-5"></h2>
        <div className="grid grid-cols-1 gap-6 p-5">
          {(await moviesWithReviews()).map((pelicula, index: number) => (
            <MovieCardFull pelicula={pelicula} key={index} />
          ))}
        </div>
        <div>
          <Pagination currentPage={page} hasMovies={movies.movies.length > 0} />
        </div>
      </div>
    </section>
  );
}
