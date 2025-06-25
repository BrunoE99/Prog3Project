import ByGenre from "../../../../../components/movieByGenre";

interface GenrePage {
  params: Promise<{
    genreId: string;
  }>;
  searchParams?: Promise<{
    filter?: string;
    order?: string;
    page?: string;
  }>;
}

export default async function oneGenre({ params, searchParams }: GenrePage) {
  const genreMovie = decodeURIComponent((await params).genreId);

  const awaitedSearchParams = await searchParams;

  const filter = awaitedSearchParams?.filter || "default";
  const order = awaitedSearchParams?.order || "asc";
  const page: number = awaitedSearchParams?.page
    ? Number(awaitedSearchParams.page) || 0
    : 0;

  return (
    <div>
      <ByGenre genre={genreMovie} filter={filter} order={order} page={page} />
    </div>
  );
}
