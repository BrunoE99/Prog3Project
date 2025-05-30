"use server";

import {
  MovieInfoSection,
  MovieReviewsSection,
} from "../../../../components/moviesection";
import { getFeaturedReviews } from "./actions";

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

  const dummyData: MovieComponents = {
    id: Number(id),
    title: "The Shawshank Redemption",
    description:
      "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
    genre: "Drama",
    release_date: new Date("1994-05-21T10:20:00Z"),
    length: 142,
    image_url: "/MV5BMDAyY2FhYjctNDc5OS00MDNlLThi.png",
    score: 9.3,
  };

  return (
    <div className="bg-[#001d3d] px-0 py-0 md:px-7 md:py-7 w-full mx-auto">
      <div className="mx-auto w-full md:w-5/6">
        <MovieInfoSection {...dummyData} />
        <MovieReviewsSection reviews={reviews} />
      </div>
    </div>
  );
}
