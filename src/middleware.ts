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

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const adminRoutes = ["/register", "/produtos", "/criarProduto"];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  const isAdminRoute = adminRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // 🔹 Se logado e tentar acessar /login → redireciona para /perfil
  if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/perfil", nextUrl));
  }

  // 🔹 Rota admin e sem permissão
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/perfil", nextUrl));
    }
  }

  // 🔹 Rota privada sem login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    if (nextUrl.pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ Corrigido: usa grupos não capturantes (?: … )
export const config = {
  matcher: [
    "/((?:api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp))$)",
  ],
};
