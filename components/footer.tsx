import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-[#000814] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">{t("pages-label")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/movie" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t("movies-link")}
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t("genres-link")}
                </Link>
              </li>
              <li>
                <Link href="/group" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t("groups-link")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Acerca de nosotros</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t("about-text-1")}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t("about-text-2")}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {t("copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}