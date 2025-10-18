import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Rotas que qualquer um pode acessar (logado ou não)
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

  // Rotas que SOMENTE admin pode acessar
  const adminOnlyRoutes = ["/register", "/produtos", "/criarProduto"];

  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // 1. Se está logado e tenta acessar /login, redireciona
  if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl") || "/perfil";
    return NextResponse.redirect(new URL(callbackUrl, nextUrl));
  }

  // 2. Protege rotas exclusivas de admin
  if (isAdminOnlyRoute) {
    // Se não está logado, vai pro login
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Se está logado mas não é admin, vai pro perfil
    if (userRole !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/perfil", nextUrl));
    }
  }

  // 3. Deixa passar rotas públicas e todas as outras rotas para usuários logados
  // Remove esta verificação que estava bloqueando tudo:
  // if (!isLoggedIn && !isPublicRoute) { ... }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)",
  ],
};
