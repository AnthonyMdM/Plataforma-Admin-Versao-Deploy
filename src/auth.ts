import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validators/auth-schema";
import NextAuth from "next-auth";
import { ZodError } from "zod";
import { userLogin } from "@/actions/actionsAccount";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
          const { email, password } = await loginSchema.parseAsync(credentials);
          const user = await userLogin(email);

          if (!user || !user.hashedPassword) return null;

          const isValid = await bcrypt.compare(password, user.hashedPassword);
          if (!isValid) return null;

          return {
            id: String(user.id),
            name: user.Name,
            email: user.email,
            role: user.Role,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
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
