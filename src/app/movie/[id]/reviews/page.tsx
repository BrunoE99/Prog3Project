"use server";

import { getAllReviewsByMovie, getMovieById } from "../actions";
import {
  PagedReviews,
  ShortenedMovieInfo,
} from "../../../../../components/allReviewPage";

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

export default async function Reviews({ params }: { params: { id: string } }) {
  const { id } = await params;
  const movie: MovieComponents = await getMovieById(Number(id));
  const reviews: ReviewComponents[] = await getAllReviewsByMovie(Number(id));

  return (
    <div>
      <ShortenedMovieInfo movie={movie} />
      <PagedReviews reviews={reviews} title={movie.nombre} />
    </div>
  );
}
