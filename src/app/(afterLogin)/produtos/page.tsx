import ProdutoCreate from "@/componentes/views/produto/CreateProduto";
import ProdutoTabel from "@/componentes/views/produto/TabelProduto";

export default async function PageCreate() {
  return (
    <main className="main grid gap-10">
      <ProdutoCreate />
      <ProdutoTabel />
    </main>
  );
}
