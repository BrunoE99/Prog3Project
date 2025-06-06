"use client";

import MovieReview from "./genericreview";
import CreateReview from "./createreview";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/app/movie/[id]/actions";
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

export function MovieReviewsSection({
  reviews,
  title,
}: {
  reviews: ReviewComponents[];
  title: string;
}) {
  const [isSidebarOpen, setOpen] = useState(false);
  const [loadAllReviews, setMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [token, setToken] = useState<string | undefined>(undefined);

  // Fetch token on mount
  useEffect(() => {
    (async () => {
      const t = await getAuthToken();
      setToken(t);
    })();
  }, []);

  const featuredReviews: ReviewComponents[] =
    reviews.length === 1
      ? [reviews[0]]
      : reviews.length === 0
      ? []
      : [reviews[0], reviews[1]];

  const handleModeChange = () => {
    setMode((prev) => !prev);
  };

  const displayFeaturedReviews = () => {
    return reviews.length > 0 ? (
      featuredReviews.map((review, index) =>
        review.puntuacion >= Number(filter) || filter === "all" ? (
          <MovieReview key={index} {...review} />
        ) : null
      )
    ) : (
      <span className="flex justify-center p-10">
        Congrats! You get to be the first to write a review.
      </span>
    );
  };

  const displayAllReviews = () => {
    const pagedReviews = [];
    const limit = 15;
    const offset = limit * (pageNumber - 1);
    for (let i = offset; i < offset + limit && i < reviews.length; i++) {
      pagedReviews.push(reviews[i]);
    }
    return reviews.length > 0 ? (
      pagedReviews.map((review, index) =>
        review.puntuacion >= Number(filter) || filter === "all" ? (
          <MovieReview key={index} {...review} />
        ) : null
      )
    ) : (
      <span className="flex justify-center p-10">
        Congrats! You get to be the first to write a review.
      </span>
    );
  };

  const handleSidebarToggle = () => {
    if (token || isSidebarOpen) {
      setOpen((prev) => !prev);
      document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
    } else if (!token) {
      redirect("/login");
    }
  };

  return (
    <section className="mx-auto py-20 px-6">
      <div className={`${isSidebarOpen ? "flex" : "hidden"}`}>
        <button
          className="fixed top-3 right-3 text-4xl mr-4 mt-0.5 z-2 justify-center dark:text-white text-black cursor-pointer rounded-full hover:bg-[#bdbcb968] h-10 w-10 transition-all delay-75 duration-100 ease-in-out"
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
      <div className="flex flex-row justify-between items-center bg-[#001d3d] p-5">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-row items-center gap-6">
            <button
              onClick={() => handleModeChange()}
              className={`text-xl ${
                loadAllReviews
                  ? "font-light transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
                  : "font-semibold"
              }`}
            >
              Featured Reviews
            </button>
            <button
              className={`${
                loadAllReviews
                  ? "font-semibold"
                  : "font-light transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
              } text-xl text-left before:content-[''] before:bg-[#f5c518] before:-ml-3 before:rounded-sm before:-mt-1 before:absolute before:h-1/30 before:w-1 before:self-center`}
              onClick={() => handleModeChange()}
            >
              All Reviews
            </button>
          </div>
          <div
            className={`${
              loadAllReviews ? "flex" : "hidden"
            } flex items-center gap-4`}
          >
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
        </div>
        <button
          onClick={() => handleSidebarToggle()}
          className="font-semibold cursor-pointer before:content-['+'] before:mr-1 before:text-[#f5c518] before:text-xl transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
        >
          Write Review
        </button>
      </div>
      <div id="reviewsPreview">
        {loadAllReviews ? displayAllReviews() : displayFeaturedReviews()}
      </div>
      <div
        className={`${
          loadAllReviews ? "flex" : "hidden"
        } flex-row p-5 items-center`}
      >
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
    </section>
  );
}

export function MovieInfoSection(movie: MovieComponents) {
  const release_year = movie.fechaEstreno?.split("-")[0] || "Unknown";

  return (
    <section className="flex flex-col bg-[#001d3d] mb-5 justify-center items-center w-full mx-auto">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="flex items-start flex-row flex-nowrap p-6 bg-[#003566] shadow-sm rounded-md">
        <div className="relative mx-auto w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            className="mx-auto rounded-sm"
            src={movie.urlImagen}
            alt="Movie's Poster"
          />
        </div>
        <div className="flex flex-col w-full px-6 gap-2">
          <h1 className="text-md lg:text-3xl font-bold break-words">
            {movie.nombre}
          </h1>

          <div>
            <div className="block text-xs md:text-sm lg:text-lg mt-4 md:mt1 text-balance lg:text-wrap w-full pr-4">
              {movie.sinopsis}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <div className="flex flex-row gap-3 items-end justify-end p-2">
            <span
              className={`fa ${
                movie.calificacion <= 3 + 1 / 3
                  ? "fa-star-o"
                  : movie.calificacion >= 8
                  ? "fa-star"
                  : "fa-star-half-o"
              } fa-2x checked text-[#f5c518] inline-block`}
            ></span>
            <div className="flex items-end justify-end self-end font-extrabold text-md md:text-2xl">
              {movie.calificacion}
            </div>
          </div>
          <div className="flex flex-col items-end p-10 m-2 justify-end w-full text-sm md:text-lg wrap-normal xl:text-nowrap pr-0">
            <div className="flex flex-row gap-3 text-start items-center self-start w-full">
              <span className="text-start mr-1 opacity-90 font-semibold text-xs md:text-sm">
                Year of Release
              </span>
              <span className="p-1 text-end w-full">{release_year}</span>
            </div>

            <div className="w-full mt-1 border-1 border-solid border-[#001d3d] shadow-2xl m-1"></div>

            <div className="flex flex-row gap-3 text-start items-center self-start w-full ">
              <span className="text-start mr-1 opacity-90 font-semibold text-xs md:text-sm">
                Length
              </span>
              <span className="p-1 text-end w-full">
                {Math.floor(movie.duracion / 60)}h {movie.duracion % 60}m
              </span>
            </div>

            <div className="w-full mt-1 border-1 border-solid border-[#001d3d] shadow-2xl m-1"></div>

            <div className="flex flex-row gap-3 text-start items-center self-start w-full">
              <span className="text-start mr-1 opacity-90 font-semibold text-xs md:text-sm">
                Genre
              </span>
              <span className="p-1 text-end w-full">{movie.genero.nombre}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
