"use server";

import { prisma } from "@/lib/prisma";

export async function getVendasPorAno(ano1?: number) {
  const anoBusca = ano1 ?? new Date().getFullYear();

  const inicio = new Date(anoBusca, 0, 1);
  const fim = new Date(anoBusca, 11, 31, 23, 59, 59);

  const vendas = await prisma.venda.findMany({
    where: {
      data: { gte: inicio, lte: fim },
    },
    orderBy: { data: "asc" },
  });

  return { vendas };
}

export async function getVendasPorIntervalo(data1: Date, data2: Date) {
  const vendas = await prisma.venda.findMany({
    where: {
      data: { gte: data1, lte: data2 },
    },
  });
  console.log(vendas);

  return { vendas };
}

export async function produtosVendidos() {
  const produtos = await prisma.produtosMaisVendidos.findMany({
    orderBy: {
      nome: "asc",
    },
  });
  return { produtos };
}
