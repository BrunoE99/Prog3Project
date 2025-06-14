"use client";

import { redirect } from "next/navigation";
import Button from "./button";
import { MovieWithReviews } from "./reviewsection";
import Image from "next/image";

export default function MovieCard({
  pelicula,
  key,
}: {
  pelicula: MovieWithReviews;
  key: number;
}) {
  const clicked = () => redirect("/movie/" + pelicula.id);

  return (
    <div key={key} className="bg-[#003566] p-4 w=1/3 rounded-xl text-center">
      <h3 className="text-lg font-bold">{pelicula.nombre}</h3>
      {/* <p>{pelicula.sinopsis}</p> */}
      <Image
        src={pelicula.urlImagen}
        alt="movie image"
        width="400"
        height="400"
        style={{ width: "auto", height: "auto" }}
        className="m-auto aspect-square mt-4 rounded-xl mb-3 !w-full"
        // el ! es un parche, intentar fixear sin eso
        // buscar breakpoints devices y fixear cantidad de cards
      />
      <div className="flex justify-between">
        <span className="text-[#f5c518] text-xl m-1">
          ⭐{pelicula.calificacion}
        </span>
        <Button text="Read reviews" onClick={clicked} />
        <span className="text-white text-xl m-1">💬{pelicula.reviewCount}</span>
      </div>
    </div>
  );
}
