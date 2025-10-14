import { auth } from "@/auth";
import PerfilPage from "@/componentes/views/PerfilPage";

export default async function Page() {
  const seasson = await auth();
  return (
    <main className="w-full">
      <PerfilPage user={seasson?.user} />
    </main>
  );
}
