import { Inter } from "next/font/google";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} antialiased min-h-screen flex flex-col items-center justify-center`}>
      {children}
    </div>
  );
}