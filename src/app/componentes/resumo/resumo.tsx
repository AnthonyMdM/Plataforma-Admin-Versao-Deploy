import { prisma } from "@/lib/prisma";

export default async function test() {
  const anosDisponiveis = await prisma.venda.groupBy({
    by: ["data"],
    orderBy: { data: "asc" },
  });

  const anos = [
    ...new Set(anosDisponiveis.map((v) => v.data.getFullYear())),
  ].sort((a, b) => b - a);
  console.log(anos);
  return <div></div>;
}
