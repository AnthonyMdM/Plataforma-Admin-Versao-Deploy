import VendasCreate from "@/componentes/views/VendasCriarPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="main">
      <VendasCreate user={session.user} />
    </main>
  );
}
