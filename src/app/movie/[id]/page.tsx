"use client";

import { useParams } from "next/navigation";
import {
  MovieInfoSection,
  MovieReviewsSection,
} from "../../../../components/moviesection";

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

export default function Movie() {
  const params = useParams();
  const dummyData: MovieComponents = {
    id: Number(params.id),
    title: "The Shawshank Redemption",
    description:
      "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
    genre: "Drama",
    release_date: new Date("1994-05-21T10:20:00Z"),
    length: 142,
    image_url: "/MV5BMDAyY2FhYjctNDc5OS00MDNlLThi.png",
    score: 9.3,
  };

  const dummyComments: Comment[] = [
    {
      id: 1,
      content: "This is a comment",
      userId: 1,
      user: {} as User,
      reviewId: 1,
      review: {} as ReviewComponents, // Placeholder for review
    },
  ];

  const dummyUser: User = {
    id: 1,
    username: "Andy",
    email: "example@email.com",
    password: "password",
    role: "user",
    date: new Date("2023-10-01T10:20:00Z"),
    level: 1,
    imageURL: "/userimage",
    reviews: [],
    deletedAt: new Date("2023-10-01T10:20:00Z"),
    relatedGroups: [],
    comments: dummyComments,
  };

  const dummyGroup: Group = {
    id: 1,
    name: "Movie Lovers",
    description: "A group for movie enthusiasts",
    createdAt: new Date("2023-10-01T10:20:00Z"),
    relatedUsers: [],
    reviews: [],
  };

  const dummyReviews: ReviewComponents[] = [
    {
      id: 1,
      userId: 1,
      texto:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus velit molestiae accusantium explicabo dolorem est voluptate corrupti, rerum quia, blanditiis odio, aspernatur voluptas accusamus qui sapiente hic laboriosam repellat aliquam.",
      puntuacion: 9,
      user: dummyUser,
      peliculaId: 1,
      pelicula: dummyData,
      grupo: dummyGroup,
      comentarios: dummyComments,
    },
    {
      id: 2,
      userId: 2,
      texto: "This is a bad movie",
      puntuacion: 2,
      user: dummyUser,
      peliculaId: 1,
      pelicula: dummyData,
      grupo: undefined,
      comentarios: dummyComments,
    },
    {
      id: 3,
      userId: 1,
      texto: "This is a okay movie",
      puntuacion: 6,
      user: dummyUser,
      peliculaId: 1,
      pelicula: dummyData,
      grupo: undefined,
      comentarios: dummyComments,
    },
  ];

  return (
    <div className="bg-[#001d3d] px-0 py-0 md:px-7 md:py-7 w-full mx-auto">
      <div className="mx-auto w-full md:w-5/6">
        <MovieInfoSection {...dummyData} />
        <MovieReviewsSection reviews={dummyReviews} />
      </div>
    </div>
  );
}
