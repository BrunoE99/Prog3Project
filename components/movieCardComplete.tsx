"use client";

import { redirect } from "next/navigation";
import { Movie, MovieWithReviews } from "./reviewsection";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MovieCardFull({
  pelicula,
  key,
}: {
  pelicula: MovieWithReviews;
  key: number;
}) {
  const t = useTranslations("MovieCardFull");
  const clicked = () => redirect("/movie/" + pelicula.id);

  return (
    <div key={key} className="bg-[#003566] p-4 rounded-xl text-center">
      <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
        <div className="flex justify-center md:justify-self-center">
          <Image
            src={pelicula.urlImagen}
            alt="movie image"
            width="500"
            height="500"
            style={{ width: "auto", height: "auto" }}
            className="aspect-square rounded-xl !w-full max-w-[80%] md:max-w-none md:!w-full"
            // el ! es un parche, intentar fixear sin eso
          />
        </div>
        <div className="flex flex-col md:col-span-2 md:grid md:grid-rows-3 gap-3 md:gap-0">
          <h3 className="text-lg font-bold text-left md:text-center">
            {pelicula.nombre}
          </h3>
          <p className="text-left md:text-center text-sm md:text-base overflow-hidden">
            {pelicula.sinopsis}
          </p>
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex justify-between items-center">
              <span className="text-[#f5c518] text-xl">
                ⭐{pelicula.calificacion}
              </span>
              <span className="text-white text-xl">
                💬{pelicula.reviewCount}
              </span>
            </div>
            <button
              className="rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
                        shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                        disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] 
                        h-12 w-full"
              type="button"
              onClick={clicked}
            >
            {t("short-detail")}
            </button>
          </div>
          <div className="hidden md:flex justify-between items-end">
            <span className="text-[#f5c518] text-xl m-1">
              ⭐{pelicula.calificacion}
            </span>
              <button
                className="rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
                          shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                          disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] 
                          w-auto h-12"
                type="button"
                onClick={clicked}
              >
                {t("detail")}
              </button>
              <span className="text-white text-xl m-1">
                💬{pelicula.reviewCount}
              </span>
          </div>
        </div>

      </div>
    </div>
  );
}
