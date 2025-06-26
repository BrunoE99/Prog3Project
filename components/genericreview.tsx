import {
  createComment,
  eraseReview,
  findAllCommentsForReview,
} from "@/app/reviews/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import Comment from "./comment";
import { ModalConfirmation } from "./modalConfirmation";
import { redirect } from "next/navigation";
import Button from "./button";
import ReviewEditSidebar from "./editReview";
import { getDecodedToken } from "@/app/[locale]/movie/[id]/actions";
import { useTranslations } from "next-intl";

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

export default function MovieReview({
  review,
  authorized,
  onEditDelete,
}: {
  review: ReviewComponents;
  authorized: boolean;
  onEditDelete: () => void;
}) {
  const t = useTranslations("MovieReview");
  const [commentsOpen, setOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [comments, setComments] = useState<Comment[] | undefined>(undefined);
  const [contextMenuOpen, setContextOpen] = useState(false);
  const [commentRefresh, setRefresh] = useState(true);
  const [token, setToken] = useState<JwtBody | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageChanged, setPaging] = useState(false);
  const handleModalOpen = () => {
    if (authorized) {
      setModalOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      redirect("/login");
    }
  };
  const handleCommentPost = () => {
    if (token && newComment !== "") {
      createComment(review.id, newComment);
      setNewComment("");
      setRefresh(true);
    } else if (!token) {
      redirect("/login");
    }
  };
  useEffect(() => {
    (async () => {
      const t = await getDecodedToken();
      setToken(t);
    })();
    async function fetchComments() {
      let reviewComments = await findAllCommentsForReview(
        review.id,
        pageNumber - 1
      );
      if (!reviewComments && pageNumber > 1) {
        setPageNumber(pageNumber - 1);
        reviewComments = comments;
      } else if (!reviewComments && pageNumber === 1) {
        reviewComments = [];
      }
      setComments(reviewComments);
    }
    if (commentRefresh || pageChanged) {
      setRefresh(false);
      setPaging(false);
      fetchComments();
    }
  }, [commentRefresh, pageChanged]);
  const deleteReview = () => {
    eraseReview(review.id);
    onEditDelete();
  };

  return (
    <div className="flex flex-col gap-3 p-5 bg-[#003566] px-2 py-2 m-3 rounded-sm shadow-lg w-full">
      {isSidebarOpen ? (
        <div>
          <div className="fixed inset-0 bg-black opacity-60"></div>
          <ReviewEditSidebar
            review={review}
            onClose={() => {
              setContextOpen(false);
              setSidebarOpen(false);
            }}
            onSubmit={() => {
              setContextOpen(false);
              setSidebarOpen(false);
              onEditDelete();
            }}
          />
        </div>
      ) : null}
      {modalOpen ? (
        <ModalConfirmation
          message={t("delete-confirmation")}
          onAccept={() => {
            deleteReview();
            setContextOpen(false);
            setModalOpen(false);
            document.body.style.overflow = "unset";
          }}
          onCancel={() => {
            setContextOpen(false);
            setModalOpen(false);
            document.body.style.overflow = "unset";
          }}
        />
      ) : null}
      <div className="flex flex-row justify-between items-center p-1">
        {!review.pelicula ? (
          <div className="flex flex-row gap-2">
            <Image
              className="rounded-full"
              src={`http://localhost:3000${review.user.urlImagen}`}
              alt="User's Avatar"
              width={50}
              height={50}
            />
            <div className="p-2 flex flex-col">
              <h3 className="text-2xl font-semibold">{review.user.username}</h3>
              <h4
                className={`${
                  review.grupo ? "cursor-pointer" : "hidden"
                } text-sm font-medium opacity-60`}
                onClick={() => {
                  if (review.grupo) redirect(`/group/${review.grupo.id}`);
                }}
              >
                {review.grupo?.nombre}
              </h4>
            </div>
          </div>
        ) : null}
        {review.pelicula ? (
          <div
            className="flex flex-row justify-center items-center gap-6 sm:gap-3 cursor-pointer"
            onClick={() => redirect(`/movie/${review.peliculaId}`)}
          >
            <Image
              className="rounded-sm"
              src={review.pelicula.urlImagen}
              alt="Movie's Poster"
              width={36}
              height={36}
            />
            <span className="text-2xl font-semibold text-nowrap">
              {review.pelicula.nombre}
            </span>
          </div>
        ) : null}
        <div>
          <div className="text-md md:text-xl font-semibold flex justify-end w-full p-2">
            {review.puntuacion}/10
          </div>
          <div className="hidden md:flex justify-end w-full pr-2 m-0">
            {Array.from({ length: review.puntuacion }).map((_, index) => {
              return (
                <span
                  key={index}
                  className="fa fa-star checked text-[#f5c518] text-xl m-0.5 "
                ></span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-sm p-2 pl-0 lg:pl-15 w-3/4 md:text-base h-fit break-words">
        {review.texto.split("\n").map((paragraph, idx) => (
          <p key={idx} className="">
            {paragraph}
          </p>
        ))}
      </div>
      <div
        className={`flex flex-row justify-between items-center ${
          commentsOpen ? "border-b-1" : ""
        }`}
      >
        <div className="flex flex-row gap-2 justify-center items-center pl-5">
          <div
            className="flex flex-row gap-2 cursor-pointer transition-colors delay-75 duration-100 ease-in-out hover:text-[#f5c518]"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="text-xl font-semibold">
              {commentsOpen ? "-" : "+"}
            </span>
            <button className="text-sm cursor-pointer">
              {t("comment-button")}
            </button>
          </div>
          <div
            className={`${
              commentsOpen ? "flex" : "hidden"
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
            <span className="text-sm">
              {t("page-text")} {pageNumber}
            </span>
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
                  onClick={() => setSidebarOpen((prev) => !prev)}
                >
                  <i className="fa fa-edit pl-1"></i>
                  <button className="pr-1 cursor-pointer" disabled={modalOpen}>
                    {t("edit-button")}
                  </button>
                </div>
                <div
                  className="flex flex-row items-center justify-center gap-1 rounded-b-sm bg-[#eeeeee] shadow-md text-[#000814] text-sm p-1.5 hover:bg-[#cccccc] cursor-pointer transition-colors delay-75 duration-200 ease-in-out"
                  onClick={handleModalOpen}
                >
                  <i className="fa fa-trash-o pl-1 text-orange-500"></i>
                  <button className="pr-1 cursor-pointer" disabled={modalOpen}>
                    {t("delete-button")}
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
      {commentsOpen ? (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 justify-center items-center p-2">
            <input
              className="w-full"
              type="text"
              placeholder={t("comment-write-placeholder")}
              id="comment-post"
              autoComplete="off"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            />
            <Button
              text={t("comment-post-button")}
              onClick={handleCommentPost}
            />
          </div>
          {comments &&
            comments.map((comment, index) => (
              <Comment
                key={index}
                comment={comment}
                onDelete={() => setRefresh(true)}
                authorized={
                  comment.userId === token?.sub || token?.role === "admin"
                }
              />
            ))}
        </div>
      ) : null}
    </div>
  );
}
