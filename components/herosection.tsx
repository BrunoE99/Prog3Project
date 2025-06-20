import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  return (
    // Add background image
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">{t("title")}</h1>
        <p className="text-xl mb-4">{t("subtitle")}</p>
        {/* <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-lg rounded">All Reviews</button> */}
      </div>
    </section>
  );
}
