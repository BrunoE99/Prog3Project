import GenreCard from "../../../../components/movieGenreCard";

export default async function AllGenres() {
  return (
    <div>
      <GenreCard moviesPerGenre={4} />
    </div>
  );
}
