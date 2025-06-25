"use server";

import { getAuthorization } from "@/app/API/auth/actions";

import { getMovieById } from "../actions";
import { getAllGenres } from "@/app/API/genres/route";
import {
  MovieEditForm,
  MovieEditHeader,
} from "../../../../../../components/movieEditForm";
import { getTranslations } from "next-intl/server";
import NotFoundPage from "../../../../../../components/notFoundPage";

export default async function MovieEdit({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTranslations("MovieEdit");
  const { id } = await params;
  const movie = await getMovieById(Number(id));
  const isAuthorized = await getAuthorization();
  const genres = await getAllGenres();

  return (
    <div className={`min-h-screen bg-[#001d3d]`}>
      <div className={isAuthorized ? "" : "blur-sm relative"}>
        {movie ? (
          <>
            <MovieEditHeader id={movie.id} authorized={isAuthorized} />
            <MovieEditForm
              movie={movie}
              authorized={isAuthorized}
              generos={genres}
            />
          </>
        ) : (
          <NotFoundPage />
        )}
      </div>
      {isAuthorized ? null : (
        <div className="inset-0 flex justify-center items-center absolute pointer-events-none">
          <span className="rounded-sm text-3xl font-bold px-4 py-2">
            {t("not-auth-message")}
          </span>
        </div>
      )}
    </div>
  );
}
