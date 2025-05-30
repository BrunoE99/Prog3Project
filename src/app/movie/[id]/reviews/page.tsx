"use client";

import Image from "next/image";
import MovieReview from "../../../../../components/genericreview";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateReview from "../../../../../components/createreview";
import { getAllReviewsByMovie, getAuthToken } from "../actions";

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

export default function Reviews() {
  const [isSidebarOpen, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  //Para paginar las reviews, eventualmente a la hora de hacer los fetch podriamos usar algo como
  // offset = (limit * pageNumber) - 1
  //aunque probablemente hay una mejor forma de hacerlo
  const [pageNumber, setPageNumber] = useState(1);
  const params = useParams();
  const [reviews, setReviews] = useState<ReviewComponents[]>([]);
  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getAllReviewsByMovie(Number(params.id));
      setReviews(fetchedReviews);
    };
    fetchReviews();
  }, [params.id]);

  const handleSidebarToggle = () => {
    setOpen((prev) => !prev);
    document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
  };

  return (
    <div className="">
      <div className={`${isSidebarOpen ? "flex" : "hidden"}`}>
        <button
          className="absolute top-3 right-3 text-4xl mr-5 self-end z-2"
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
      <div className="flex flex-row items-center justify-start gap-2 m-2 p-5 w-full mx-auto">
        <Image
          className="rounded-sm"
          src="/MV5BMDAyY2FhYjctNDc5OS00MDNlLThi.png"
          alt="Movie's Poster"
          width={100}
          height={100}
        />
        <span className="text-4xl m-5 p-2">The Shawshank Redemption</span>
      </div>
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
          {reviews.map((review, index) =>
            review.puntuacion === Number(filter) || filter === "all" ? (
              <MovieReview key={index} {...review} />
            ) : null
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
