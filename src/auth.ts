import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("🔍 [AUTH] Iniciando autorização");
        console.log("🔍 [AUTH] Email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [AUTH] Credenciais faltando");
          return null;
        }

        try {
          console.log("🔍 [AUTH] Buscando usuário no banco...");

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("❌ [AUTH] Usuário não encontrado");
            return null;
          }

          console.log("✅ [AUTH] Usuário encontrado:", user.email);

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            console.log("❌ [AUTH] Senha inválida");
            return null;
          }

          console.log("✅ [AUTH] Senha válida, retornando usuário");

          return {
            id: String(user.id),
            email: user.email,
            name: user.Name,
            role: user.Role,
          };
        } catch (error) {
          console.error("❌ [AUTH] Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("🔍 [JWT] Callback chamado", { trigger, hasUser: !!user });

      if (user) {
        console.log("✅ [JWT] Adicionando dados do usuário ao token");
        token.id = user.id;
        token.role = user.role;
      }

      console.log("🔍 [JWT] Token:", { id: token.id, role: token.role });
      return token;
    },
    async session({ session, token }) {
      console.log("🔍 [SESSION] Callback chamado");

      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        console.log("✅ [SESSION] Dados adicionados à sessão");
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
