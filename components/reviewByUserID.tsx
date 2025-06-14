import { reviewByUserID } from "@/app/API/reviews/route";
import ReviewCard from "./reviewProfileSection";
import Pagination from "./pagination";

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
  //   gruposRelacionados: GroupMembership[];
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
  //   usuariosRelacionados: GroupMembership[];
  reviews: ReviewComponents[];
  reunionId: number;
  reunion: Reunion;
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

export default async function ReviewsByUserID({
  userId,
  pagination,
}: {
  userId: number;
  pagination: number;
}) {
  const reviewsUser = await reviewByUserID(userId, pagination);

  if (reviewsUser.status === 500) {
    return (
      <section className="px-6 py-10">
        <h1 className="text-center pb-3 text-2xl text-white">My reviews</h1>
        <div className="mb-10 bg-[#001d3d] rounded-lg">
          <div className="grid grid-cols-1 gap-6 p-5">
            <p className="text-red-900">Something went wrong.</p>
          </div>
          <Pagination
            currentPage={pagination}
            hasMovies={reviewsUser?.hasMovies ?? false}
          />
        </div>
      </section>
    );
  }

  if (reviewsUser.status === 400) {
    return (
      <section className="px-6 py-10">
        <h1 className="text-center pb-3 text-2xl text-white">My reviews</h1>
        <div className="mb-10 bg-[#001d3d] rounded-lg">
          <div className="grid grid-cols-1 gap-6 p-5">
            <h1 className="text-red-900 text-center text-2xl">
              {reviewsUser.message}
            </h1>
          </div>
          <Pagination
            currentPage={pagination}
            hasMovies={reviewsUser?.hasMovies ?? false}
          />
        </div>
      </section>
    );
  }

  if (reviewsUser.status === 404) {
    return (
      <section className="px-6 py-10">
        <h1 className="text-center pb-3 text-2xl text-white">My reviews</h1>
        <div className="mb-10 bg-[#001d3d] rounded-lg">
          <div className="grid grid-cols-1 gap-6 p-5">
            <h1 className="text-red-900 text-center text-2xl">
              {reviewsUser.message}
            </h1>
          </div>
          <Pagination
            currentPage={pagination}
            hasMovies={reviewsUser?.hasMovies ?? false}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10">
      <h1 className="text-center pb-3 text-2xl text-white">My reviews</h1>
      <div className="mb-10 bg-[#001d3d] rounded-lg">
        <div className="grid grid-cols-1 gap-6 p-5">
          {reviewsUser.reviews.map(
            (review: ReviewComponents, index: number) => (
              <ReviewCard review={review} key={index} />
            )
          )}
        </div>
        <Pagination
          currentPage={pagination}
          hasMovies={reviewsUser?.hasMovies ?? false}
        />
      </div>
    </section>
  );
}
