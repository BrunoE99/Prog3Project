import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} antialiased flex flex-col min-h-screen`}>
      {children}
    </div>
  );
}