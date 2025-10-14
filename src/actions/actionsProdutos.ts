"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Produto, ProdutosMaisVendidos as ProdutoMais } from "@prisma/client";
import { FormState } from "@/types/tyeps-global";

const produtoSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .transform((val) => val.toLowerCase()),

  preco: z
    .string()
    .min(1, "Preço é obrigatório")
    .transform((val) => Number(val.replace(",", ".")))
    .refine((num) => !isNaN(num), {
      message: "Preço deve ser um número",
    }),

  unidade_value: z
    .string()
    .min(1, "Unidade de medida é obrigatória")
    .min(1, "Selecione uma unidade de medida"),

  perecivel: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "on"),
});

function handlePrismaError(error: any): string {
  const errorMap: Record<string, string> = {
    P2002: "Este produto já existe no sistema",
    P1001: "Erro de conexão com banco de dados",
    P2025: "Produto não encontrado",
    P2003: "Erro de referência - produto pode estar sendo usado",
  };

  return errorMap[error.code] || "Erro interno do banco de dados";
}

export async function createProduto(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      nome: formData.get("nome"),
      preco: formData.get("preco"),
      unidade_value: formData.get("unidade_value"),
      perecivel: formData.get("perecivel"),
    };

    const validatedData = produtoSchema.parse(rawData);

    const produtoExistente = await prisma.produto.findFirst({
      where: { Nome: validatedData.nome },
      select: { id: true },
    });

    if (produtoExistente) {
      return {
        success: false,
        errors: [`Produto "${validatedData.nome}" já existe`],
      };
    }
    const precoCentavos = Math.round(validatedData.preco * 100);

    const produto = await prisma.produto.create({
      data: {
        Nome: validatedData.nome,
        preco: precoCentavos,
        perecivel: validatedData.perecivel,
        unidadePesagem: validatedData.unidade_value,
      },
      select: {
        id: true,
        Nome: true,
        preco: true,
      },
    });

    revalidatePath("/produtos");

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error("Erro ao criar produto:", error);

    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => {
        const fieldMap: Record<string, string> = {
          nome: "Nome do produto",
          preco: "Preço",
          unidade_value: "Unidade de medida",
          perecivel: "Produto perecível",
        };

        const fieldName =
          fieldMap[issue.path[0] as string] || issue.path.join(".");
        return `${fieldName}: ${issue.message}`;
      });

      return {
        success: false,
        errors,
      };
    }

    if (error && typeof error === "object" && "code" in error) {
      return {
        success: false,
        errors: [handlePrismaError(error)],
      };
    }

    return {
      success: false,
      errors: ["Erro interno. Tente novamente em alguns instantes."],
    };
  }
}

export async function getProdutos(): Promise<FormState<Produto[]>> {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { Nome: "asc" },
      select: {
        id: true,
        Nome: true,
        preco: true,
        perecivel: true,
        unidadePesagem: true,
      },
    });

    const produtosFormatados = produtos.map((produto) => ({
      ...produto,
      precoReal: produto.preco / 100,
    }));

    return {
      success: true,
      errors: [],
      data: produtosFormatados,
    };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);

    return {
      success: false,
      errors: ["Erro ao carregar produtos"],
    };
  }
}

export async function deleteProduto(id: number): Promise<FormState> {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
      select: { Nome: true },
    });

    if (!produto) {
      return {
        success: false,
        errors: ["Produto não encontrado"],
      };
    }

    await prisma.produto.delete({
      where: { id },
    });

    revalidatePath("/produtos");

    return {
      success: true,
      errors: [],
      data: { deletedName: produto.Nome },
    };
  } catch (error) {
    console.error("Erro ao deletar produto:", error);

    if (error && typeof error === "object" && "code" in error) {
      return {
        success: false,
        errors: [handlePrismaError(error)],
      };
    }

    return {
      success: false,
      errors: ["Erro ao deletar produto"],
    };
  }
}

// export async function updateProduto(
//   id: number,
//   prevState: any,
//   formData: FormData
// ): Promise<FormState> {
//   try {
//     const rawData = {
//       nome: formData.get("nome"),
//       preco: formData.get("preco"),
//       unidade_value: formData.get("unidade_value"),
//       perecivel: formData.get("perecivel"),
//     };

//     const validatedData = produtoSchema.parse(rawData);

//     const produtoExistente = await prisma.produto.findFirst({
//       where: {
//         Nome: validatedData.nome,
//         NOT: { id },
//       },
//       select: { id: true },
//     });

//     if (produtoExistente) {
//       return {
//         success: false,
//         errors: [`Já existe outro produto com o nome "${validatedData.nome}"`],
//       };
//     }

//     const precoCentavos = Math.round(validatedData.preco * 100);

//     const produto = await prisma.produto.update({
//       where: { id },
//       data: {
//         Nome: validatedData.nome,
//         preco: precoCentavos,
//         perecivel: validatedData.perecivel,
//         unidadePesagem: validatedData.unidade_value,
//       },
//       select: {
//         id: true,
//         Nome: true,
//         preco: true,
//       },
//     });

//     revalidatePath("/produtos");

//     return {
//       success: true,
//       errors: [],
//       data: produto,
//     };
//   } catch (error) {
//     console.error("Erro ao atualizar produto:", error);

//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         errors: error.issues.map((issue) => issue.message),
//       };
//     }

//     if (error && typeof error === "object" && "code" in error) {
//       return {
//         success: false,
//         errors: [handlePrismaError(error)],
//       };
//     }

//     return {
//       success: false,
//       errors: ["Erro ao atualizar produto"],
//     };
//   }
// }

export async function getProdutosMaisVendidos(): Promise<
  FormState<ProdutoMais[]>
> {
  try {
    const produtos = await prisma.produtosMaisVendidos.findMany({
      orderBy: { nome: "asc" },
    });

    return {
      errors: [],
      success: true,
      data: produtos,
    };
  } catch (e) {
    return {
      success: false,
      errors: ["Erro ao buscar produtos mais vendidos"],
    };
  }
}
