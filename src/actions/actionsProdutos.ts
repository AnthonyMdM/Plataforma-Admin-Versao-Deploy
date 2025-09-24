"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const produtoSchema = z.object({
  nome_produto: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .refine((val) => val.length > 2, "Nome deve ter pelo menos 3 caracteres"),
  preco: z
    .number()
    .min(0.01, "Preço deve ser maior que zero")
    .max(999999.99, "Preço muito alto")
    .refine((val) => Number.isFinite(val), "Preço deve ser um número válido"),
  perecivel: z.boolean(),
  unidadePesagem: z
    .string()
    .min(1, "Unidade de pesagem é obrigatória")
    .trim()
    .refine((val) => val !== "", "Unidade de pesagem não pode estar vazia"),
});

export type FormState = {
  errors: string[];
  success: boolean;
  message?: string;
};

export async function createProduto(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const nome = formData.get("nome");
    const preco = formData.get("preco");
    const unidade = formData.get("unidade");

    if (!nome || !preco || !unidade) {
      return {
        errors: ["Todos os campos obrigatórios devem ser preenchidos"],
        success: false,
        message: "Dados incompletos",
      };
    }

    const rawData = {
      nome_produto: nome as string,
      preco: parseFloat(preco as string),
      perecivel:
        (formData.get("perecivel") as string) === "true" ||
        (formData.get("perecivel") as string) === "on",
      unidadePesagem: unidade as string,
    };

    if (isNaN(rawData.preco)) {
      return {
        errors: ["Preço deve ser um número válido"],
        success: false,
        message: "Preço inválido",
      };
    }

    const validatedData = produtoSchema.parse(rawData);

    const produtoExistente = await prisma.produto.findFirst({
      where: {
        nome_produto: {
          equals: validatedData.nome_produto,
        },
      },
    });

    if (produtoExistente) {
      return {
        errors: [`Produto "${validatedData.nome_produto}" já existe`],
        success: false,
        message: "Produto duplicado",
      };
    }

    const precoCentavos = Math.round(validatedData.preco * 100);

    const produto = await prisma.produto.create({
      data: {
        nome_produto: validatedData.nome_produto,
        preco: precoCentavos,
        perecivel: validatedData.perecivel,
        unidadePesagem: validatedData.unidadePesagem,
      },
    });

    return {
      errors: [],
      success: true,
      message: `Produto "${produto.nome_produto}" criado com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao criar produto:", error);

    if (error instanceof z.ZodError) {
      return {
        errors: error.issues.map((err) => {
          const field = err.path.join(".");
          return `${field}: ${err.message}`;
        }),
        success: false,
        message: "Dados inválidos",
      };
    }

    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as any;

      if (prismaError.code === "P2002") {
        return {
          errors: ["Este produto já existe no sistema"],
          success: false,
          message: "Produto duplicado",
        };
      }

      if (prismaError.code === "P1001") {
        return {
          errors: ["Erro de conexão com o banco de dados"],
          success: false,
          message: "Erro de conexão",
        };
      }
    }

    if (error instanceof Error) {
      return {
        errors: [error.message],
        success: false,
        message: "Erro interno",
      };
    }

    return {
      errors: ["Erro desconhecido ao criar produto"],
      success: false,
      message: "Erro interno",
    };
  }
}
export async function produtosVendidos() {
  const produtos = await prisma.produtosMaisVendidos.findMany({
    orderBy: {
      nome: "asc",
    },
  });
  return { produtos };
}

export async function getProdutos() {
  const produtos = await prisma.produto.findMany({
    orderBy: {
      nome_produto: "asc",
    },
  });
  return { produtos };
}

export async function deleteProduto(id: number) {
  try {
    const produto = await prisma.produto.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
    };
  }
}
