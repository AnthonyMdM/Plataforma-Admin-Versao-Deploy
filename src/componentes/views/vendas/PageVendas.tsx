"use client";

import Link from "next/link";

export default function VendasPage() {
  return (
    <section className="section !w-max">
      <h1 className="titulo mb-5">Guias de Vendas:</h1>
      <div className="flex flex-col gap-5 items-center font-poppins text-3xl font-semibold *:hover:text-blue-800">
        <Link href={"/vendas/criar"}>Criar</Link>
        <Link href={"/vendas/dinamico"}>Filtro Dinâmico</Link>
        <Link href={"/vendas/intervalo"}>Filtro por Intervalo</Link>
      </div>
    </section>
  );
}
