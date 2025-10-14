import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Obtém o token JWT diretamente (compatível com Edge Runtime)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // Rotas exclusivas para administradores
  const adminRoutes = ["/register"];

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Verifica se a rota atual é exclusiva de admin
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Se o usuário está logado e tenta acessar a página de login
  if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Se tentar acessar rota de admin sem ser administrador
  if (isAdminRoute && userRole !== "ADMINISTRADOR") {
    // Se não estiver logado, redireciona para login
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Se estiver logado mas não for admin, redireciona para acesso negado
    return NextResponse.redirect(new URL("/perfil", nextUrl));
  }

  // Se o usuário não está logado e tenta acessar uma rota protegida
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    // Adiciona a URL de retorno como parâmetro
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Permite o acesso
  return NextResponse.next();
}

// Configuração do matcher para definir quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)",
  ],
};
