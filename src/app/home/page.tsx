import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/home/resumo");
  return <div className="w-screen overflow-x-auto h-screen bg-white"></div>;
}
