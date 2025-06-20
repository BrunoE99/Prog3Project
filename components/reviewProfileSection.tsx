"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { redirect } from "next/navigation";

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
  const clicked = () => redirect("/movie/" + review.peliculaId);

  return (
    <div className="grid grid-cols-3 bg-[#003566] p-4 rounded-xl text-center">
      <div className="justify-self-center">
        <Image
          src={review.pelicula.urlImagen}
          alt="movie image"
          width="500"
          height="500"
          style={{ width: "auto", height: "auto" }}
          className="m-auto aspect-square mt-4 rounded-xl mb-3 !w-full"
          // el ! es un parche, intentar fixear sin eso
          // buscar breakpoints devices y fixear cantidad de cards
        />
      </div>
      <div className="col-span-2 grid grid-rows-[auto_1fr_auto]">
        <h3 className="text-lg font-bold">{review.pelicula.nombre}</h3>
        <p>{review.texto}</p>
        <div className="grid grid-cols-3 items-end mt-2">
          <span className="text-[#f5c518] text-xl m-1">
            ⭐{review.puntuacion}
          </span>
          <button
            className="col-span-2 rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
                    shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] 
                    w-full sm:w-auto md:w-[25%] h-12 min-h-auto md:h-15 justify-self-center"
            type="button"
            onClick={clicked}
          >
            <span className="hidden sm:inline">{t("detail")}</span>
            <span className="sm:hidden">{t("short-detail")}</span>
          </button>
          {/* <span className="text-white text-xl m-1">💬125</span> */}
        </div>
      </div>
      {/* <Button text="Read reviews" onClick={clicked} /> */}
    </div>
  );
}
