import Link from "next/link";

export default async function Page() {
  return (
    <div className="w-full overflow-x-auto h-full bg-white">
      <nav className="bg-black py-1 pl-5 flex *:text-white justify-around font-poppins">
        <div className="flex gap-2">
          <h1>Vendas:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/perfil/filtro"}>Filtro Dinâmico</Link>
            <Link href={"/perfil/intervalo"}>Filtro por Intervalo</Link>
          </div>
        </div>
        <div className="flex gap-3 ">
          <h1>Produtos:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/perfil/produtos"}>Todos os Produtos</Link>
            <Link href={"/perfil/produtos/create"}>Criar Produtos</Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
