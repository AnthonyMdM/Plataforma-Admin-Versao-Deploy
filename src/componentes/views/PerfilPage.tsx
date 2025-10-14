"use client";
import Link from "next/link";
import React from "react";
import { PerfilPageProps } from "@/types/tyeps-global";


export default function PerfilPage({ user }: PerfilPageProps) {
  return (
    <div className="w-full overflow-x-auto h-full bg-white">
      <nav className="bg-black py-1 pl-5 flex *:text-white justify-around font-poppins">
        <div className="flex gap-2">
          <h1>Vendas:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/vendas/criar"}>Criar Venda</Link>
            <Link href={"/vendas/filtro"}>Filtro Dinâmico</Link>
            <Link href={"/vendas/intervalo"}>Filtro por Intervalo</Link>
          </div>
        </div>
        <div className="flex gap-3 ">
          <h1>Produtos:</h1>
          <div className="flex gap-3 *:hover:opacity-80">
            <Link href={"/produtos"}>Todos os Produtos</Link>
            <Link href={"/criarProduto"}>Criar Produtos</Link>
          </div>
        </div>
      </nav>
      {user && (
        <section className="mt-5 ml-8 *:mb-3">
          <h1 className="flex flex-col sm:flex-row md:gap-2 text-3xl sm:text-4xl md:text-5xl font-roboto w-max justify-start font-semibold">
            <p>Bem Vindo:</p> <span>{user.name}</span>
          </h1>
          <div className="flex-col text-xl sm:text-2xl md:text-3xl font-roboto">
            <p>Seu email é:</p>
            <span className="ml-5">{user.email}</span>
          </div>
          <div className="flex-col  text-xl sm:text-2xl md:text-3xl font-roboto">
            <p>Seu Cargo é de:</p>
            <span className="ml-5">{user.email}</span>
          </div>
        </section>
      )}
    </div>
  );
}
