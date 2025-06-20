"use client";

import { redirect, useParams } from "next/navigation";
import MovieReview from "./genericreview";
import {
  eraseGroup,
  findAllGroupReviews,
  findMeeting,
  findRoleInGroup,
  joinGroup,
  leaveGroup,
} from "@/app/[locale]/group/actions";
import { useEffect, useState } from "react";
import MeetingCard from "./meeting";
import Image from "next/image";
import ScheduleMeeting from "./scheduleMeeting";
import CreateReview from "./createreview";
import { MovieSelectModal } from "./movieSelectModal";
import { ModalConfirmation } from "./modalConfirmation";
import { getAuthToken } from "@/app/[locale]/movie/[id]/actions";
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

export function GroupPreviewCard(group: Group) {
  return (
    <div
      className="rounded-sm cursor-pointer bg-[#003566] shadow-lg p-3 w-full"
      onClick={() => redirect(`group/${group.id}`)}
    >
      <div className="flex flex-col">
        <span className="text-2xl">{group.nombre}</span>
        <span className="text-base text-ellipsis">{group.descripcion}</span>
      </div>
    </div>
  );
}

export function GroupHeader({
  group,
  isAdmin,
}: {
  group: Group;
  isAdmin: boolean;
}) {
  const t = useTranslations("GroupHeader");
  let creationDate: string[] = [];
  const [data, setData] = useState<{ token?: string; role?: string }>({});
  const [modalOpen, setOpen] = useState(false);

  if (group) {
    creationDate = group.createdAt.split("T")[0].split("-");
  }

  useEffect(() => {
    async function fetchData() {
      const [t, rol] = await Promise.all([
        getAuthToken(),
        findRoleInGroup(group.id),
      ]);
      setData({ token: t, role: rol });
    }
    fetchData();
  }, [group.id]);

  const wrappedJoinLeave = () => {
    if (data.token) {
      if (data.role) {
        leaveGroup(group.id);
      } else {
        joinGroup(group.id);
      }
      if (data.role) redirect("/group");
    } else {
      redirect("/login");
    }
  };

  return (
    <div className="flex flex-col justify-between items-center pt-6">
      {modalOpen ? (
        <ModalConfirmation
          message={t("confirmation")}
          onAccept={async () => {
            const response = await eraseGroup(group.id);
            setOpen(false);
            document.body.style.overflow = "unset";
            if (response && response.status && response.status === 200)
              redirect("/group");
          }}
          onCancel={() => {
            setOpen(false);
            document.body.style.overflow = "unset";
          }}
        />
      ) : null}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full pl-1 pr-1 sm:pl-6 sm:pr-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-6xl">{group.nombre}</span>
            <span className="flex text-base text-[#b0b3b8] align-middle">
              {t("creation-date-label")} {creationDate[2]}/{creationDate[1]}/
              {creationDate[0]}
            </span>
          </div>
          <p className="text-lg text-wrap w-2/3 pb-3">{group.descripcion}</p>
        </div>
        <div className="flex flex-row justify-end items-end">
          <div className="flex flex-col">
            <button
              onClick={wrappedJoinLeave}
              type="submit"
              name="submit"
              className={`flex shadow-sm cursor-pointer m-5 pb-1 pt-1 pr-4 pl-4 ${
                !data.role ? "before:content-['+']" : "before:content-['-']"
              } before:pr-2 before:text-xl text-lg text-center rounded-sm font-semibold bg-blue-700 hover:bg-blue-800 transition-colors delay-75 duration-100 ease-in-out`}
            >
              {!data.role ? t("join-button") : t("leave-button")}
            </button>
          </div>
          {data.role === "lider" || isAdmin ? (
            <button
              onClick={() => redirect(`/group/${group.id}/edit`)}
              className={`flex bg-[#1c1e21] shadow-sm cursor-pointer m-5 pb-1 pt-1 pr-4 pl-4 text-lg text-center rounded-sm font-semibold text-nowrap`}
            >
              {t("edit-button")}
            </button>
          ) : null}
          {data.role === "lider" || isAdmin ? (
            <button
              onClick={() => {
                setOpen(true);
                document.body.style.overflow = "hidden";
              }}
              className={`flex bg-red-800 shadow-sm cursor-pointer m-5 pb-1 pt-1 pr-4 pl-4 text-lg text-center rounded-sm font-semibold text-nowrap`}
            >
              {t("delete-button")}
            </button>
          ) : null}
        </div>
      </div>
      <div className="w-full mt-1 border-1 border-solid border-[#65686c] rounded-sm shadow-2xl"></div>
    </div>
  );
}

export function GroupMeetingColumn(props: {
  meeting?: Reunion;
  role: string;
  isAdmin: boolean;
}) {
  const t = useTranslations("GroupMeetingColumn");
  const { role, isAdmin } = props;
  const [isSidebarOpen, setOpen] = useState(false);
  const [meeting, setMeeting] = useState(props.meeting);
  const [submitted, setSubmit] = useState(false);
  const handleSidebarToggle = () => {
    if (isSidebarOpen) {
      setOpen((prev) => !prev);
      document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmit(false);
      findMeeting().then((newMeeting) => {
        setMeeting(newMeeting);
        if (isSidebarOpen) {
          handleSidebarToggle();
        }
      });
    }
  }, [submitted]);

  return (
    <div className="col-span-1 pl-6 bg-[#003566] h-full shadow-2xl rounded-br-md">
      {isSidebarOpen ? (
        <>
          <div className="flex">
            <button
              className="fixed top-3 left-3 text-4xl mr-4 mt-0.5 z-4 justify-center dark:text-white text-black cursor-pointer rounded-full hover:bg-[#bdbcb968] h-10 w-10 transition-all delay-75 duration-100 ease-in-out"
              onClick={() => handleSidebarToggle()}
            >
              &times;
            </button>
            <ScheduleMeeting
              onSubmit={() => {
                setSubmit(true);
              }}
            />
          </div>
          <div
            className={`${
              isSidebarOpen ? "fixed" : "hidden"
            } inset-0 bg-black opacity-60`}
          ></div>
        </>
      ) : null}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center mr-3 pt-4">
          <h2 className="font-semibold text-xl">{t("title")}</h2>
          {role && role === "lider" ? (
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex shadow-sm cursor-pointer text-center self-center items-center justify-center pb-1 pt-1 pr-4 pl-4 before:content-['+'] before:pr-2 before:text-xl text-lg rounded-sm font-semibold bg-blue-700 hover:bg-blue-800 transition-colors delay-75 duration-100 ease-in-out"
            >
              {t("schedule-button")}
            </button>
          ) : null}
        </div>
        <div className="flex flex-col items-center mr-3">
          {meeting !== undefined ? (
            <MeetingCard
              role={role}
              meeting={meeting}
              onDelete={() => setMeeting(undefined)}
              isAdmin={isAdmin}
            />
          ) : (
            <span className="mt-5">{t("no-meeting-msg")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function GroupReviews({
  reviews,
  userRole,
  isAdmin,
}: {
  reviews: ReviewComponents[];
  userRole: string | undefined;
  isAdmin: boolean;
}) {
  const t = useTranslations("GroupReviews");
  const [groupReviews, setReviews] = useState(reviews);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setMovie] = useState<MovieComponents | undefined>(
    undefined
  );
  const [submitted, setSubmit] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageChanged, setPaging] = useState(false);
  const params = useParams();
  const groupId: string = String(params.id);
  const handleSidebarToggle = () => {
    if (isSidebarOpen) {
      setMovie(undefined);
    }
    setSidebarOpen((prev) => !prev);
    document.body.style.overflow = isSidebarOpen ? "unset" : "hidden";
  };
  const handleModalToggle = () => {
    setModalOpen((prev) => !prev);
    document.body.style.overflow = modalOpen ? "unset" : "hidden";
  };

  useEffect(() => {
    if (submitted || pageChanged) {
      if (submitted) {
        setSubmit(false);
      }
      if (pageChanged) {
        setPaging(false);
      }
      const previousReviews = groupReviews;
      findAllGroupReviews(Number(params.id), pageNumber - 1).then(
        (newReviews) => {
          if (!newReviews && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
            newReviews = previousReviews;
          } else if (!newReviews && pageNumber === 1) {
            newReviews = [];
          }
          setReviews(newReviews);
          if (isSidebarOpen) {
            handleSidebarToggle();
          }
        }
      );
      setSubmit(false);
    }
  }, [submitted, pageChanged]);

  return (
    <div className="flex flex-col col-span-2 items-center h-full pt-4 gap-3">
      {modalOpen ? (
        <MovieSelectModal
          message={t("select-modal-msg")}
          onConfirm={(movie: MovieComponents) => {
            setMovie(movie);
            handleModalToggle();
            handleSidebarToggle();
          }}
          onCancel={() => {
            handleModalToggle();
          }}
        />
      ) : null}
      {isSidebarOpen ? (
        <div>
          <div className="flex">
            <button
              className="fixed top-3 right-3 text-4xl mr-4 mt-0.5 z-3 justify-center dark:text-white text-black cursor-pointer rounded-full hover:bg-[#bdbcb968] h-10 w-10 transition-all delay-75 duration-100 ease-in-out"
              onClick={() => handleSidebarToggle()}
            >
              &times;
            </button>
            <CreateReview
              movie={selectedMovie!}
              onSubmit={() => setSubmit(true)}
              groupId={groupId}
            />
          </div>
          <div className="fixed inset-0 bg-black opacity-60"></div>
        </div>
      ) : null}
      <div
        className={`flex flex-row ${
          userRole && userRole === "lider"
            ? "justify-between"
            : "justify-center"
        } items-center w-full pl-5 pr-5`}
      >
        <h2 className="text-4xl">{t("title")}</h2>
        <button
          onClick={() => handleModalToggle()}
          className={`${
            userRole && userRole === "lider" ? "" : "hidden"
          } font-semibold cursor-pointer before:content-['+'] before:mr-1 before:text-[#f5c518] before:text-xl transition-colors delay-75 duration-150 ease-in-out hover:text-[#f5c518]`}
        >
          {t("create-button")}
        </button>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 w-full">
        {groupReviews && groupReviews.length > 0 ? (
          groupReviews.map((review, index) => (
            <MovieReview
              key={index}
              review={review}
              authorized={(userRole && userRole === "lider") || isAdmin}
              onEditDelete={() => setSubmit(true)}
            />
          ))
        ) : (
          <span className="mt-5">{t("no-reviews-msg")}</span>
        )}
      </div>
      <div className={`flex flex-row p-5 items-center`}>
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
  );
}

export function GroupMembersPreview({
  members,
  memberCount,
}: {
  members: GroupMembership[];
  memberCount: { cantidad: number };
}) {
  const t = useTranslations("GroupMembersPreview");
  const params = useParams();

  let parsedCount = memberCount.cantidad;
  let unit = "";
  if (memberCount.cantidad >= 10000 && memberCount.cantidad < 1000000) {
    parsedCount = Math.round((memberCount.cantidad / 1000) * 10) / 10;
    unit = "k";
  } else if (memberCount.cantidad >= 1000000) {
    parsedCount = Math.round((memberCount.cantidad / 1000000) * 10) / 10;
    unit = "m";
  }
  return (
    <div className="flex flex-col col-span-1 items-start mr-0 sm:mr-6 h-full w-full pt-4 bg-[#003566] shadow-2xl rounded-bl-md pb-2 sm:pb-0">
      <div className="flex flex-col mb-2 ml-3">
        <span
          onClick={() => redirect(`/group/${params.id}/members`)}
          className="font-semibold text-xl hover:font-bold cursor-pointer transition-all delay-75 duration-150 ease-in-out hover:text-[#f5c518]"
        >
          {t("title")}
        </span>
        <span className="opacity-60">
          {parsedCount}
          {unit}
        </span>
      </div>
      <div className="flex flex-col gap-2 w-full ml-3">
        {members.map((member, index) =>
          member.rol === "lider" ? (
            <div key={index} className="flex flex-row items-center gap-2 pt-3">
              <Image
                src={`http://localhost:3000${member.urlImagen}`}
                alt="Profile Icon"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-lg font-semibold">{member.nombre}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
