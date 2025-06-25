import MoviesByName from "../../../../../components/moviesByName";

export default async function AllSearchResults({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams?: Promise<{
    filter?: string;
    order?: "asc" | "desc";
    page?: string;
  }>;
}) {
  const name = decodeURIComponent((await params).name);
  const awaitedSearchParams = await searchParams;
  const filter = awaitedSearchParams?.filter || "default";
  const order = awaitedSearchParams?.order || "asc";
  const page: number = awaitedSearchParams?.page
    ? Number(awaitedSearchParams.page) || 0
    : 0;

  return (
    <div>
      <MoviesByName name={name} filter={filter} order={order} page={page} />
    </div>
  );
}
