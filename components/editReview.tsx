import { reviewEdit } from "@/app/reviews/actions";
import { useTranslations } from "next-intl";
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

export default function ReviewEditSidebar({
  review,
  onSubmit,
  onClose,
}: {
  review: ReviewComponents;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("ReviewEditSidebar");
  const [fieldsEdited, setFieldsEdited] = useState([false, false]);
  const scoreSelected = useRef(true);
  const firstPass = useRef(true);
  const [fields, setFields] = useState([
    review.puntuacion ?? 1,
    review.texto ?? "",
  ]);

  const wrappedEditReview = async (_state: any, formData: FormData) => {
    const result = await reviewEdit(_state, formData);
    if (result.status === 200) {
      onSubmit();
    }
    return result;
  };
  const [state, action, pending] = useActionState(wrappedEditReview, undefined);

  useEffect(() => {
    const starButtons = document.querySelectorAll(
      "#review-edit-sidebar button"
    );
    if (firstPass.current) {
      firstPass.current = false;
      starButtons.forEach((btn) => {
        const index = btn.getAttribute("aria-label");
        if (Number(index) <= Number(fields[0])) {
          btn.querySelector("span")?.classList.add("fa-star");
          btn.querySelector("span")?.classList.remove("fa-star-o");
        } else {
          btn.querySelector("span")?.classList.add("fa-star-o");
          btn.querySelector("span")?.classList.remove("fa-star");
        }
      });
    }
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
      .getElementById("review-edit-score")!
      .addEventListener("mouseleave", () => {
        const score = document
          .getElementById("edit-score")
          ?.getAttribute("value");
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
        setFields([button.getAttribute("aria-label")!, fields[1]]);
        setFieldsEdited([true, fieldsEdited[1]]);
      });
    });
  });

  return (
    <div
      id="review-edit-sidebar"
      className="h-full fixed top-0 right-0 z-5 overflow-x-hidden bg-white dark:bg-[#001d3d] dark:text-white pt-15 w-1/5 text-black"
    >
      <button
        className="fixed top-3 right-3 text-4xl mr-4 mt-0.5 justify-center dark:text-white text-black cursor-pointer rounded-full hover:bg-[#bdbcb968] h-10 w-10 transition-all delay-75 duration-100 ease-in-out"
        onClick={onClose}
      >
        &times;
      </button>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <form
        name="create-review"
        action={action}
        className="flex flex-col h-3/4 p-6 gap-4"
      >
        <input
          className="hidden"
          name="changedFields"
          id="changedFields"
          readOnly
          value={fieldsEdited?.toString() ?? "true,true"}
        />
        <input
          type="text"
          className="hidden"
          id="review_id"
          name="review_id"
          readOnly
          defaultValue={review.id}
        />
        <div className="flex flex-col gap-2">
          <span>{t("score-label")}</span>
          <div
            id="review-edit-score"
            className="flex flex-row gap-2 items-center"
          >
            <button aria-label="1" type="button" className="cursor-pointer">
              <span
                className={`fa fa-star-o fa-lg checked text-[#f5c518] text-xl inline-block`}
              ></span>
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
              name="edit-score"
              id="edit-score"
              value={fields[0]}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col h-3/4">
          <textarea
            required
            name="edit-content"
            id="edit-content"
            className="border-2 h-3/4 p-2 text-start rounded-md items-start justify-start placeholder-gray-400"
            placeholder={t("content-placeholder")}
            onChange={(e) => {
              setFields([fields[0], e.target.value]);
              setFieldsEdited([fieldsEdited[0], true]);
            }}
            value={fields[1]}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          {state?.error?.puntuacion ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.puntuacion.map((message: string) => message + " ")}
            </span>
          ) : null}
          {state?.error?.texto ? (
            <span className="block text-red-500 justify-center items-center text-center">
              {state?.error.texto.map((message: string) => message + " ")}
            </span>
          ) : null}
          {typeof state?.error !== "object" ? (
            <span
              className={`${
                state?.error ? "block" : "hidden"
              } text-red-500 justify-center items-center text-center`}
            >
              {state?.error}
            </span>
          ) : null}
        </div>
        <input
          disabled={pending}
          type="submit"
          name="Submit"
          id="submit-review-button"
          className="bg-[#001d3dcf] hover:bg-[#001d3d] dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
          onClick={() => {
            scoreSelected.current = false;
            const stars = document.querySelectorAll(
              "#review-edit-sidebar button span"
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
