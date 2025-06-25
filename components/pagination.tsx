"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "./button";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  hasMovies: boolean;
}

export default function Pagination({
  currentPage,
  hasMovies,
}: PaginationProps) {
  const t = useTranslations("Pagination");
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.set("page", pageNumber.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between p-3">
      <div>
        {
          <Button
            text={t("button-prev")}
            onClick={() => page(currentPage - 1)}
            disabled={currentPage <= 0}
          />
        }
      </div>

      <div>
        {t("page-text")} {currentPage + 1}
      </div>

      <div>
        {hasMovies && (
          <Button
            text={t("button-next")}
            onClick={() => page(currentPage + 1)}
          />
        )}
      </div>
    </div>
  );
}
