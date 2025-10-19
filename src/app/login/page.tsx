import PageLogin from "@/componentes/views/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Página para realizar o login",
  icons: {
    icon: "/account.svg",
  },
};

export default async function Page() {
  return <PageLogin />;
}
