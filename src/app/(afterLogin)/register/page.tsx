import PageRegister from "@/componentes/views/RegisterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registra Usuário",
  description: "Página para criar novos Usuários",
  icons: {
    icon: "/registrar.svg",
  },
};
export default async function Page() {
  return (
    <main className="main">
      <PageRegister />
    </main>
  );
}
