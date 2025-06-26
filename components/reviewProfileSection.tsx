"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

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
  //   gruposRelacionados: GroupMembership[];
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
  //   usuariosRelacionados: GroupMembership[];
  reviews: ReviewComponents[];
  reunionId: number;
  reunion: Reunion;
}

// interface GroupMembership {
//   id: number;
//   nombre: string;
//   urlImagen: string;
//   rol: "miembro" | "lider";
// }

// interface Comment {
//   id: number;
//   texto: string;
//   userId: number;
//   user: User;
//   reviewId: number;
//   review: ReviewComponents;
// }

interface ReviewComponents {
  id: number;
  userId: number;
  texto: string;
  puntuacion: number;
  //   user: User;
  peliculaId: number;
  pelicula: MovieComponents;
  grupo: Group | undefined;
  //   comentarios: Comment[];
}

export default function ReviewCard({ review }: { review: ReviewComponents }) {
  const t = useTranslations("ReviewCard");
  const [showFullText, setShowFullText] = useState(false);
  
  const clicked = () => redirect("/movie/" + review.peliculaId);

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const shouldShowReadMore = review.texto.length > 150;

  return (
    <div className="bg-[#003566] p-4 rounded-xl">
      <div className="flex flex-col sm:hidden gap-4 text-center">
        <div className="flex justify-center">
          <div className="relative w-56 sm:w-64 aspect-square rounded-xl">
            <Image
              src={review.pelicula.urlImagen}
              alt="movie image"
              fill
              className="rounded-xl object-cover"
              sizes="(max-width: 640px) 192px, 224px"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold">
          {review.pelicula.nombre}
        </h3>
        <div className="text-sm leading-relaxed text-left">
          <p className="mb-2">
            {showFullText ? review.texto : truncateText(review.texto)}
          </p>
          
          {shouldShowReadMore && (
            <button onClick={() => setShowFullText(!showFullText)} className="text-[#f5c518] text-xs underline hover:no-underline transition-all">
              {showFullText ? t("read-less") || "Read Less" : t("read-more") || "Read More"}
            </button>
          )}

        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#f5c518] text-xl">
            ⭐{review.puntuacion}
          </span>
          <button
            className="flex-1 rounded-xl py-2 px-3 border border-transparent text-center text-sm text-white transition-all 
                     shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                     disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] h-10"
            type="button"
            onClick={clicked}
          >
            {t("short-detail")}
          </button>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
        <div className="flex items-start justify-center">
          <div className="relative w-full max-w-[160px] md:max-w-[350px] aspect-square rounded-xl">
            <Image
              src={review.pelicula.urlImagen}
              alt="movie image"
              fill
              className="rounded-xl object-cover"
              sizes="(max-width: 768px) 140px, 160px"
            />
          </div>
        </div>
        <div className="col-span-2 grid grid-rows-[auto_1fr_auto] text-left">
          <h3 className="text-lg font-bold mb-2 text-center sm:text-left">
            {review.pelicula.nombre}
          </h3>
          <div className="text-sm leading-relaxed">
            <p className="mb-2">
              {showFullText ? review.texto : truncateText(review.texto)}
            </p>
            
            {shouldShowReadMore && (
              <button onClick={() => setShowFullText(!showFullText)} className="text-[#e3e1e1] text-xs underline hover:no-underline transition-all">
                {showFullText ? t("read-less") || "Read Less" : t("read-more") || "Read More"}
              </button>
            )}

          </div>
          <div className="grid grid-cols-3 items-end mt-3 gap-2">
            <span className="text-[#f5c518] text-xl">
              ⭐{review.puntuacion}
            </span>
            <button
              className="col-span-2 rounded-xl py-2 px-3 border border-transparent text-center text-sm text-white transition-all 
                        shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                        disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] sm:w-[80%] md:w-[60%] h-10 justify-self-center"
              type="button"
              onClick={clicked}
            >
              <span className="hidden sm:inline">{t("detail")}</span>
              <span className="sm:hidden">{t("short-detail")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}