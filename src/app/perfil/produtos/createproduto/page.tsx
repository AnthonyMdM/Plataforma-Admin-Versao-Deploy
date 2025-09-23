import ProdutoCreate from "@/app/componentes/produto/CreateProduto";

export default function PageCreate() {
  return (
    <div className="w-full h-full bg-gray-50 text-black overflow-auto ">
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center lg:items-stretch">
        <ProdutoCreate />
      </main>
    </div>
  );
}
