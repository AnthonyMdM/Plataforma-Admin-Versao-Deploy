import VendasCreate from "@/componentes/views/vendas/CriaVendaPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Venda",
  description: "Página para criar a venda",
  icons: {
    icon: "/sell.svg",
  },
};

export default async function Page() {

  return (
    <main className="main">
      <VendasCreate  />
    </main>
  );
}
