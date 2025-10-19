import ProdutoCreate from "@/componentes/views/produto/CreateProduto";
import ProdutoTabel from "@/componentes/views/produto/TabelProduto";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos/Criar",
  description: "Página para Produtos",
  icons: {
    icon: "/product.svg",
  },
};
export default async function PageCreate() {
  return (
    <main className="main grid gap-10">
      <ProdutoCreate />
      <ProdutoTabel />
    </main>
  );
}
