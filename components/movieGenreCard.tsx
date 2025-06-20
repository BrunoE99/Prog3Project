"use server";

import React from "react";
import Link from "next/link";
import MovieCard from "./movieCard";
import { getAllGenres } from "@/app/API/genres/route";
import { movieByGenre } from "@/app/API/movie/route";
import { reviewsByMovieCount } from "@/app/API/reviews/route";
import { getTranslations } from "next-intl/server";

interface Genre {
  id: number;
  nombre: string;
}

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

interface GenreShowcaseProps {
  className?: string;
  moviesPerGenre?: number;
}

const GenreCard: React.FC<GenreShowcaseProps> = async ({
  className = "",
  moviesPerGenre = 4,
}) => {
  const t = await getTranslations("GenreCard");
  try {
    const genres: Genre[] = await getAllGenres();

    const genreMoviesPromises = genres.map(async (genre) => {
      try {
        const movies = await movieByGenre(genre.nombre, 0);
        return {
          genre,
          movies: movies.movies.slice(0, moviesPerGenre),
        };
      } catch (error) {
        console.error(`Failed to get movies for genre ${genre.nombre}:`, error);
        return {
          genre,
          movies: [],
        };
      }
    });

    const genreMoviesData = await Promise.all(genreMoviesPromises);

    const genreMoviesWithReviews = await Promise.all(
      genreMoviesData.map(async (genreData) => {
        // For each genre, add review counts to its movies
        const moviesWithReviews = await Promise.all(
          genreData.movies.map(async (movie: Movie) => {
            const reviewCount = await reviewsByMovieCount(movie.id);
            return {
              ...movie,
              reviewCount: typeof reviewCount === "number" ? reviewCount : 0,
            };
          })
        );

        return {
          genre: genreData.genre,
          movies: moviesWithReviews,
        };
      })
    );

    return (
      <div className={`space-y-8 ${className}`}>
        <h2 className="text-3xl font-bold my-6 text-center">{t("title")}</h2>

        {genreMoviesWithReviews.map(({ genre, movies }) => (
          <div
            key={genre.id}
            className="bg-[#021f3b] rounded-lg shadow-lg p-6 mx-3"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{genre.nombre}</h3>
              <Link
                href={`/genres/${encodeURIComponent(genre.nombre)}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {t("link-start")} {genre.nombre} {t("link-end")}
              </Link>
            </div>

            {movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie: MovieWithReviews) => (
                  <MovieCard key={movie.id} pelicula={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>{t("no-movies-msg")}</p>
              </div>
            )}
          </div>
        ))}

        {genres.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">{t("no-genres-msg")}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error getting genres and movies:", error);
    return (
      <div className={`text-center text-red-600 p-8 ${className}`}>
        <p>{t("fail-msg")}</p>
      </div>
    );
  }
};

export default GenreCard;
