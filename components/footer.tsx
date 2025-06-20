import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-[#000814] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold mb-2">{t("pages-label")}</h4>
          <ul>
            <li>
              <Link href="/movie">{t("movies-link")}</Link>
            </li>
            <li>
              <Link href="/genres">{t("genres-link")}</Link>
            </li>
            <li>
              <Link href="/groups">{t("groups-link")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">{t("resources-label")}</h4>
          <ul>
            <li>
              <a href="#">{t("contact-link")}</a>
            </li>
            <li>
              <a href="#">{t("report-link")}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
