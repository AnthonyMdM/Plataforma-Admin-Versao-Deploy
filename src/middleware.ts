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

  // Logs estruturados que aparecem na Vercel
  const logData = {
    path: nextUrl.pathname,
    hasToken: !!token,
    role: userRole,
    timestamp: new Date().toISOString(),
  };

  console.log('[MIDDLEWARE]', JSON.stringify(logData));

  // Rotas públicas
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

  // Rotas exclusivas de ADMINISTRADOR
  const adminOnlyRoutes = ["/register", "/produtos", "/criarProduto"];

  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // 1. Bloqueia a home "/"
  if (nextUrl.pathname === "/") {
    if (isLoggedIn) {
      console.log('[MIDDLEWARE] Redirect: / -> /perfil');
      return NextResponse.redirect(new URL("/perfil", nextUrl));
    } else {
      console.log('[MIDDLEWARE] Redirect: / -> /login');
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // 2. Se está logado e tenta acessar /login
  if (isLoggedIn && nextUrl.pathname === "/login") {
    console.log('[MIDDLEWARE] Logged in user trying to access /login');
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      console.log('[MIDDLEWARE] Redirect to callbackUrl:', callbackUrl);
      return NextResponse.redirect(new URL(callbackUrl, nextUrl));
    }
    console.log('[MIDDLEWARE] Redirect: /login -> /perfil');
    return NextResponse.redirect(new URL("/perfil", nextUrl));
  }

  // 3. Protege rotas exclusivas de admin
  if (isAdminOnlyRoute) {
    console.log('[MIDDLEWARE] Admin route detected:', nextUrl.pathname);
    
    if (!isLoggedIn) {
      console.log('[MIDDLEWARE] Not logged in, redirect to /login');
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "ADMINISTRADOR") {
      console.log('[MIDDLEWARE] Not admin. Role:', userRole, 'Expected: ADMINISTRADOR');
      return NextResponse.redirect(new URL("/perfil", nextUrl));
    }

    console.log('[MIDDLEWARE] Admin access granted');
  }

  // 4. Rotas públicas
  if (isPublicRoute) {
    console.log('[MIDDLEWARE] Public route, allowing access');
    return NextResponse.next();
  }

  // 5. Outras rotas precisam de login
  if (!isLoggedIn) {
    console.log('[MIDDLEWARE] Protected route, not logged in');
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log('[MIDDLEWARE] Allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)",
  ],
};