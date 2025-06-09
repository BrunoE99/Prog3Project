import { useCallback, useEffect, useRef, useState } from "react";
import SearchChip from "./searchChip";
import { retrieveFilteredMovies } from "@/app/movie/[id]/actions";

interface MovieComponents {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: { id: number; nombre: string };
  fechaEstreno: string;
  duracion: number;
  urlImagen: string;
  calificacion: number;
}

export default function SearchBar() {
  const [hasSearched, setSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredMovies, setMovies] = useState<MovieComponents[]>([]);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      if (searchString && searchString !== "" && hasSearched) {
        const data = await retrieveFilteredMovies(searchString);
        if (data.length > 0) {
          setMovies(data);
        } else {
          setMovies([]);
        }
      }
    }
    fetchMovies();
  }, [hasSearched]);

  interface ChangeHandlerEvent {
    target: { value: string };
  }

  const changeHandler = useCallback((event: ChangeHandlerEvent): void => {
    const value = event.target.value;
    setSearchString(value);
    if (value.length > 2) {
      setTimeout(() => {
        setSearch(true);
      }, 300);
    } else {
      setSearch(false);
    }
  }, []);

  // const debouncedChangeHandler = useMemo(
  //   () => debounce(changeHandler, 50),
  //   [changeHandler]
  // );

  return (
    <div className="relative flex flex-col justify-center items-center rounded-sm w-full max-w-md">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <input
        autoComplete="off"
        type="search"
        id="search"
        className="rounded-sm border border-[#545454b7] w-full pl-10 py-2 bg-[#041b3db8]"
        placeholder="Search..."
        onChange={changeHandler}
        value={searchString}
        onFocus={() => {
          if (blurTimeout.current) {
            clearTimeout(blurTimeout.current);
          }
        }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setSearch(false), 100);
        }}
      />
      <span className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2"></span>
      <div
        id="searchResults"
        className={`${
          hasSearched ? "flex flex-col" : "hidden"
        } absolute top-11 rounded-none bg-[#0b244a] w-full shadow-lg`}
      >
        {filteredMovies.map((movie, index) => (
          <SearchChip
            key={index}
            movie={movie}
            clearSearch={() => {
              setSearchString("");
              setSearch(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}
