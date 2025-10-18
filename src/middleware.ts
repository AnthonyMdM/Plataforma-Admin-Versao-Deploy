import { getToken } from "@auth/core/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ✅ Pegar token JWT (Edge-compatible)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET, // <--- obrigatório
    raw: false, // opcional, retorna objeto decodificado
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  const publicRoutes = ["/login"];
  const adminRoutes = ["/register", "/produtos", "/criarProduto"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/perfil", req.url));
  }

  if (isAdminRoute && userRole !== "ADMINISTRADOR") {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL("/perfil", req.url));
  }

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
