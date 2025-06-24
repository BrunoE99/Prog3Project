import { useCallback, useEffect, useRef, useState } from "react";
import SearchChip from "./searchChip";
import { retrieveFilteredMovies } from "@/app/[locale]/movie/[id]/actions";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
  const t = useTranslations("SearchBar");
  const [hasSearched, setSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredMovies, setMovies] = useState<MovieComponents[]>([]);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      if (searchString && searchString !== "" && hasSearched) {
        const data = await retrieveFilteredMovies(searchString);
        if (data.movies.length > 0) {
          setMovies(data.movies);
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

  return (
    <div className="relative flex flex-col justify-center items-center rounded-sm w-full max-w-md">
      {hasSearched ? (
        <div className="fixed inset-0 bg-black opacity-60"></div>
      ) : null}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <input
        autoComplete="off"
        type="search"
        id="search"
        className="rounded-sm border border-[#545454b7] w-full pl-10 py-2 bg-[#041b3db8]"
        placeholder={t("search-placeholder")}
        onChange={changeHandler}
        value={searchString}
        onFocus={() => {
          if (blurTimeout.current) {
            clearTimeout(blurTimeout.current);
          }
        }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => {
            setSearch(false);
            setMovies([]);
          }, 100);
        }}
      />
      <span className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2"></span>
      <div
        id="searchResults"
        className={`${
          hasSearched ? "flex flex-col" : "hidden"
        } absolute top-11 rounded-none bg-[#0b244a] w-full shadow-lg z-2 gap-1`}
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
        {filteredMovies ? (
          <Link
            href={`/results/${searchString}`}
            className="text-lg cursor-pointer hover:bg-[#041b3d]"
          >
            {`${t("view-all-msg")} "${searchString}"`}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
