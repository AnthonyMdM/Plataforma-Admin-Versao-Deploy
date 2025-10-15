"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FormState } from "@/types/tyeps-global";
import z, { number } from "zod";

const vendaSchema = z
  .object({
    idUser: z.string().min(1, "Usuário precisa estar logado"),
    idLocal: z.string().min(1, "Sessão inválida"),
    preco_total: z.coerce
      .number()
      .positive("O preço total deve ser maior que zero"),
    itens: z
      .array(
        z.object({
          produtoId: z.coerce.number().positive("ID do produto inválido"),
          quantidade: z.coerce
            .number()
            .positive("Quantidade deve ser maior que zero"),
          preco_unitario: z.coerce
            .number()
            .positive("Preço deve ser maior que zero"),
        })
      )
      .min(1, "Adicione pelo menos um item"),
  })
  .refine((data) => data.idUser === data.idLocal, {
    message: "Usuário não corresponde à sessão",
    path: ["idUser"],
  });

export async function createVenda(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        errors: ["Você precisa estar logado para criar uma venda"],
      };
    }

    const idLocal = session.user.id.toString();

    const idUser = formData.get("idUser");
    const preco_total = formData.get("precoTotal");

    const itensArray: Array<{
      produtoId: string;
      quantidade: string;
      preco_unitario: string;
    }> = [];

    let index = 0;
    while (formData.has(`itens[${index}][produtoId]`)) {
      const produtoId = formData.get(`itens[${index}][produtoId]`);
      const quantidade = Number(
        (formData.get(`itens[${index}][quantidade]`) as string).replace(
          ",",
          "."
        )
      );
      const preco_unitario = formData.get(`itens[${index}][preco_unitario]`);

      if (produtoId && quantidade && preco_unitario) {
        itensArray.push({
          produtoId: produtoId.toString(),
          quantidade: quantidade.toString(),
          preco_unitario: preco_unitario.toString(),
        });
      }

      index++;
    }

    const validation = vendaSchema.safeParse({
      idUser,
      idLocal,
      preco_total,
      itens: itensArray,
    });

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.issues.map((issue) => issue.message),
      };
    }

    const validData = validation.data;

    const venda = await prisma.venda.create({
      data: {
        userId: Number(validData.idUser),
        venda_produto: {
          create: validData.itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco_unitario: Math.round(item.preco_unitario * 100),
            preco_produto_totaltotal:
              Math.round(item.preco_unitario * 100) * item.quantidade,
          })),
        },
      },
      include: {
        venda_produto: true,
      },
    });

    return {
      success: true,
      errors: [],
    };
  } catch (error: unknown) {
    console.error("Erro ao criar venda:", error);

    let message = "Erro interno. Tente novamente em alguns instantes.";

    if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      errors: [message],
    };
  }
}

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

export async function getVendas(idVendas: number, page: number, pageSize = 5) {
  const vendas = await prisma.vendas_telas.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { data: "desc" },
    where: {
      id: { equals: idVendas },
    },
  });

  const total = await prisma.vendas_telas.count({
    where: {
      id: { equals: idVendas },
    },
  });

  return {
    vendas,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getIdVendas() {
  const vendas = await prisma.venda.findMany({
    select: { id: true },
  });

  return vendas;
}

export async function getVendasUserId(id: number) {
  const vendas = await prisma.venda.findMany({
    where: {
      userId: { equals: id },
    },
  });

  return { vendas };
}
