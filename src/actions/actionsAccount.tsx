"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { FormState } from "@/types/tyeps-global";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

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

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}

export async function createUser(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      nome: formData.get("nome") as string,
      sobreNome: formData.get("sobreNome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      role: formData.get("role") as Role,
    };

    const validatedData = registerSchema.parse(rawData);

    const userExistente = await prisma.user.findFirst({
      where: { email: validatedData.email },
    });

    if (userExistente) {
      return {
        errors: ["Email já está em uso!"],
        success: false,
      };
    }

    const senhaHash = await hashPassword(validatedData.senha);

    const usuario = await prisma.user.create({
      data: {
        Name: `${validatedData.nome} ${validatedData.sobreNome}`,
        email: validatedData.email,
        hashedPassword: senhaHash,
        Role: validatedData.role.toUpperCase(),
      },
    });

    return {
      errors: [],
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => {
        const field = issue.path.join(".");
        return `${field}: ${issue.message}`;
      });

      return {
        errors,
        success: false,
      };
    }

    return {
      errors: [
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao criar usuário",
      ],
      success: false,
    };
  }
}

export async function getFindLogin(email: string) {
  const user = prisma.user.findUnique({ where: { email } });
  return user;
}

export async function actionLogin(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result) {
      return {
        success: false,
        errors: ["Email ou senha incorretos"],
      };
    }
    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      errors: ["Erro ao fazer login. Tente novamente."],
    };
  }
}
