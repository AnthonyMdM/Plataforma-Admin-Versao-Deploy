import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function hashPassword(password) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  const users = [
    {
      name: "Anthony Mariano",
      email: "anthony@example1.com",
      password: "senha123",
      role: "admin",
    },
    {
      name: "Maria Silva",
      email: "maria@example.com",
      password: "maria456",
      role: "user",
    },
    {
      name: "João Souza",
      email: "joao@example.com",
      password: "joao789",
      role: "user",
    },
  ];

  // Criar usuários com senhas hasheadas
  for (const u of users) {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: u.email },
    });

    if (existingUser) {
      console.log(`Usuário ${u.email} já existe, pulando...`);
      continue;
    }

    // Hash da senha
    const hashedPassword = await hashPassword(u.password);

    await prisma.user.create({
      data: {
        Name: u.name,
        email: u.email,
        hashedPassword: hashedPassword,
        Role: u.role,
      },
    });

    console.log(`Usuário ${u.name} criado com sucesso!`);
  }

  // Buscar usuários criados para associar às vendas
  const createdUsers = await prisma.user.findMany();

  if (createdUsers.length === 0) {
    console.log(
      "Nenhum usuário encontrado. Certifique-se de que os usuários foram criados."
    );
    return;
  }

  // Dados de vendas para seed
  const vendas = [
    {
      userId: createdUsers[0].id, // Anthony (admin)
      data: new Date("2023-01-15T10:30:00"),
    },
    {
      userId: createdUsers[0].id, // Anthony (admin)
      data: new Date("2023-01-20T14:45:00"),
    },
    {
      userId: createdUsers[1].id, // Maria
      data: new Date("2023-02-05T09:15:00"),
    },
    {
      userId: createdUsers[1].id, // Maria
      data: new Date("2023-02-12T16:20:00"),
    },
    {
      userId: createdUsers[2].id, // João
      data: new Date("2023-02-18T11:00:00"),
    },
    {
      userId: createdUsers[1].id, // Maria
      data: new Date("2023-03-01T13:30:00"),
    },
    {
      userId: createdUsers[0].id, // Anthony
      data: new Date("2023-03-08T08:45:00"),
    },
    {
      userId: createdUsers[2].id, // João
      data: new Date("2023-03-15T17:10:00"),
    },
    {
      userId: createdUsers[1].id, // Maria
      data: new Date("2022-03-22T12:25:00"),
    },
  ];

  // Criar vendas
  for (const venda of vendas) {
    // Verificar se já existe uma venda com os mesmos dados
    const existingVenda = await prisma.venda.findFirst({
      where: {
        userId: venda.userId,
        data: venda.data,
      },
    });

    if (existingVenda) {
      console.log(
        `Venda de ${venda.data.toLocaleDateString()} já existe, pulando...`
      );
      continue;
    }

    const createdVenda = await prisma.venda.create({
      data: venda,
    });

    const user = createdUsers.find((u) => u.id === venda.userId);
    console.log(
      `Venda criada: ID ${createdVenda.id} - ${
        user?.Name
      } - ${venda.data.toLocaleDateString()}`
    );
  }

  console.log("Seed completa!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
