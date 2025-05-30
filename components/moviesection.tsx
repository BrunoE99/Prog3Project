"use client";

import Image from "next/image";
import Link from "next/link";
import MovieReview from "./genericreview";
import CreateReview from "./createreview";
import { useState } from "react";

interface MovieComponents {
  id: number;
  title: string;
  description: string;
  genre: string;
  release_date: Date;
  length: number;
  image_url: string;
  score: number;
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

export function MovieReviewsSection({
  reviews,
}: {
  reviews: ReviewComponents[];
}) {
  const [isSidebarOpen, setOpen] = useState(false);

  const handleSidebarToggle = () => {
    setOpen((prev) => !prev);
    document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
  };

  return (
    <section className="mx-auto py-20 px-6">
      <div className={`${isSidebarOpen ? "flex" : "hidden"}`}>
        <button
          className="fixed top-3 right-3 text-4xl mr-5 self-end z-2"
          onClick={() => handleSidebarToggle()}
        >
          &times;
        </button>
        <CreateReview />
      </div>
      <div
        className={`${
          isSidebarOpen ? "fixed" : "hidden"
        } inset-0 bg-black opacity-60`}
      ></div>
      <div className="flex flex-row justify-between items-center bg-[#001d3d] p-5">
        <div className="flex flex-row items-center gap-2">
          <h2 className="font-semibold text-xl before:content-[''] before:bg-[#f5c518] before:-ml-3 before:rounded-sm before:self-start before:absolute before:h-1/30 before:w-1">
            User Reviews
          </h2>
          <Link
            className="text-sm text-left after:content-['>'] after:ml-1 after:text-xl after:font-bold transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
            href={`${reviews[0].peliculaId}/reviews`}
          >
            All Reviews
          </Link>
        </div>
        <button
          onClick={() => handleSidebarToggle()}
          className="font-semibold before:content-['+'] before:mr-1 before:text-[#f5c518] before:text-xl transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
        >
          Write Review
        </button>
      </div>
      <div id="reviewsPreview">
        {reviews.map((review, index) => (
          <MovieReview key={index} {...review} />
        ))}
      </div>
    </section>
  );
}

export function MovieInfoSection(movie: MovieComponents) {
  return (
    <section className="flex flex-col bg-[#001d3d] mb-5 justify-center items-center w-full mx-auto">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="flex items-start flex-row flex-nowrap p-6 bg-[#003566] shadow-sm rounded-md">
        <div className="relative mx-auto w-1/5 h-auto">
          <Image
            className="rounded-sm w-1/5 md:w-full md:h-full lg:w-full"
            src="/MV5BMDAyY2FhYjctNDc5OS00MDNlLThi.png"
            alt="Movie's Poster"
            fill={true}
          />
        </div>
        <div className="flex flex-col w-full px-6 gap-2">
          <h1 className="text-md lg:text-3xl font-bold break-words">
            {movie.title}
          </h1>

          <div>
            <div className="block text-xs md:text-sm lg:text-lg mt-4 md:mt1 text-balance lg:text-wrap w-full pr-4">
              {movie.description}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <div className="flex flex-row gap-3 items-end justify-end p-2">
            <span
              className={`fa ${
                movie.score <= 3 + 1 / 3
                  ? "fa-star-o"
                  : movie.score >= 8
                  ? "fa-star"
                  : "fa-star-half-o"
              } fa-2x checked text-[#f5c518] inline-block`}
            ></span>
            <div className="flex items-end justify-end self-end font-extrabold text-md md:text-2xl">
              {movie.score}
            </div>
          </div>
          <div className="flex flex-col items-end p-10 m-2 justify-end w-full text-sm md:text-lg wrap-normal xl:text-nowrap pr-0">
            <div className="flex flex-row gap-3 text-start items-center self-start w-full">
              <span className="text-start mr-1 opacity-90 font-semibold text-xs md:text-sm">
                Year of Release
              </span>
              <span className="p-1 text-end w-full">
                {movie.release_date.getFullYear()}
              </span>
            </div>

            <div className="w-full mt-1 border-1 border-solid border-[#001d3d] shadow-2xl m-1"></div>

            <div className="flex flex-row gap-3 text-start items-center self-start w-full ">
              <span className="text-start mr-1 opacity-90 font-semibold text-xs md:text-sm">
                Length
              </span>
              <span className="p-1 text-end w-full">
                {Math.floor(movie.length / 60)}h {movie.length % 60}m
              </span>
            </div>

            <div className="w-full mt-1 border-1 border-solid border-[#001d3d] shadow-2xl m-1"></div>

            <div className="flex flex-row gap-3 text-start items-center self-start w-full">
              <span className="text-start mr-1 opacity-90 font-semibold text-xs md:text-sm">
                Genre
              </span>
              <span className="p-1 text-end w-full">{movie.genre}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
