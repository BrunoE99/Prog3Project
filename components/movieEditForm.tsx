"use client";

import { editMovie } from "@/app/movie/[id]/actions";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";

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

interface Genero {
  id: number;
  nombre: string;
}

export function MovieEditHeader({
  id,
  authorized,
}: {
  id: string;
  authorized: boolean;
}) {
  return (
    <div className="flex flex-row gap-3 m-6 items-center">
      <button
        disabled={!authorized}
        className={`text-4xl font-semibold opacity-60  ${
          authorized ? "cursor-pointer hover:opacity-100" : ""
        }`}
        onClick={() => redirect(`/movie/${id}`)}
      >
        &lt;
      </button>
      <h1 className="text-4xl font-semibold">Edit Movie</h1>
    </div>
  );
}

export function MovieEditForm({
  movie,
  authorized,
}: {
  movie: MovieComponents;
  authorized: boolean;
}) {
  const [fieldsEdited, setFieldsEdited] = useState({
    nombre: false,
    sinopsis: false,
    genero: false,
    fechaEstreno: false,
    duracion: false,
    calificacion: false,
  });
  const [fields, setFields] = useState({
    nombre: movie.nombre,
    sinopsis: movie.sinopsis,
    genero: movie.genero.nombre,
    fechaEstreno: movie.fechaEstreno,
    duracion: movie.duracion,
    calificacion: movie.calificacion,
  });
  const [state, action, pending] = useActionState(editMovie, undefined);

  return (
    <form action={action} className="m-6">
      <div className="flex flex-col gap-10 justify-center">
        <input className="hidden" name="id" id="id" defaultValue={movie.id} />
        <input
          className="hidden"
          name="changedFields"
          id="changedFields"
          readOnly
          value={fieldsEdited?.toString()}
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">Name</span>
          <input
            disabled={!authorized}
            className="border border-[#545454b7] w-full mb-1 p-1"
            type="text"
            id="movie-name"
            name="movie-name"
            onChange={(e) => {
              const newFields = fields;
              newFields.nombre = e.target.value;
              setFields(newFields);
              const newEdited = fieldsEdited;
              newEdited.nombre = true;
              setFieldsEdited(newEdited);
            }}
            value={fields.nombre}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">Synopsis</span>
          <textarea
            disabled={!authorized}
            className="w-full border border-[#545454b7] mb-1 p-1"
            name="movie-synopsis"
            id="movie-synopsis"
            onChange={(e) => {
              const newFields = fields;
              newFields.sinopsis = e.target.value;
              setFields(newFields);
              const newEdited = fieldsEdited;
              newEdited.sinopsis = true;
              setFieldsEdited(newEdited);
            }}
            value={fields.sinopsis}
          ></textarea>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <input
          className={`bg-blue-700 rounded-md text-xl m-5 p-1 ${
            pending || !authorized ? "" : "cursor-pointer hover:bg-blue-600"
          }`}
          type="submit"
          id="submit"
          name="submit"
          disabled={pending || !authorized}
        />
      </div>
    </form>
  );
}
