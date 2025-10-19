"use client";

import Link from "next/link";

export default function VendasPage() {
  return (
    <section className="section md:!w-max *:text-center">
      <h1 className="titulo !text-3xl mb-5">Guias de Vendas:</h1>
      <div className="flex flex-col gap-5 items-center font-poppins text-2xl md:text-3xl font-semibold *:hover:text-blue-800 *:underline *:decoration-2 *:md:no-underline  *:underline-offset-4 *:text-blue-600">
        <Link href={"/vendas/criar"} className="">
          Criar
        </Link>
        <Link href={"/vendas/dinamico"}>Filtro Dinâmico</Link>
        <Link href={"/vendas/intervalo"}>Filtro por Intervalo</Link>
      </div>
    </section>
  );
}
