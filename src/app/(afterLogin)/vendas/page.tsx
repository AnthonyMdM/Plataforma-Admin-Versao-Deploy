import VendasPage from "@/componentes/views/vendas/PageVendas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guias Vendas",
  description: "Páginas para as guias de vendas",
  icons: {
    icon: "/sell.svg",
  },
};

export default function PageVendas() {
  return (
    <main className="main !place-items-center md:justify-center">
      <VendasPage />
    </main>
  );
}
