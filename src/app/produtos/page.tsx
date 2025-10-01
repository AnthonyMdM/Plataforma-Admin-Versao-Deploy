import ProdutoCreate from "@/componentes/produto/CreateProduto";
import ProdutoTabel from "@/componentes/produto/TabelProduto";

export default async function PageCreate() {
  return (
    <main className="main grid gap-10">
      <ProdutoCreate />
      <ProdutoTabel />
    </main>
  );
}
