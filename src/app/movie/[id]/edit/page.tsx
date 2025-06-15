import { getAuthorization } from "@/app/API/auth/actions";
import {
  MovieEditForm,
  MovieEditHeader,
} from "../../../../../components/movieEditForm";
import { getMovieById } from "../actions";
import { getAllGenres } from "@/app/API/genres/route";

export default async function MovieEdit({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const movie = await getMovieById(Number(id));
  const isAuthorized = await getAuthorization();
  const genres = await getAllGenres();

  return (
    <div className={`min-h-screen bg-[#001d3d]`}>
      <div className={isAuthorized ? "" : "blur-sm"}>
        <MovieEditHeader id={movie.id} authorized={isAuthorized} />

        <MovieEditForm
          movie={movie}
          authorized={isAuthorized}
          generos={genres}
        />
      </div>
      {isAuthorized ? null : (
        <div className="flex justify-center items-center">
          <div className="fixed justify-center items-center blur-none">
            <span className="rounded-sm text-3xl font-bold z-2">
              Sorry, you must be an admin to view this page
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
