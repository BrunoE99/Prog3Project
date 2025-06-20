import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { Suspense } from "react";
import { getAllGenres } from "../API/genres/route";
import { cookies } from "next/headers";
import { DecodeToken } from "@/actions";
import { Inter } from "next/font/google";
import LoginSuccessHandler from "./(auth)/login/loginHandler";
import SignupSuccessHandler from "./(auth)/signup/signupHandler";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const genres = await getAllGenres();
  const token = (await cookies()).get("auth_token")?.value;

  let userId: number | null = null;

  if (token) {
    try {
      const decoded = DecodeToken(token);
      userId = (await decoded).sub;
    } catch (err) {
      console.error("Failed to decode token: ", err);
    }
  }

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} antialiased min-h-full flex flex-col min-w-full`}
      >
        <NextIntlClientProvider>
          <header>
            <Navbar token={token} userId={userId} allGenres={genres} />
          </header>
          <main className="flex-1 flex flex-col">{children}</main>
          <footer>
            <Footer />
          </footer>

          <Suspense fallback={null}>
            <LoginSuccessHandler />
            <SignupSuccessHandler />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
