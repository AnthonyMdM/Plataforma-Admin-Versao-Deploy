import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { getFindLogin } from "@/actions/actionsAccount";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            console.log("Email ou senha não fornecidos");
            return null;
          }

          const user = await getFindLogin(email);

          if (!user || !user.hashedPassword) {
            console.log("Usuário não encontrado ou sem senha");
            return null;
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) {
            console.log("Email ou Senha incorreto(a)");
            return null;
          }

          return {
            id: String(user.id),
            name: user.Name,
            email: user.email,
            role: user.Role,
          };
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  // pages: {
  //   signIn: "/login",
  // },
});
