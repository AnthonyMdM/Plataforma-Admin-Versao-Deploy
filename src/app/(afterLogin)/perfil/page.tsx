import PerfilPage from "@/componentes/views/PerfilPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Meu Site Para administrar vendas",
  icons: {
    icon: "/account.svg",
  },
};

export default async function Page() {
  return (
    <main className="main">
      <PerfilPage />
    </main>
  );
}
