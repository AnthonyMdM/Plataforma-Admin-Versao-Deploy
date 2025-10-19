import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "@/app/global.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Administração",
  description: "Meu Site Para administrar vendas",
  icons: {
    icon: "/book.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-Br">
      <body
        className={`${poppins.variable} ${roboto.variable} flex h-screen overflow `}
      >
        <>{children}</>
      </body>
    </html>
  );
}
