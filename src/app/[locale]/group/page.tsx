"use client";

import { findAllGroups, retrieveFilteredGroups } from "./actions";
import { GroupPreviewCard } from "../../../../components/groupComponents";
import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getAuthToken } from "../movie/[id]/actions";
import { useTranslations } from "next-intl";

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

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  rol: string;
  fechaCreacion: Date;
  nivel: number;
  urlImagen: string;
  reviews: ReviewComponents[];
  deletedAt: Date;
  gruposRelacionados: GroupMembership[];
  comentarios: Comment[];
}

interface Reunion {
  id: number;
  fecha: string;
  link: string;
  groupoId: number;
  grupo: Group;
}

interface Group {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  usuariosRelacionados: GroupMembership[];
  reviews: ReviewComponents[];
  reunionId: number;
  reunion: Reunion;
}

interface GroupMembership {
  id: number;
  nombre: string;
  urlImagen: string;
  rol: "miembro" | "lider";
}

interface Comment {
  id: number;
  texto: string;
  userId: number;
  user: User;
  reviewId: number;
  review: ReviewComponents;
}

interface ReviewComponents {
  id: number;
  userId: number;
  texto: string;
  puntuacion: number;
  user: User;
  peliculaId: number;
  pelicula: MovieComponents;
  grupo: Group | undefined;
  comentarios: Comment[];
}

export default function AllGroups() {
  const t = useTranslations("AllGroups");
  const [hasSearched, setSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredGroups, setGroups] = useState<Group[]>([]);
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const t = await getAuthToken();
      setToken(t);
    })();
    async function fetchGroups() {
      if (searchString && searchString !== "" && hasSearched) {
        const data = await retrieveFilteredGroups(searchString);
        if (data.length > 0) {
          setGroups(data);
        } else {
          setGroups([]);
        }
      } else {
        const data = await findAllGroups();
        setGroups(data);
      }
    }
    fetchGroups();
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
    <div className="flex flex-col gap-5 bg-[#001d3d] min-h-screen p-6">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl">{t("title")}</h1>
        <button
          onClick={() => {
            if (!token) {
              redirect("/login");
            } else {
              redirect("/group/create");
            }
          }}
          className="font-semibold cursor-pointer before:content-['+'] before:mr-1 before:text-[#f5c518] before:text-xl transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
        >
          {t("create-button")}
        </button>
      </div>
      <div className="flex flex-row justify-between items-start gap-2">
        <div className="flex flex-col gap-4 justify-center items-start w-4/5 md:w-2/5">
          {filteredGroups.length > 0
            ? filteredGroups.map((group, index) => (
                <GroupPreviewCard key={index} {...group} />
              ))
            : null}
        </div>
        <div className="relative flex flex-row justify-start items-center rounded-sm">
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          ></link>
          <span className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2"></span>
          <input
            autoComplete="off"
            type="search"
            id="search"
            className="rounded-sm border border-[#545454b7] w-full pl-10 py-2 bg-[#041b3db8]"
            placeholder={t("search-placeholder")}
            onChange={changeHandler}
            value={searchString}
          />
        </div>
      </div>
    </div>
  );
}
