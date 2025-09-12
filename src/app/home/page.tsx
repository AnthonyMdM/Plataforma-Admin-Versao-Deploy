import Link from "next/link";

export default async function Page() {
  return (
    <div className="w-full overflow-x-auto h-full bg-white">
      <nav className="">
        <div className="font-roboto text-white text-lg flex *:[&_h1]:pl-2 *:[&_h1]:w-[50vw] [&_div]:[&_div]:border-1 [&_div]:[&_div]:border-l-0 [&_div]:[&_div]:border-black">
          <div className="[&_h1]:bg-black">
            <h1>Vendas:</h1>
            <div className="flex py-1 *:py-2 *:first:ml-10  text-black [&_a]:hover:text-blue-700 [&_a]:px-2 [&_a]:w-max [&_a]:block">
              <Link href={"/home/filtro"} className="">
                Filtro Dinâmico
              </Link>
              <Link href={"/home/intervalo"} className="w-max block">
                Filtro por Intervalo
              </Link>
            </div>
          </div>
          <div className="[&_h1]:bg-black">
            <h1>Produtos:</h1>
            <div className="flex *:hover:scale-95 *:first:ml-10  py-1 *:py-2 text-black *:hover:bg-black [&_a]:hover:text-white [&_a]:px-2">
              <Link
                href={"/home/produtos"}
                className="py-1 rounded transition-colors w-max block"
              >
                Todos os Produtos
              </Link>
              <Link
                href={"/home/produtos/create"}
                className="py-1 rounded transition-colors w-max block"
              >
                Criar Produtos
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
