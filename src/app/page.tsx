import { redirect } from "next/navigation";

export default function Page() {
  redirect("/perfil");
  return <div></div>;
}
