import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (venda_produto -> venda -> produto -> user)
  await prisma.venda_produto.deleteMany();
  await prisma.venda.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Dados antigos removidos");

  // Criar usuários
  const hashedPassword = await bcrypt.hash("senha123", 10);

  const users = await prisma.user.createMany({
    data: [
      {
        Name: "Admin Silva",
        email: "admin@example.com",
        hashedPassword,
        Role: "ADMINISTRADOR",
      },
      {
        Name: "João Funcionário",
        email: "joao@example.com",
        hashedPassword,
        Role: "FUNCIONARIO",
      },
    ],
  });

  console.log("✅ Usuários criados");

  // Buscar usuários
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });
  const funcionarioUser = await prisma.user.findUnique({
    where: { email: "joao@example.com" },
  });

  // Criar produtos
  const produtosData = [
    // Perecíveis
    { Nome: "Banana Prata", unidadePesagem: "Kg", preco: 599, perecivel: true },
    { Nome: "Tomate", unidadePesagem: "Kg", preco: 899, perecivel: true },
    { Nome: "Alface", unidadePesagem: "Un", preco: 350, perecivel: true },
    {
      Nome: "Leite Integral",
      unidadePesagem: "L",
      preco: 485,
      perecivel: true,
    },
    {
      Nome: "Carne Bovina",
      unidadePesagem: "Kg",
      preco: 3590,
      perecivel: true,
    },
    { Nome: "Frango", unidadePesagem: "Kg", preco: 1890, perecivel: true },
    {
      Nome: "Queijo Minas",
      unidadePesagem: "Kg",
      preco: 4299,
      perecivel: true,
    },
    { Nome: "Pão Francês", unidadePesagem: "Kg", preco: 1250, perecivel: true },

    // Não perecíveis
    {
      Nome: "Arroz Branco",
      unidadePesagem: "Kg",
      preco: 550,
      perecivel: false,
    },
    {
      Nome: "Feijão Preto",
      unidadePesagem: "Kg",
      preco: 780,
      perecivel: false,
    },
    { Nome: "Açúcar", unidadePesagem: "Kg", preco: 420, perecivel: false },
    { Nome: "Café em Pó", unidadePesagem: "Kg", preco: 2890, perecivel: false },
    { Nome: "Óleo de Soja", unidadePesagem: "L", preco: 890, perecivel: false },
    { Nome: "Macarrão", unidadePesagem: "Kg", preco: 650, perecivel: false },
    { Nome: "Sal", unidadePesagem: "Kg", preco: 180, perecivel: false },
    { Nome: "Detergente", unidadePesagem: "Un", preco: 299, perecivel: false },
  ];

  const produtos = await prisma.produto.createMany({ data: produtosData });
  console.log(`✅ ${produtos.count} produtos criados`);

  // Buscar produtos para vendas
  const banana = await prisma.produto.findFirst({
    where: { Nome: "Banana Prata" },
  });
  const tomate = await prisma.produto.findFirst({ where: { Nome: "Tomate" } });
  const arroz = await prisma.produto.findFirst({
    where: { Nome: "Arroz Branco" },
  });
  const feijao = await prisma.produto.findFirst({
    where: { Nome: "Feijão Preto" },
  });
  const carne = await prisma.produto.findFirst({
    where: { Nome: "Carne Bovina" },
  });
  const leite = await prisma.produto.findFirst({
    where: { Nome: "Leite Integral" },
  });

  // Criar vendas
  const vendasData = [
    {
      userId: adminUser.id,
      data: new Date("2025-10-01"),
      produtos: [
        { produto: banana, quantidade: 2 },
        { produto: tomate, quantidade: 1.5 },
        { produto: arroz, quantidade: 2 },
      ],
    },
    {
      userId: funcionarioUser.id,
      data: new Date("2025-10-02"),
      produtos: [
        { produto: carne, quantidade: 2 },
        { produto: feijao, quantidade: 3 },
      ],
    },
    {
      userId: adminUser.id,
      data: new Date("2025-10-05"),
      produtos: [
        { produto: carne, quantidade: 1.5 },
        { produto: leite, quantidade: 10 },
        { produto: banana, quantidade: 5 },
      ],
    },
    {
      userId: funcionarioUser.id,
      data: new Date("2025-10-07"),
      produtos: [
        { produto: arroz, quantidade: 5 },
        { produto: feijao, quantidade: 2 },
        { produto: tomate, quantidade: 1 },
      ],
    },
  ];

  // Inserir vendas e venda_produto
  for (const venda of vendasData) {
    await prisma.venda.create({
      data: {
        userId: venda.userId,
        data: venda.data,
        venda_produto: {
          create: venda.produtos.map((p) => ({
            produtoId: p.produto.id,
            quantidade: p.quantidade,
            preco_unitario: p.produto.preco,
            preco_produto_totaltotal: p.quantidade * p.produto.preco,
          })),
        },
      },
    });
  }

  console.log("✅ Vendas e itens de vendas criados");

  const totalUsers = await prisma.user.count();
  const totalProdutos = await prisma.produto.count();
  const totalVendas = await prisma.venda.count();
  const totalItens = await prisma.venda_produto.count();

  console.log("\n📊 Estatísticas finais:");
  console.log(`   👥 Usuários: ${totalUsers}`);
  console.log(`   📦 Produtos: ${totalProdutos}`);
  console.log(`   💰 Vendas: ${totalVendas}`);
  console.log(`   🛒 Itens vendidos: ${totalItens}`);
  console.log("\n✨ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
