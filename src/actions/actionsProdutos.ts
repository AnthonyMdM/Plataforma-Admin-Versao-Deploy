"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const produtoSchema = z.object({
  nome_produto: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  preco: z
    .number()
    .min(0, "Preço deve ser maior ou igual a zero")
    .max(999999.99, "Preço muito alto"),
  perecivel: z.boolean(),
  unidadePesagem: z.string().min(1, "Unidade de pesagem é obrigatória").trim(),
});

export async function createProduto(
  state: { errors: string[] },
  formData: FormData
) {
  try {
    // Extrair e converter dados
    const rawData = {
      nome_produto: formData.get("nome") as string,
      preco: parseFloat(formData.get("preco") as string) || 0,
      perecivel:
        (formData.get("perecivel") as string) === "true" ||
        (formData.get("perecivel") as string) === "on",
      unidadePesagem: formData.get("unidade") as string,
    };

    // Validar dados
    const validatedData = produtoSchema.parse(rawData);

    // Verificar se produto já existe
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
      };
    }

    // Converter preço para centavos
    const precoCentavos = Math.round(validatedData.preco * 100);

    // Criar produto
    const produto = await prisma.produto.create({
      data: {
        nome_produto: validatedData.nome_produto,
        preco: precoCentavos,
        perecivel: validatedData.perecivel,
        unidadePesagem: validatedData.unidadePesagem,
      },
    });

    return {
      produto,
      success: true,
      message: `Produto "${produto.nome_produto}" criado com sucesso!`,
    };
  } catch (error) {
    if (error && typeof error === "object" && "errors" in error) {
      const zodErrors = (error as any).errors;
      if (Array.isArray(zodErrors)) {
        return {
          errors: zodErrors.map(
            (err: any) => `${err.path?.join(".") || "campo"}: ${err.message}`
          ),
          success: false,
        };
      }
    }

    if (error instanceof Error) {
      return { errors: [error.message], success: false };
    }

    return { errors: ["Erro desconhecido"], success: false };
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
  } catch (error: any) {
    return {
      success: false,
    };
  }
}
