import { getMovieById } from "../actions";

export default async function MovieEdit({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const movie = await getMovieById(Number(id));

  return;
}
