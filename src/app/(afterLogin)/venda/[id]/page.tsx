import { getIdVendas } from "@/actions/actionsVendas";
import VendasPageUnit from "@/componentes/views/vendas/UnitVendaPage";

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

  return <VendasPageUnit params={id} />;
}
