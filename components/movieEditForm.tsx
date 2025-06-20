"use client";

import { editMovie } from "@/app/[locale]/movie/[id]/actions";
import { useTranslations } from "next-intl";
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
  id: number;
  authorized: boolean;
}) {
  const t = useTranslations("MovieEditHeader");
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
      <h1 className="text-4xl font-semibold">{t("title")}</h1>
    </div>
  );
}

export function MovieEditForm({
  movie,
  authorized,
  generos,
}: {
  movie: MovieComponents;
  authorized: boolean;
  generos: Genero[];
}) {
  const t = useTranslations("MovieEditForm");
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
    duracion: String(movie.duracion),
    calificacion: String(movie.calificacion),
  });
  const [genreTyped, setTyped] = useState(false);
  const [selectedGenre, setGenre] = useState(movie.genero.nombre);
  const [hours, setHours] = useState(Math.floor(movie.duracion / 60));
  const [minutes, setMinutes] = useState(movie.duracion % 60);
  const [state, action, pending] = useActionState(editMovie, undefined);
  function doesGenreExist(genreName: string) {
    const nombres = generos.map((genero) => genero.nombre);
    return nombres.includes(genreName);
  }

  return (
    <form action={action} className="m-6">
      <div className="flex flex-col gap-10 justify-center">
        <input className="hidden" name="id" id="id" defaultValue={movie.id} />
        <input
          className="hidden"
          name="changedFields"
          id="changedFields"
          readOnly
          value={JSON.stringify(fieldsEdited)}
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">{t("name-label")}</span>
          <input
            autoComplete="false"
            disabled={!authorized}
            className="border border-[#545454b7] w-full mb-1 p-1 bg-[#899fff]/20"
            type="text"
            id="movie-name"
            name="movie-name"
            onChange={(e) => {
              setFields({ ...fields, nombre: e.target.value });
              setFieldsEdited({ ...fieldsEdited, nombre: true });
            }}
            value={fields.nombre}
          />
          {state?.error?.nombre ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.nombre.map((message: string) => message + " ")}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">{t("synopsis-label")}</span>
          <textarea
            autoComplete="false"
            disabled={!authorized}
            className="w-full border border-[#545454b7] mb-1 p-1 bg-[#899fff]/20"
            name="movie-synopsis"
            id="movie-synopsis"
            onChange={(e) => {
              setFields({ ...fields, sinopsis: e.target.value });
              setFieldsEdited({ ...fieldsEdited, sinopsis: true });
            }}
            value={fields.sinopsis}
          ></textarea>
          {state?.error?.sinopsis ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.sinopsis.map((message: string) => message + " ")}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-start justify-center gap-3">
          <div className="flex flex-col justify-center items-start gap-4">
            <span className="font-semibold text-2xl">{t("genre-select")}</span>
            <div className="w-full flex flex-row gap-3">
              <select
                className="[&>option]:text-black rounded-sm transition-colors delay-75 duration-200 ease-in-out hover:bg-[#899fff]/20 [&>option]:bg-white w-full"
                value={selectedGenre}
                onChange={(e) => {
                  setFields({ ...fields, genero: e.target.value });
                  setFieldsEdited({ ...fieldsEdited, genero: true });
                  setGenre(e.target.value);
                  setTyped(false);
                }}
              >
                {generos.map((genero, index) => (
                  <option value={genero.nombre} key={index}>
                    {genero.nombre}
                  </option>
                ))}
              </select>
              {genreTyped ? (
                <span className="xl:text-nowrap text-[#f39c11]">
                  {t("genre-warning")}
                </span>
              ) : null}
            </div>
          </div>
          <span className="font-light text-lg">{t("genre-separator")}</span>
          <span className="font-semibold text-2xl">{t("new-genre")}</span>
          <input
            autoComplete="false"
            disabled={!authorized}
            className="border border-[#545454b7] w-full mb-1 p-1 bg-[#899fff]/20"
            type="text"
            id="movie-genre"
            name="movie-genre"
            onChange={(e) => {
              const val = e.target.value;
              setFields({
                ...fields,
                genero: val.charAt(0).toUpperCase() + val.slice(1),
              });
              setFieldsEdited({ ...fieldsEdited, genero: true });
              if (doesGenreExist(val)) setGenre(val);
              setTyped(true);
            }}
            value={fields.genero}
          />
          {state?.error?.genero ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.genero.map((message: string) => message + " ")}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">{t("date-label")}</span>
          <input
            autoComplete="false"
            disabled={!authorized}
            className="border border-[#545454b7] w-full mb-1 p-1 bg-[#899fff]/20"
            type="date"
            id="estreno"
            name="estreno"
            onChange={(e) => {
              setFields({ ...fields, fechaEstreno: e.target.value });
              setFieldsEdited({ ...fieldsEdited, fechaEstreno: true });
            }}
            value={fields.fechaEstreno}
          />
          {state?.error?.fechaEstreno ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.fechaEstreno.map(
                (message: string) => message + " "
              )}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">{t("length-label")}</span>
          <div className="flex flex-row w-full gap-3">
            <div className="flex flex-row items-center gap-1">
              <input
                autoComplete="false"
                disabled={!authorized}
                className="border border-[#545454b7] w-auto mb-1 p-1 bg-[#899fff]/20"
                type="number"
                id="hours"
                name="hours"
                onChange={(e) => {
                  setHours(Number(e.target.value));
                  setFields({
                    ...fields,
                    duracion: String(hours * 60 + minutes),
                  });
                  setFieldsEdited({ ...fieldsEdited, duracion: true });
                }}
                value={hours}
              />
              <span>h</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <input
                autoComplete="false"
                disabled={!authorized}
                className="border border-[#545454b7] w-auto mb-1 p-1 bg-[#899fff]/20"
                type="number"
                id="minutes"
                name="minutes"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMinutes(0);
                    setFields({
                      ...fields,
                      duracion: String(hours * 60 + minutes),
                    });
                    setFieldsEdited({ ...fieldsEdited, duracion: true });
                  } else if (Number(e.target.value) < 60) {
                    setMinutes(Number(e.target.value));
                    setFields({
                      ...fields,
                      duracion: String(hours * 60 + minutes),
                    });
                    setFieldsEdited({ ...fieldsEdited, duracion: true });
                  }
                }}
                value={minutes}
              />
              <span>m</span>
            </div>
          </div>
          {state?.error?.duracion ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.duracion.map((message: string) => message + " ")}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="font-semibold text-2xl">{t("score-label")}</span>
          <input
            disabled={!authorized}
            className="border border-[#545454b7] w-full mb-1 p-1 bg-[#899fff]/20"
            type="number"
            id="calificacion"
            name="calificacion"
            onChange={(e) => {
              setFields({ ...fields, calificacion: e.target.value });
              setFieldsEdited({ ...fieldsEdited, calificacion: true });
            }}
            value={fields.calificacion}
            autoComplete="false"
          />
          {state?.error?.calificacion ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.calificacion.map(
                (message: string) => message + " "
              )}
            </span>
          ) : null}
        </div>
        <div className="flex flex-row justify-end items-center">
          {typeof state?.error !== "object" ? (
            <span
              className={`${
                state?.error ? "block" : "hidden"
              } text-red-500 justify-center items-center text-center`}
            >
              {state?.error}
            </span>
          ) : null}
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
      </div>
    </form>
  );
}
