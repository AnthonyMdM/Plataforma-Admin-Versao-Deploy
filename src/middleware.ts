// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Obtém token JWT do NextAuth (se existir)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Rotas públicas (acessíveis sem login)
  const publicRoutes = [
    "/", // home
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // Rotas exclusivas de administradores
  const adminRoutes = ["/register", "/produtos", "/criarProduto"];

  // Identificação das rotas atuais
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // 🔹 1. Se o usuário já estiver logado e tentar acessar /login → volta pra /perfil
  if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/perfil", nextUrl));
  }

  // 🔹 2. Se for rota de admin e o usuário não tiver permissão
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      // callback só se realmente tentou acessar rota protegida
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/perfil", nextUrl));
    }
  }

  // 🔹 3. Se for rota privada e o usuário não estiver logado
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    // callbackUrl é útil só em tentativas de acessar páginas específicas
    if (nextUrl.pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 🔹 4. Caso contrário, segue o fluxo normal
  return NextResponse.next();
}

// 🔧 Ignora arquivos estáticos e rotas API
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|svg|gif|webp)$).*)",
  ],
};
