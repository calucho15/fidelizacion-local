import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface AuthUser {
  id: string;
  email: string;
  rol: 'superadmin' | 'comercio_admin' | 'cajero';
  comercio_id?: string | null;
  slug?: string;
}

/**
 * Extraer información del usuario autenticado a partir de las cookies de la petición.
 * Revisa cookie de desarrollo/demo (fideliza_demo_user) y cookies de sesión de Supabase Auth.
 */
function getUserFromRequest(req: NextRequest): AuthUser | null {
  // 1. Revisar cookie de sesión demo
  const demoCookie = req.cookies.get('fideliza_demo_user')?.value;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie));
      if (parsed && (parsed.rol || parsed.email)) {
        return {
          id: parsed.id || 'demo-id',
          email: parsed.email || '',
          rol: parsed.rol || 'comercio_admin',
          comercio_id: parsed.comercio_id || null,
          slug:
            parsed.slug ||
            (parsed.comercio_id === 'de8faed9-2d35-454f-9260-31880d197059' ||
            parsed.email === 'dueno@fabbricaburger.com'
              ? 'fabbrica-burger'
              : undefined),
        };
      }
    } catch {
      try {
        const parsed = JSON.parse(demoCookie);
        if (parsed && (parsed.rol || parsed.email)) {
          return {
            id: parsed.id || 'demo-id',
            email: parsed.email || '',
            rol: parsed.rol || 'comercio_admin',
            comercio_id: parsed.comercio_id || null,
            slug:
              parsed.slug ||
              (parsed.comercio_id === 'de8faed9-2d35-454f-9260-31880d197059' ||
              parsed.email === 'dueno@fabbricaburger.com'
                ? 'fabbrica-burger'
                : undefined),
          };
        }
      } catch {
        // Cookie malformada
      }
    }
  }

  // 2. Revisar cookies de sesión de Supabase Auth (sb-*-auth-token)
  const allCookies = req.cookies.getAll();
  const sbAuthCookie = allCookies.find(
    (c) => c.name.startsWith('sb-') && c.name.includes('-auth-token')
  );

  if (sbAuthCookie && sbAuthCookie.value) {
    try {
      let rawVal = sbAuthCookie.value;
      if (rawVal.startsWith('base64-')) {
        rawVal = atob(rawVal.slice(7));
      }

      let parsedAuth: any = null;
      try {
        parsedAuth = JSON.parse(decodeURIComponent(rawVal));
      } catch {
        try {
          parsedAuth = JSON.parse(rawVal);
        } catch {
          // Posible token crudo
        }
      }

      let accessToken = '';
      if (Array.isArray(parsedAuth)) {
        accessToken = parsedAuth[0];
      } else if (parsedAuth && typeof parsedAuth === 'object') {
        accessToken = parsedAuth.access_token || parsedAuth.accessToken || '';
      } else if (typeof rawVal === 'string' && rawVal.includes('.')) {
        accessToken = rawVal;
      }

      if (accessToken && accessToken.includes('.')) {
        const parts = accessToken.split('.');
        if (parts.length >= 2) {
          const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const payloadJson = JSON.parse(atob(payloadBase64));
          const userMeta = payloadJson.user_metadata || {};
          const appMeta = payloadJson.app_metadata || {};
          const email = payloadJson.email || '';
          const rol =
            userMeta.rol ||
            appMeta.rol ||
            (email === 'admin@fidelizalocal.com' ? 'superadmin' : 'comercio_admin');
          const comercio_id = userMeta.comercio_id || null;
          const slug =
            userMeta.slug ||
            (email === 'dueno@fabbricaburger.com' ? 'fabbrica-burger' : undefined);

          return {
            id: payloadJson.sub || 'sb-user',
            email,
            rol,
            comercio_id,
            slug,
          };
        }
      }

      // Si existe cookie pero no se decodificó JWT, retornar usuario autenticado por defecto
      return {
        id: 'sb-user',
        email: '',
        rol: 'comercio_admin',
        comercio_id: null,
      };
    } catch {
      return {
        id: 'sb-user',
        email: '',
        rol: 'comercio_admin',
        comercio_id: null,
      };
    }
  }

  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir explícitamente archivos estáticos, API y rutas públicas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/club') ||
    pathname === '/' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const user = getUserFromRequest(req);

  // 1. Reglas para /superadmin (y subrutas /superadmin/*)
  if (pathname.startsWith('/superadmin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/superadmin', req.url));
    }
    if (user.rol !== 'superadmin') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
    }
    return NextResponse.next();
  }

  // 2. Reglas para /admin/[slug] (y subrutas /admin/[slug]/*)
  if (pathname.startsWith('/admin')) {
    const segments = pathname.split('/').filter(Boolean); // ['admin', 'slug', ...]
    const slug = segments[1] || '';

    if (!user) {
      const redirectPath = slug ? `/admin/${slug}` : '/admin';
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(redirectPath)}`, req.url)
      );
    }

    // SuperAdmin puede auditar cualquier comercio
    if (user.rol === 'superadmin') {
      return NextResponse.next();
    }

    // Dueño de comercio: verificar pertenencia del slug
    if (user.rol === 'comercio_admin') {
      const assignedSlug =
        user.slug ||
        (user.comercio_id === 'de8faed9-2d35-454f-9260-31880d197059' ||
        user.email === 'dueno@fabbricaburger.com'
          ? 'fabbrica-burger'
          : null);

      const isMatch =
        Boolean(slug) &&
        ((assignedSlug && assignedSlug === slug) ||
          (user.slug && user.slug === slug) ||
          (user.comercio_id && user.comercio_id === slug));

      if (!isMatch) {
        return NextResponse.redirect(new URL('/login?error=forbidden', req.url));
      }

      return NextResponse.next();
    }

    // Cualquier otro rol no autorizado
    return NextResponse.redirect(new URL('/login?error=forbidden', req.url));
  }

  // 3. Reglas para /login o /registro
  if (pathname === '/login' || pathname === '/registro') {
    if (user) {
      if (user.rol === 'superadmin') {
        return NextResponse.redirect(new URL('/superadmin', req.url));
      }
      if (user.rol === 'comercio_admin') {
        const userSlug =
          user.slug ||
          (user.comercio_id === 'de8faed9-2d35-454f-9260-31880d197059' ||
          user.email === 'dueno@fabbricaburger.com'
            ? 'fabbrica-burger'
            : 'fabbrica-burger');
        return NextResponse.redirect(new URL(`/admin/${userSlug}`, req.url));
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*', '/login', '/registro'],
};
