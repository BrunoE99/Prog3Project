"use client";

import { useState } from "react";
import MovieReview from "./genericreview";
import CreateReview from "./createreview";

interface MovieComponents {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: string;
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
  role: string;
  date: Date;
  level: number;
  urlImagen: string;
  reviews: ReviewComponents[];
  deletedAt: Date;
  relatedGroups: GroupMembership[];
  comments: Comment[];
}

interface Group {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  relatedUsers: GroupMembership[];
  reviews: ReviewComponents[];
}

interface GroupMembership {
  id: number;
  user: User;
  group: Group;
  role: string;
}

interface Comment {
  id: number;
  content: string;
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

export function ShortenedMovieInfo({ movie }: { movie: MovieComponents }) {
  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-2 m-2 p-5 w-full mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img
          className="rounded-sm"
          src={movie.urlImagen}
          alt="Movie's Poster"
        />
        <span className="text-4xl m-5 p-2">{movie.nombre}</span>
      </div>
    </div>
  );
}

export function PagedReviews({
  reviews,
  title,
}: {
  reviews: ReviewComponents[];
  title: string;
}) {
  const [isSidebarOpen, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  //Para paginar las reviews, eventualmente a la hora de hacer los fetch podriamos usar algo como
  // offset = (limit * pageNumber) - 1
  //aunque probablemente hay una mejor forma de hacerlo
  const [pageNumber, setPageNumber] = useState(1);
  const handleSidebarToggle = () => {
    setOpen((prev) => !prev);
    document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
  };

  return (
    <div>
      <div className={`${isSidebarOpen ? "flex" : "hidden"}`}>
        <button
          className="absolute top-3 right-3 text-4xl mr-5 self-end z-2"
          onClick={() => handleSidebarToggle()}
        >
          &times;
        </button>
        <CreateReview title={title} />
      </div>
      <div
        className={`${
          isSidebarOpen ? "fixed" : "hidden"
        } inset-0 bg-black opacity-60`}
      ></div>
      <div className="flex items-center justify-between p-3 m-2">
        <div className="flex items-center gap-4">
          <span>Filter</span>
          <select
            className="[&>option]:text-black text-[#0e63be] rounded-sm transition-colors delay-75 duration-200 ease-in-out hover:bg-[#899fff]/20 [&>option]:bg-white"
            name="review-filter"
            id="filter-options"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Show All</option>
            <option value="1">1 star</option>
            <option value="2">2 stars</option>
            <option value="3">3 stars</option>
            <option value="4">4 stars</option>
            <option value="5">5 stars</option>
            <option value="6">6 stars</option>
            <option value="7">7 stars</option>
            <option value="8">8 stars</option>
            <option value="9">9 stars</option>
            <option value="10">10 stars</option>
          </select>
        </div>
        <button
          className="font-semibold before:content-['+'] before:mr-1 before:text-[#f5c518] before:text-xl transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
          onClick={() => handleSidebarToggle()}
        >
          Write Review
        </button>
      </div>
      <div className="mx-auto w-2/3">
        <div className="items-center self-center justify-center p-2 m-2">
          {reviews.length > 0 ? (
            reviews.map((review, index) =>
              review.puntuacion === Number(filter) || filter === "all" ? (
                <MovieReview key={index} {...review} />
              ) : null
            )
          ) : (
            <span className="flex justify-center p-10">
              Congrats! You get to be the first to write a review.
            </span>
          )}
        </div>
        <div className="flex flex-row p-5 items-center">
          <button
            disabled={pageNumber <= 1}
            className={`pr-2 text-2xl ${
              pageNumber <= 1 ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            &lt;
          </button>
          <span className="text-sm">Page {pageNumber}</span>
          <button
            className="pl-2 text-2xl cursor-pointer"
            onClick={() => {
              // Cambiar esto a cuando el response.next == null asi no permitimos pasar a paginas pasadas del limite, usando disabled = {}
              // lo mismo con cursor-pointer a cursor-default
              if (pageNumber >= 1) {
                setPageNumber(pageNumber + 1);
              }
            }}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
