import VendasCreate from "@/componentes/views/VendasCriarPage";
import { auth } from "@/auth";

export default async function Page() {
  const seasson = await auth();
  return (
    <main className="main">
      <VendasCreate user={seasson?.user} />
    </main>
  );
}
