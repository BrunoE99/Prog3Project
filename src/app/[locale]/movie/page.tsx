import AllMovies from "../../../../components/allMovies";

interface PageProps {
  searchParams?: Promise<{
    filter?: string;
    order?: string;
    page?: string;
  }>;
}

export default async function CompleteMovies({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;

  const filter = awaitedSearchParams?.filter || "default";
  const order = awaitedSearchParams?.order || "asc";
  const page: number = awaitedSearchParams?.page
    ? Number(awaitedSearchParams.page) || 0
    : 0;

  return (
    <div>
      <AllMovies filter={filter} order={order} page={page} />
    </div>
  );
}
