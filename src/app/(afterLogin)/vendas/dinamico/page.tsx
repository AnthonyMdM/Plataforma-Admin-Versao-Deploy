import VendasDinamico from "@/componentes/views/vendas/DinamicoVendas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitro Dinâmico",
  description: "Página para filtrar as vendas ",
  icons: {
    icon: "/sell.svg",
  },
};

export default function Page() {
  return (
    <main className="main">
      <VendasDinamico />
    </main>
  );
}
