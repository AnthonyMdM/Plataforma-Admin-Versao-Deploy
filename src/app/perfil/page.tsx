import { auth } from "@/auth";
import PerfilPage from "@/componentes/views/PerfilPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="w-full">
      <PerfilPage user={session.user} />
    </main>
  );
}
