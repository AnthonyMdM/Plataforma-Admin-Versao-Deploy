import { auth } from "@/auth";
import PerfilPage from "@/componentes/views/PerfilPage";

export default async function Page() {
  const seasson = await auth();
  return (
    <>
      <PerfilPage user={seasson?.user} />
    </>
  );
}
