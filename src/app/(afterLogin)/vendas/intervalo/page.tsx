import VendasIntervalo from "@/componentes/views/vendas/IntervaloVendas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitro por Intervalo",
  description: "Página para filtrar as vendas ",
  icons: {
    icon: "/sell.svg",
  },
};
export default function Page() {
  return (
    <main className="main">
      <VendasIntervalo />
    </main>
  );
}
