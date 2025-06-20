import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");
  return (
    <div className="flex flex-row justify-center gap-0.5 md:gap-2 items-center text-center h-full mx-auto">
      <span className="text-3xl md:text-6xl p-2">404</span>
      <span className="p-2">{t("not-found-msg")}</span>
    </div>
  );
}
