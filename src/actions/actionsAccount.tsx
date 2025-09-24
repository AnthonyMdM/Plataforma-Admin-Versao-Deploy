"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

export type FormState = {
  errors: string[];
  success: boolean;
  message?: string;
};

const registerSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .refine((val) => val.length > 2, "Nome deve ter pelo menos 3 caracteres"),
  sobreNome: z
    .string()
    .min(1, "Sobrenome é obrigatório")
    .max(100, "Sobrenome deve ter no máximo 100 caracteres")
    .trim(),
  email: z.email("Email inválido"),
  senha: z
    .string()
    .min(8, "Senha precisa ter ao menos 8 caracteres")
    .refine((v) => /[A-Z]/.test(v), "Precisa conter 1 letra maiúscula")
    .refine((v) => /[a-z]/.test(v), "Precisa conter 1 letra minúscula")
    .refine((v) => /\d/.test(v), "Precisa conter 1 número")
    .refine((v) => /\W/.test(v), "Precisa conter 1 caractere especial")
    .refine((v) => !/\s/.test(v), "Não pode conter espaços"),
  role: z
    .string()
    .min(1, "Função é obrigatória")
    .trim()
    .refine((val) => val !== "", "Função não pode estar vazia"),
});

async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}

export async function createUser(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const nome = formData.get("nome");
    const sobreNome = formData.get("sobreNome");
    const email = formData.get("email");
    const senha = formData.get("senha");
    const role = formData.get("role");

    if (!nome || !sobreNome || !email || !senha || !role) {
      return {
        errors: ["Todos os campos obrigatórios devem ser preenchidos"],
        success: false,
        message: "Dados incompletos",
      };
    }

    const rawData = {
      nome: nome as string,
      sobreNome: sobreNome as string,
      email: email as string,
      senha: senha as string,
      role: role as Role,
    };

    const validatedData = registerSchema.parse(rawData);

    const UserExistente = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
        },
      },
    });

    if (UserExistente) {
      return {
        errors: [`Email já está em uso!`],
        success: false,
        message: "Email já está em uso!",
      };
    }

    const senhaHash = await hashPassword(validatedData.senha);

    const usuario = await prisma.user.create({
      data: {
        Name: validatedData.nome,
        email: validatedData.email,
        hashedPassword: senhaHash,
        Role: validatedData.role,
      },
    });

    return {
      errors: [],
      success: true,
      message: `Usuário ${usuario.Name} criado com sucesso!`,
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
          errors: ["Email duplicado"],
          success: false,
          message: "Este email já existe no sistema",
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
