import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import LoginSuccessHandler from "./(auth)/login/loginHandler";
import { cookies } from "next/headers";
import { DecodeToken } from "@/actions";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Review App",
  description:
    "Meet people with similar interests and review your favorite moviews.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-full flex flex-col min-w-full`}
      >
        <header>
          <Navbar token={token} userId={userId} />
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer>
          <Footer />
        </footer>

        <Suspense fallback={null}>
          <LoginSuccessHandler />
        </Suspense>
      </body>
    </html>
  );
}
