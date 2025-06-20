"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import SearchBar from "./searchBar";
import { logOut } from "@/app/[locale]/(auth)/actions";
import { useTranslations } from "next-intl";

interface Genre {
  id: number;
  nombre: string;
}

export default function Navbar({
  token,
  userId,
  allGenres,
}: {
  token?: string | null;
  userId?: number | null;
  allGenres: Genre[];
}) {
  const t = useTranslations("Navbar");
  const [isNavOpen, setOpen] = useState(false);
  const [isProfileOpen, profOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGenresOpen, setGenresOpen] = useState(false);
  const [genresTimeoutId, setGenresTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  const clicked = () => redirect("/profile/" + userId);

  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const session = token;

    if (session) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const hamburguerHandler = () => {
    setOpen((prev) => !prev);
    profOpen(false);
    setGenresOpen(false);
  };

  const profileHandler = () => {
    profOpen((prev) => !prev);
    setOpen(false);
    setGenresOpen(false);
  };

  const genresHandler = () => {
    setGenresOpen((prev) => !prev);
    profOpen(false);
  };

  const handleGenresMouseEnter = () => {
    if (genresTimeoutId) {
      clearTimeout(genresTimeoutId);
      setGenresTimeoutId(null);
    }
    setGenresOpen(true);
  };

  const handleGenresMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      setGenresOpen(false);
    }, 150);
    setGenresTimeoutId(timeoutId);
  };

  return (
    <nav className="relative bg-[#000814] text-white">
      <div className="lg:hidden p-5 flex gap-3 justify-between">
        <button
          className="space-y-2"
          onClick={hamburguerHandler}
          aria-label="Toggle hamburger menu"
          aria-expanded={isNavOpen}
        >
          <span className="block h-0.5 w-8 bg-gray-600"></span>
          <span className="block h-0.5 w-8 bg-gray-600"></span>
          <span className="block h-0.5 w-8 bg-gray-600"></span>
        </button>
        <SearchBar />
        <button
          className="space-y-2"
          onClick={profileHandler}
          aria-label="Toggle profile menu"
          aria-expanded={isProfileOpen}
        >
          <Image
            src="/profile-white.svg"
            alt="profile image"
            width={40}
            height={40}
          />
        </button>
      </div>

      {/* Mobile view */}
      <div
        className={`${isNavOpen ? "flex" : "hidden"} bg-[#010f24] lg:hidden`}
      >
        <ul role="menu" className="flex flex-col px-5 gap-4 py-3">
          <li role="menuitem">
            <Link href="/" className="hover:bg-[#041b3d]">
              {t("home-link")}
            </Link>
          </li>
          <li role="menuitem">
            <Link href="/movie" className="hover:bg-[#041b3d]">
              {t("movies-link")}
            </Link>
          </li>
          <li role="menuitem" className="relative">
            <button
              onClick={genresHandler}
              className="hover:bg-[#041b3d] block p-2 rounded w-full text-left flex justify-between items-center"
            >
              {t("genres-button")}
              <span
                className={`transform transition-transform duration-200 ${
                  isGenresOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {isGenresOpen && (
              <ul className="mt-2 ml-4 space-y-1 bg-[#001225] rounded p-2">
                <li>
                  <Link
                    href="/genres"
                    className="hover:bg-[#041b3d] block p-2 rounded text-sm transition-colors"
                    onClick={() => {
                      setOpen(false);
                      setGenresOpen(false);
                    }}
                  >
                    {t("all-genres-link")}
                  </Link>
                </li>
                {allGenres.map((genre) => (
                  <li key={genre.id}>
                    <Link
                      href={`/genres/${encodeURIComponent(genre.nombre)}`}
                      className="hover:bg-[#041b3d] block p-2 rounded text-sm transition-colors"
                      onClick={() => {
                        setOpen(false);
                        setGenresOpen(false);
                      }}
                    >
                      {genre.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li role="menuitem">
            <Link href="/group" className="hover:bg-[#041b3d]">
              {t("groups-link")}
            </Link>
          </li>
          {/* <li role="menuitem">
            <Link href="/about" className="hover:bg-[#041b3d]">
              About
            </Link>
          </li> */}
        </ul>
      </div>

      {!isAuthPage &&
        (isLoggedIn ? (
          <div
            className={`${
              isProfileOpen ? "flex" : "hidden"
            } grid grid-column bg-[#010f24] lg:hidden justify-end`}
          >
            <form action={logOut}>
              <button
                type="submit"
                className="hover:bg-[#041b3d] px-5 gap-4 py-3"
              >
                {t("logout-button")}
              </button>
            </form>
            <button onClick={clicked} className="mb-2">
              {t("profile-button")}
            </button>
          </div>
        ) : (
          <div
            className={`${
              isProfileOpen ? "flex" : "hidden"
            } bg-[#010f24] lg:hidden justify-end`}
          >
            <ul role="menu" className="flex flex-col px-5 gap-4 py-3 ">
              <li role="menuitem">
                <Link href="/login" className="hover:bg-[#041b3d]">
                  Log in
                </Link>
              </li>
              <li role="menuitem">
                <Link href="/signup" className="hover:bg-[#041b3d]">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        ))}

      {/* Desktop view */}
      <div className="hidden lg:grid grid-cols-3 items-center px-6 py-4 bg-[#000814] text-white shadow">
        <div className="flex gap-4">
          <Link href="/" className="hover:bg-[#041b3d] p-1 rounded">
            {t("home-link")}
          </Link>
          <Link href="/movie" className="hover:bg-[#041b3d] p-1 rounded">
            {t("movies-link")}
          </Link>
          {/* Genres dropdown for desktop */}
          <div
            className="relative"
            onMouseEnter={handleGenresMouseEnter}
            onMouseLeave={handleGenresMouseLeave}
          >
            <Link
              href="/genres"
              className="hover:bg-[#041b3d] p-1 rounded flex items-center gap-1"
            >
              {t("genres-button")}
              <span
                className={`text-xs transform transition-transform ${
                  isGenresOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </Link>

            {isGenresOpen && (
              <div className="absolute top-full left-0 bg-[#010f24] border border-[#041b3d] rounded-md shadow-lg z-50 min-w-48">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/genres"
                      className="block px-4 py-2 hover:bg-[#041b3d] text-sm"
                    >
                      {t("all-genres-link")}
                    </Link>
                  </li>
                  {allGenres.map((genre) => (
                    <li key={genre.id}>
                      <Link
                        href={`/genres/${encodeURIComponent(genre.nombre)}`}
                        className="block px-4 py-2 hover:bg-[#041b3d] text-sm"
                      >
                        {genre.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link href="/group" className="hover:bg-[#041b3d] p-1">
            {t("groups-link")}
          </Link>
          {/* <Link href="/about" className="hover:bg-[#041b3d] p-1 rounded">About</Link> */}
        </div>

        <div className="justify-self-center">
          <SearchBar />
        </div>

        <div className="justify-self-end">
          {isLoggedIn ? (
            <div className="flex">
              <form action={logOut}>
                <button
                  type="submit"
                  className="hover:bg-[#041b3d] p-1 rounded mr-3"
                >
                  {t("logout-button")}
                </button>
              </form>
              <button onClick={clicked}>
                <Image
                  src="/profile-white.svg"
                  alt="profile image"
                  width={30}
                  height={30}
                />
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex gap-4">
                <Link href="/login" className="hover:bg-[#041b3d] p-1 rounded">
                  {t("login-link")}
                </Link>
                <Link href="/signup" className="hover:bg-[#041b3d] p-1 rounded">
                  {t("signup-link")}
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
