"use client";

import { findAllGroups, retrieveFilteredGroups } from "./actions";
import { GroupPreviewCard } from "../../../components/groupComponents";
import { useCallback, useEffect, useState } from "react";

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
  const [hasSearched, setSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredGroups, setGroups] = useState<Group[]>([]);
  useEffect(() => {
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
      <span className="text-4xl">Browse Groups</span>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-4 justify-center items-start w-2/5">
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
            placeholder="Search groups..."
            onChange={changeHandler}
            value={searchString}
          />
        </div>
      </div>
    </div>
  );
}
