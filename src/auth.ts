import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcrypt";
import { getFindLogin } from "@/actions/actionsAccount";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 horas
  },

  jwt: {
    maxAge: 60 * 60 * 24, // 24 horas
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) {
          console.log("Email ou senha não fornecidos");
          return null;
        }

        try {
          const user = await getFindLogin(email);

          if (!user || !user.hashedPassword) {
            console.log("Usuário não encontrado ou sem senha");
            return null;
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) {
            console.log("Email ou senha incorretos");
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
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("signout")) return `${baseUrl}/login`;
      return `${baseUrl}/perfil`;
    },
  },

  // pages: {
  //   signIn: "/login", // se quiser usar página custom
  // },
});
