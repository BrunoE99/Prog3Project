"use server";

import { getMovie } from "@/app/API/movie/route";
import {
  MovieInfoSection,
  MovieReviewsSection,
} from "../../../../components/moviesection";
import { getAuthToken, getFeaturedReviews } from "./actions";

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
  imageURL: string;
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

export default async function Movie({ params }: { params: { id: string } }) {
  const { id } = await params;
  const reviews = await getFeaturedReviews(Number(id));
  const response = await getMovie(Number(id));
  const movie = response.body;
  await getAuthToken();

  return (
    <div className="bg-[#001d3d] px-0 py-0 md:px-7 md:py-7 w-full mx-auto">
      <div className="mx-auto w-full md:w-5/6">
        <MovieInfoSection {...movie} />
        <MovieReviewsSection reviews={reviews} />
      </div>
    </div>
  );
}
