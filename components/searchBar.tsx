import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchChip from "./searchChip";
import { retrieveAllMovies } from "@/app/movie/[id]/actions";

interface MovieComponents {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: string;
  fechaEstreno: string;
  duracion: number;
  urlImagen: string;
  calificacion: number;
}

export default function SearchBar() {
  const [hasSearched, setSearch] = useState(false);
  const [searchString, setSearchString] = useState<string>("");
  const [movies, setMovies] = useState<MovieComponents[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const data = await retrieveAllMovies();
      setMovies(data!);
    }
    fetchMovies();
  }, []);

  let filteredMovies = movies;

  if (searchString && searchString !== "") {
    console.log(searchString);
    filteredMovies = movies.filter((movie) => {
      return movie.nombre.toLowerCase().includes(searchString.toLowerCase());
    });
  }

  interface ChangeHandlerEvent {
    target: { value: string };
  }

  const changeHandler = useCallback((event: ChangeHandlerEvent): void => {
    setSearchString(event.target.value);
    if (event.target.value !== "") {
      setSearch(true);
    } else {
      setSearch(false);
    }
  }, []);

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    [changeHandler]
  );

  return (
    <div className="relative flex flex-col justify-center items-center rounded-full w-full max-w-md">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <input
        type="search"
        id="search"
        className="rounded-full border border-[#545454b7] w-full pl-10 py-2 bg-[#041b3db8]"
        placeholder="Search..."
        onChange={debouncedChangeHandler}
        defaultValue=""
      />
      <span className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2"></span>
      <div
        id="searchResults"
        className={`${
          hasSearched ? "flex flex-col" : "hidden"
        } absolute top-5 rounded-none bg-[#000814] w-full shadow-lg ${
          movies ? "border border-[#545454b7]" : "border-none"
        }`}
      >
        {filteredMovies.map((movie, index) => (
          <SearchChip key={index} {...movie} />
        ))}
      </div>
    </div>
  );
}
