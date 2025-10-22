import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  roles: string[];
  exp: number;
  sub: string;
  email: string;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const userRoles = request.cookies.get('userRoles')?.value;
  
  // Log apenas em desenvolvimento
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log(`Middleware: Verificando ${pathname}`);
    console.log(`Middleware: Token presente: ${!!token}`);
    console.log(`Middleware: UserRoles cookie: ${userRoles}`);
  }
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/eventos',
    '/_next',
    '/favicon.ico',
    '/assets'
  ];
  
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isRootPath = pathname === '/';
  
  // Se não tem token e está tentando acessar rota protegida
  if (!token && !isPublicRoute && !isRootPath) {
    console.log(`Middleware: Redirecionando para login - rota protegida sem token: ${pathname}`);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Se tem token, validar e redirecionar conforme necessário
  if (token) {
    try {
      // Temporariamente, vamos pegar os roles do cookie separadamente
      // para evitar problemas com JWT decode
      let roles: string[] = [];
      
      if (userRoles) {
        try {
          roles = JSON.parse(userRoles);
        } catch (e) {
          console.log('Middleware: Erro ao parsear roles do cookie:', e);
          roles = [];
        }
      }
      
      // Verificação básica de token (sem JWT decode por enquanto)
      if (!token || token.length < 10) {
        console.log('Middleware: Token inválido, limpando cookies');
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('userRoles');
        return response;
      }
      console.log(`Middleware: Token válido, roles: ${roles.join(', ')}, pathname: ${pathname}`);
      
      // Controle de acesso por rota
      if (pathname.startsWith('/admin')) {
        if (!roles.includes('ROLE_ADMIN')) {
          console.log('Middleware: Acesso negado ao admin, redirecionando para user');
          return NextResponse.redirect(new URL('/user', request.url));
        }
      }
      
      if (pathname.startsWith('/user')) {
        if (!roles.some(r => ['ROLE_USER', 'ROLE_LEADER'].includes(r))) {
          console.log('Middleware: Acesso negado ao user, redirecionando para login');
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
      
      // Redirecionar da raiz baseado no role
      if (isRootPath) {
        const hasAdmin = roles.includes('ROLE_ADMIN');
        const hasUser = roles.some(r => ['ROLE_USER', 'ROLE_LEADER'].includes(r));
        
        if (hasAdmin && hasUser) {
          // Para usuários com múltiplos roles, redirecionar para user por padrão
          // O usuário pode navegar para admin se quiser
          console.log('Middleware: Usuário com múltiplos roles, redirecionando para /user');
          return NextResponse.redirect(new URL('/user', request.url));
        } else if (hasAdmin) {
          console.log('Middleware: Usuário admin, redirecionando para /admin');
          return NextResponse.redirect(new URL('/admin', request.url));
        } else if (hasUser) {
          console.log('Middleware: Usuário comum, redirecionando para /user');
          return NextResponse.redirect(new URL('/user', request.url));
        } else {
          console.log('Middleware: Sem roles válidos, redirecionando para login');
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
      
      // Atualizar cookie de roles e permitir acesso
      const response = NextResponse.next();
      response.cookies.set('userRoles', JSON.stringify(roles), {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax'
      });
      
      console.log(`Middleware: Permitindo acesso a ${pathname}`);
      return response;
      
    } catch (error) {
      // Token inválido, limpar e redirecionar
      console.log('Middleware: Erro ao decodificar token, limpando cookies:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('userRoles');
      return response;
    }
  } else if (isRootPath) {
    // Sem token na raiz, redirecionar para eventos (página pública)
    console.log('Middleware: Sem token na raiz, redirecionando para /eventos');
    return NextResponse.redirect(new URL('/eventos', request.url));
  }
  
  // Permitir acesso a rotas públicas
  console.log(`Middleware: Permitindo acesso a rota pública: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};