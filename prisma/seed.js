// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcryptjs");

// const prisma = new PrismaClient();

// async function main() {
//   console.log("🌱 Iniciando seed do banco de dados...");

//   // Limpar dados existentes
//   await prisma.venda_produto.deleteMany();
//   await prisma.venda.deleteMany();
//   await prisma.produto.deleteMany();
//   await prisma.user.deleteMany();

//   console.log("✅ Dados anteriores removidos");

//   // Criar usuários
//   const hashedPassword = await bcrypt.hash("senha123", 10);

//   const users = await prisma.user.createMany({
//     data: [
//       {
//         Name: "Admin Silva",
//         email: "admin@example.com",
//         hashedPassword,
//         Role: "ADMINISTRADOR",
//       },
//       {
//         Name: "João Funcionário",
//         email: "joao@example.com",
//         hashedPassword,
//         Role: "FUNCIONARIO",
//       },
//       {
//         Name: "Maria Desenvolvedora",
//         email: "maria@example.com",
//         hashedPassword,
//         Role: "DESENVOLVEDOR",
//       },
//       {
//         Name: "Carlos Cliente",
//         email: "carlos@example.com",
//         hashedPassword,
//         Role: "CLIENTE",
//       },
//     ],
//   });

//   console.log(`✅ ${users.count} usuários criados`);

//   // Buscar usuários criados
//   const adminUser = await prisma.user.findUnique({
//     where: { email: "admin@example.com" },
//   });

//   const funcionarioUser = await prisma.user.findUnique({
//     where: { email: "joao@example.com" },
//   });

//   // Criar produtos
//   const produtos = await prisma.produto.createMany({
//     data: [
//       // Produtos perecíveis
//       {
//         Nome: "Banana Prata",
//         unidadePesagem: "Kg",
//         preco: 599, // R$ 5,99
//         perecivel: true,
//       },
//       {
//         Nome: "Tomate",
//         unidadePesagem: "Kg",
//         preco: 899, // R$ 8,99
//         perecivel: true,
//       },
//       {
//         Nome: "Alface",
//         unidadePesagem: "Un",
//         preco: 350, // R$ 3,50
//         perecivel: true,
//       },
//       {
//         Nome: "Leite Integral",
//         unidadePesagem: "L",
//         preco: 485, // R$ 4,85
//         perecivel: true,
//       },
//       {
//         Nome: "Carne Bovina",
//         unidadePesagem: "Kg",
//         preco: 3590, // R$ 35,90
//         perecivel: true,
//       },
//       {
//         Nome: "Frango",
//         unidadePesagem: "Kg",
//         preco: 1890, // R$ 18,90
//         perecivel: true,
//       },
//       {
//         Nome: "Queijo Minas",
//         unidadePesagem: "Kg",
//         preco: 4299, // R$ 42,99
//         perecivel: true,
//       },
//       {
//         Nome: "Pão Francês",
//         unidadePesagem: "Kg",
//         preco: 1250, // R$ 12,50
//         perecivel: true,
//       },

//       // Produtos não perecíveis
//       {
//         Nome: "Arroz Branco",
//         unidadePesagem: "Kg",
//         preco: 550, // R$ 5,50
//         perecivel: false,
//       },
//       {
//         Nome: "Feijão Preto",
//         unidadePesagem: "Kg",
//         preco: 780, // R$ 7,80
//         perecivel: false,
//       },
//       {
//         Nome: "Açúcar",
//         unidadePesagem: "Kg",
//         preco: 420, // R$ 4,20
//         perecivel: false,
//       },
//       {
//         Nome: "Café em Pó",
//         unidadePesagem: "Kg",
//         preco: 2890, // R$ 28,90
//         perecivel: false,
//       },
//       {
//         Nome: "Óleo de Soja",
//         unidadePesagem: "L",
//         preco: 890, // R$ 8,90
//         perecivel: false,
//       },
//       {
//         Nome: "Macarrão",
//         unidadePesagem: "Kg",
//         preco: 650, // R$ 6,50
//         perecivel: false,
//       },
//       {
//         Nome: "Sal",
//         unidadePesagem: "Kg",
//         preco: 180, // R$ 1,80
//         perecivel: false,
//       },
//       {
//         Nome: "Detergente",
//         unidadePesagem: "Un",
//         preco: 299, // R$ 2,99
//         perecivel: false,
//       },
//     ],
//   });

//   console.log(`✅ ${produtos.count} produtos criados`);

//   // Buscar produtos para criar vendas
//   const banana = await prisma.produto.findFirst({
//     where: { Nome: "Banana Prata" },
//   });
//   const tomate = await prisma.produto.findFirst({
//     where: { Nome: "Tomate" },
//   });
//   const arroz = await prisma.produto.findFirst({
//     where: { Nome: "Arroz Branco" },
//   });
//   const feijao = await prisma.produto.findFirst({
//     where: { Nome: "Feijão Preto" },
//   });
//   const carne = await prisma.produto.findFirst({
//     where: { Nome: "Carne Bovina" },
//   });
//   const leite = await prisma.produto.findFirst({
//     where: { Nome: "Leite Integral" },
//   });

//   // Criar vendas com produtos
//   // Venda 1 - Admin
//   const venda1 = await prisma.venda.create({
//     data: {
//       userId: adminUser.id,
//       data: new Date("2025-10-01"),
//       venda_produto: {
//         create: [
//           {
//             produtoId: banana.id,
//             quantidade: 2,
//             preco_unitario: 599,
//             preco_produto_totaltotal: 1198,
//           },
//           {
//             produtoId: tomate.id,
//             quantidade: 1.5,
//             preco_unitario: 899,
//             preco_produto_totaltotal: 1349,
//           },
//           {
//             produtoId: arroz.id,
//             quantidade: 2,
//             preco_unitario: 550,
//             preco_produto_totaltotal: 1100,
//           },
//         ],
//       },
//     },
//   });

//   // Venda 2 - Funcionário
//   const venda2 = await prisma.venda.create({
//     data: {
//       userId: funcionarioUser.id,
//       data: new Date("2025-10-02"),
//       venda_produto: {
//         create: [
//           {
//             produtoId: carne.id,
//             quantidade: 2,
//             preco_unitario: 3590,
//             preco_produto_totaltotal: 7180,
//           },
//           {
//             produtoId: feijao.id,
//             quantidade: 3,
//             preco_unitario: 780,
//             preco_produto_totaltotal: 2340,
//           },
//         ],
//       },
//     },
//   });

//   // Venda 3 - Admin (venda maior)
//   const venda3 = await prisma.venda.create({
//     data: {
//       userId: adminUser.id,
//       data: new Date("2025-10-05"),
//       venda_produto: {
//         create: [
//           {
//             produtoId: carne.id,
//             quantidade: 1.5,
//             preco_unitario: 3590,
//             preco_produto_totaltotal: 5385,
//           },
//           {
//             produtoId: leite.id,
//             quantidade: 10,
//             preco_unitario: 485,
//             preco_produto_totaltotal: 4850,
//           },
//           {
//             produtoId: banana.id,
//             quantidade: 5,
//             preco_unitario: 599,
//             preco_produto_totaltotal: 2995,
//           },
//         ],
//       },
//     },
//   });

//   // Venda 4 - Funcionário (venda recente)
//   const venda4 = await prisma.venda.create({
//     data: {
//       userId: funcionarioUser.id,
//       data: new Date("2025-10-07"),
//       venda_produto: {
//         create: [
//           {
//             produtoId: arroz.id,
//             quantidade: 5,
//             preco_unitario: 550,
//             preco_produto_totaltotal: 2750,
//           },
//           {
//             produtoId: feijao.id,
//             quantidade: 2,
//             preco_unitario: 780,
//             preco_produto_totaltotal: 1560,
//           },
//           {
//             produtoId: tomate.id,
//             quantidade: 1,
//             preco_unitario: 899,
//             preco_produto_totaltotal: 899,
//           },
//         ],
//       },
//     },
//   });

//   console.log(`✅ 4 vendas criadas com itens`);

//   // Estatísticas finais
//   const totalUsers = await prisma.user.count();
//   const totalProdutos = await prisma.produto.count();
//   const totalVendas = await prisma.venda.count();
//   const totalItens = await prisma.venda_produto.count();

//   console.log("\n📊 Estatísticas finais:");
//   console.log(`   👥 Usuários: ${totalUsers}`);
//   console.log(`   📦 Produtos: ${totalProdutos}`);
//   console.log(`   💰 Vendas: ${totalVendas}`);
//   console.log(`   🛒 Itens vendidos: ${totalItens}`);
//   console.log("\n✨ Seed concluído com sucesso!");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Erro ao executar seed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
