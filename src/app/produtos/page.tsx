import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function PageProdutos() {
  const produto = await prisma.produto.findMany();

  console.log(produto);
  return (
    <div>
      <ul>
        {produto.map((item) => (
          <li key={item.id}>{item.nome_produto}</li>
        ))}
      </ul>
    </div>
  );
}
