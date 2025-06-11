import { createReview } from "@/app/movie/[id]/actions";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

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

export default function CreateReview(props: {
  movie: MovieComponents;
  onSubmit: () => void;
  groupId?: string;
}) {
  const { movie, onSubmit, groupId } = props;
  const scoreSelected = useRef(false);
  const [score, setScore] = useState("1");
  const wrappedCreateReview = async (_state: any, formData: FormData) => {
    const result = await createReview(_state, formData);
    if (result.success) {
      onSubmit();
    }
    return result;
  };
  const [state, action, pending] = useActionState(
    wrappedCreateReview,
    undefined
  );

  useEffect(() => {
    if (state?.status === 401) {
      // refresh token here
      // redirecting to login for now
      redirect("/login");
    }

    const starButtons = document.querySelectorAll("#review-sidebar button");
    starButtons.forEach((button) => {
      button.addEventListener("mouseover", () => {
        const index = button.getAttribute("aria-label");
        if (index) {
          starButtons.forEach((btn) => {
            const btnIndex = btn.getAttribute("aria-label");
            if (btnIndex && Number(btnIndex) <= Number(index)) {
              btn.querySelector("span")?.classList.add("fa-star");
              btn.querySelector("span")?.classList.remove("fa-star-o");
            } else if (Number(btnIndex) > Number(index)) {
              btn.querySelector("span")?.classList.add("fa-star-o");
              btn.querySelector("span")?.classList.remove("fa-star");
            }
          });
        }
      });
    });

    document
      .getElementById("review-score")!
      .addEventListener("mouseleave", () => {
        const score = document.getElementById("score")?.getAttribute("value");
        starButtons.forEach((btn) => {
          if (!scoreSelected.current) {
            btn.querySelector("span")?.classList.add("fa-star-o");
            btn.querySelector("span")?.classList.remove("fa-star");
          } else if (Number(btn.getAttribute("aria-label")) > Number(score)) {
            btn.querySelector("span")?.classList.add("fa-star-o");
            btn.querySelector("span")?.classList.remove("fa-star");
          } else {
            btn.querySelector("span")?.classList.add("fa-star");
            btn.querySelector("span")?.classList.remove("fa-star-o");
          }
        });
      });

    starButtons.forEach((button) => {
      button.addEventListener("click", () => {
        scoreSelected.current = true;
        setScore(button.getAttribute("aria-label")!);
      });
    });
  });
  return (
    <div
      id="review-sidebar"
      className="h-full fixed z-1 top-0 right-0 overflow-x-hidden bg-white dark:bg-[#001d3d] dark:text-white pt-15 w-1/5 text-black"
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="text-2xl p-4 ml-2 font-semibold">{movie.nombre}</div>
      <form
        name="create-review"
        action={action}
        className="flex flex-col h-3/4 p-6 gap-4"
      >
        <input
          type="text"
          className="hidden"
          id="grupo_id"
          name="grupo_id"
          readOnly
          defaultValue={groupId}
        />
        <input
          type="text"
          className="hidden"
          id="pelicula_id"
          name="pelicula_id"
          readOnly
          defaultValue={movie.id}
        />
        <div className="flex flex-col gap-2">
          <span>Your score</span>
          <div id="review-score" className="flex flex-row gap-2 items-center">
            <button aria-label="1" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="2" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="3" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="4" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="5" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="6" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="7" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="8" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="9" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <button aria-label="10" type="button" className="cursor-pointer">
              <span className="fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block"></span>
            </button>
            <input
              className="hidden"
              name="score"
              id="score"
              value={score}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col h-3/4">
          <textarea
            required
            name="content"
            id="content"
            className="border-2 h-3/4 p-2 text-start rounded-md items-start justify-start placeholder-gray-400"
            placeholder="Write you review here..."
          />
        </div>
        <span
          className={`${
            state?.status && state.status >= 400 ? "block" : "hidden"
          } text-red-500 justify-center items-center text-center`}
        >
          {state?.error}
        </span>
        <input
          disabled={pending}
          type="submit"
          name="Submit"
          id="submit-review-button"
          className="bg-[#001d3dcf] hover:bg-[#001d3d] dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
          onClick={() => {
            scoreSelected.current = false;
            const stars = document.querySelectorAll(
              "#review-sidebar button span"
            );
            stars.forEach((star) => {
              star.classList.add("fa-star-o");
              star.classList.remove("fa-star");
            });
          }}
        />
      </form>
    </div>
  );
}
