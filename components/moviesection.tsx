"use client";

import MovieReview from "./genericreview";
import CreateReview from "./createreview";
import { useEffect, useState } from "react";
import {
  eraseMovie,
  getAllReviewsByMovie,
  getDecodedToken,
  getFeaturedReviews,
} from "@/app/movie/[id]/actions";
import { redirect, useParams } from "next/navigation";
import Image from "next/image";
import { ModalConfirmation } from "./modalConfirmation";
import { effect } from "zod";

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

type JwtBody = {
  sub: number;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

export function MovieReviewsSection({
  reviews,
  movie,
}: {
  reviews: ReviewComponents[];
  movie: MovieComponents;
}) {
  const [isSidebarOpen, setOpen] = useState(false);
  const [loadAllReviews, setMode] = useState(false);
  const [submitted, setSubmit] = useState(false);
  const [reviewsState, setReviews] = useState(reviews);
  const [filter, setFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageChanged, setPaging] = useState(false);
  const [modeChanged, setModeChange] = useState(false);
  const [token, setToken] = useState<JwtBody | undefined>(undefined);
  const params = useParams();
  const handleSidebarToggle = () => {
    if (token || isSidebarOpen) {
      setOpen((prev) => !prev);
      document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
    } else if (!token) {
      redirect("/login");
    }
  };

  useEffect(() => {
    (async () => {
      const t = await getDecodedToken();
      setToken(t);
    })();
    if (submitted || pageChanged || modeChanged) {
      if (submitted) {
        setSubmit(false);
      }
      if (pageChanged) {
        setPaging(false);
      }
      if (modeChanged) {
        setModeChange(false);
      }
      if (loadAllReviews) {
        const previousReviews = reviewsState;
        getAllReviewsByMovie(Number(params.id), pageNumber - 1).then(
          (newReviews) => {
            if (!newReviews && pageNumber > 1) {
              setPageNumber(pageNumber - 1);
              newReviews = previousReviews;
            } else if (!newReviews && pageNumber === 1) {
              newReviews = [];
            }
            setReviews(newReviews);
            if (isSidebarOpen) {
              handleSidebarToggle();
            }
          }
        );
      } else {
        getFeaturedReviews(Number(params.id)).then((newReviews) => {
          setReviews(newReviews);
          if (isSidebarOpen) {
            handleSidebarToggle();
          }
        });
      }
    }
  }, [submitted, pageChanged, modeChanged]);

  const featuredReviews: ReviewComponents[] =
    reviewsState.length === 1
      ? [reviewsState[0]]
      : reviewsState.length === 0
      ? []
      : [reviewsState[0], reviewsState[1]];

  const handleModeChange = () => {
    setMode((prev) => !prev);
    setModeChange(true);
  };

  const displayFeaturedReviews = () => {
    return reviewsState.length > 0 ? (
      featuredReviews
        .filter(
          (review) => filter === "all" || review.puntuacion >= Number(filter)
        )
        .map((review, index) => (
          <MovieReview
            key={index}
            review={review}
            authorized={token?.role === "admin" || token?.sub === review.userId}
            onEditDelete={() => setSubmit(true)}
          />
        ))
    ) : (
      <span className="flex justify-center p-10">
        Congrats! You get to be the first to write a review.
      </span>
    );
  };

  const displayAllReviews = () => {
    return reviewsState.length > 0 ? (
      reviewsState
        .filter(
          (review) => filter === "all" || review.puntuacion >= Number(filter)
        )
        .map((review, index) => (
          <MovieReview
            key={index}
            review={review}
            authorized={token?.role === "admin" || token?.sub === review.userId}
            onEditDelete={() => setSubmit(true)}
          />
        ))
    ) : (
      <span className="flex justify-center p-10">
        Congrats! You get to be the first to write a review.
      </span>
    );
  };

  return (
    <section className="mx-auto py-20 px-6">
      {isSidebarOpen ? (
        <div className={`${isSidebarOpen ? "flex" : "hidden"}`}>
          <button
            className="fixed top-3 right-3 text-4xl mr-4 mt-0.5 z-2 justify-center dark:text-white text-black cursor-pointer rounded-full hover:bg-[#bdbcb968] h-10 w-10 transition-all delay-75 duration-100 ease-in-out"
            onClick={() => handleSidebarToggle()}
          >
            &times;
          </button>
          <CreateReview
            movie={movie}
            onSubmit={() => setSubmit(true)}
            groupId={undefined}
          />
          <div
            className={`${
              isSidebarOpen ? "fixed" : "hidden"
            } inset-0 bg-black opacity-60`}
          ></div>
        </div>
      ) : null}
      <div className="flex flex-row justify-between items-center bg-[#001d3d] p-5">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-row items-center gap-6">
            <button
              onClick={() => handleModeChange()}
              className={`text-xl ${
                loadAllReviews
                  ? "font-light transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518] cursor-pointer"
                  : "font-semibold"
              }`}
            >
              Featured Reviews
            </button>
            <button
              className={`${
                loadAllReviews
                  ? "font-semibold"
                  : "font-light transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518] cursor-pointer"
              } text-xl text-left before:content-[''] before:bg-[#f5c518] before:-ml-3 before:rounded-sm before:-mt-1 before:absolute before:h-1/30 before:w-1 before:self-center`}
              onClick={() => handleModeChange()}
            >
              All Reviews
            </button>
          </div>
          <div
            className={`${
              loadAllReviews ? "flex flex-row" : "hidden"
            } items-center gap-4`}
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
          onClick={() => {
            setPageNumber(pageNumber - 1);
            setPaging(true);
          }}
        >
          &lt;
        </button>
        <span className="text-sm">Page {pageNumber}</span>
        <button
          className="pl-2 text-2xl cursor-pointer"
          onClick={() => {
            setPageNumber(pageNumber + 1);
            setPaging(true);
          }}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

export function MovieInfoSection({
  movie,
  authorized,
}: {
  movie: MovieComponents;
  authorized: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [contextMenuOpen, setContextOpen] = useState(false);
  const release_year = movie.fechaEstreno?.split("-")[0] || "Unknown";

  const handleModalOpen = () => {
    if (authorized) {
      setModalOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      redirect("/login");
    }
  };

  return (
    <section className="flex flex-col bg-[#001d3d] mb-5 justify-center items-center w-full mx-auto">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      {modalOpen ? (
        <ModalConfirmation
          message={`Are you sure you want to delete ${movie.nombre}?`}
          onAccept={() => {
            eraseMovie(Number(movie.id));
            setContextOpen(false);
            setModalOpen(false);
            document.body.style.overflow = "unset";
            redirect("/");
          }}
          onCancel={() => {
            setContextOpen(false);
            setModalOpen(false);
            document.body.style.overflow = "unset";
          }}
        />
      ) : null}
      <div className="flex items-start flex-row flex-nowrap p-6 bg-[#003566] shadow-sm rounded-md">
        <div className="relative mx-auto w-1/2 aspect-[2/3] min-w-32 max-w-56">
          <Image
            className="mx-auto rounded-sm z-1"
            src={movie.urlImagen}
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 128px, 224px"
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
          {authorized ? (
            <div className="flex flex-row justify-end items-center gap-2 relative">
              {contextMenuOpen && authorized ? (
                <div
                  id="contextMenu"
                  className="flex flex-col bg-[#eeeeee] rounded-sm divide-y-1 divide-[#65686c] absolute right-full shadow-md mr-2 z-1"
                >
                  <div
                    className="flex flex-row items-center justify-center gap-1 rounded-t-sm bg-[#eeeeee] shadow-md text-[#000814] text-sm p-1.5 hover:bg-[#cccccc] cursor-pointer transition-colors delay-75 duration-150 ease-in-out"
                    onClick={() => redirect(`/movie/${movie.id}/edit`)}
                  >
                    <i className="fa fa-edit pl-1"></i>
                    <button
                      className="pr-1 cursor-pointer"
                      disabled={modalOpen}
                    >
                      Edit
                    </button>
                  </div>
                  <div
                    className="flex flex-row items-center justify-center gap-1 rounded-b-sm bg-[#eeeeee] shadow-md text-[#000814] text-sm p-1.5 hover:bg-[#cccccc] cursor-pointer transition-colors delay-75 duration-200 ease-in-out"
                    onClick={handleModalOpen}
                  >
                    <i className="fa fa-trash-o pl-1 text-orange-500"></i>
                    <button
                      className="pr-1 cursor-pointer"
                      disabled={modalOpen}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
              <div
                className="inline-block cursor-pointer pr-2 pb-2 opacity-100 hover:opacity-60"
                onClick={() => {
                  setContextOpen((prev) => !prev);
                }}
              >
                <div className="bg-white h-1 w-1 rounded-full mt-1"></div>
                <div className="bg-white h-1 w-1 rounded-full mt-1"></div>
                <div className="bg-white h-1 w-1 rounded-full mt-1"></div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
