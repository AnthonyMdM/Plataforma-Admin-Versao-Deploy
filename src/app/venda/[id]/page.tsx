import VendasPage from "@/app/componentes/views/VendasPage";
import { getIdVendas } from "@/app/home/actions";

export async function generateStaticParams() {
  const ids = await getIdVendas();

  return ids.map((venda) => ({
    id: venda.id.toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <VendasPage params={id} />;
}
