"use server";

import { prisma } from "@/lib/prisma";

export async function getVendasPorAno(ano?: number) {
  const anoBusca = ano ?? new Date().getFullYear();

  const inicio = new Date(anoBusca, 0, 1);
  const fim = new Date(anoBusca, 11, 31, 23, 59, 59);

  const vendas = await prisma.venda.findMany({
    where: {
      data: { gte: inicio, lte: fim },
    },
    orderBy: { data: "asc" },
  });

  const datasFiltro = vendas.reduce((acc, venda) => {
    const d = new Date(venda.data);
    const mes = d.getMonth() + 1;
    const dia = d.getDate();

    if (!acc[mes]) acc[mes] = new Set();
    acc[mes].add(dia);

    return acc;
  }, {} as Record<number, Set<number>>);

  const filtros = Object.entries(datasFiltro).map(([mes, dias]) => ({
    mes: Number(mes),
    dias: Array.from(dias),
  }));

  return { vendas, filtros };
}
