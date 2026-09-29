# Plan de Implementación: Autenticación Multi-Tenant y RBAC (FidelizaLocal)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar un sistema de autenticación y control de accesos seguro (RBAC) con aislamiento multi-inquilino estricto, pantalla de inicio de sesión unificada (`/login`), terminal de caja por PIN (`/caja/[slug]`), registro con prueba de 14 días (`/registro`) y panel general SuperAdmin (`/superadmin`).

**Architecture:** La solución se basa en Supabase Auth y `@supabase/ssr` con cookies de sesión seguras (`HttpOnly`, `SameSite=Lax`). La seguridad se aplica en dos capas independientes: Next.js Edge Middleware (`src/middleware.ts`) para control de rutas y PostgreSQL Row-Level Security (RLS) para aislamiento inviolable en la base de datos.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Supabase Auth (`@supabase/supabase-js`, `@supabase/ssr`), Lucide React.

**Spec:** [docs/superpowers/specs/2026-09-29-multi-tenant-auth-rbac-design.md](file:///c:/Users/Carlo/Desktop/Antigravity/Fidelizaci%C3%B3n/docs/superpowers/specs/2026-09-29-multi-tenant-auth-rbac-design.md)

## Global Constraints
- No almacenar contraseñas ni PINs en texto plano.
- Usar únicamente cookies seguras `HttpOnly` para tokens de sesión; nunca almacenar JWTs de administración en `localStorage`.
- Todo acceso a `/admin/[slug]` debe validar que el `comercio_id` coincida con el perfil del usuario o que el usuario posea rol `superadmin`.
- Proporcionar credenciales demo de 1-clic en modo desarrollo/pruebas (`admin@fidelizalocal.com` y `dueno@fabbricaburger.com`).

## Review Focus
1. Acceso cruzado forzado: Un usuario con sesión activa en una tienda altera la URL hacia otra (`/admin/otra-tienda`); el sistema debe rechazarlo con HTTP 403.
2. Intento de acceso sin autenticación a `/superadmin`; debe redirigir a `/login?redirect=/superadmin`.
3. Inyección o fuerza bruta en PIN de mostrador: El teclado numérico debe validar contra el PIN hash o valor cifrado del comercio y no filtrar datos de caja si el PIN es incorrecto.
4. Registro de comercio duplicado: Manejo amigable y seguro de slugs o correos ya registrados.
5. Persistencia de sesión tras refrescar pantalla (F5): La sesión de Next.js SSR debe mantenerse intacta sin parpadeos ni logout involuntario.

---

### Task 1: Esquema de Base de Datos y Políticas RLS en Supabase

**Files:**
- Create: `supabase-auth-schema.sql`
- Modify: `src/types/index.ts`

**Interfaces:**
- Produces: Tabla `usuarios_perfiles` vinculada a `auth.users`, campos de seguridad en `comercios` (`pin_hash`, `estado_cuenta`, `trial_expira_at`, `plan`), y políticas RLS para `comercios`, `clientes` y `premios`.

- [ ] **Step 1: Definir tipos TypeScript en `src/types/index.ts`**
Añadir tipos para `RolUsuario`, `UsuarioPerfil`, `EstadoCuenta`, `PlanComercio` y extender `Comercio`.

- [ ] **Step 2: Redactar script SQL `supabase-auth-schema.sql`**
Crear `usuarios_perfiles`, añadir columnas a `comercios`, funciones helper `get_current_user_profile()`, y directivas RLS estrictas para `superadmin` y `comercio_admin`.

- [ ] **Step 3: Verificar consistencia sintáctica del script SQL**
Validar que todas las referencias a claves foráneas (`auth.users`, `comercios.id`) y directivas `TO authenticated` cumplan con las reglas de la skill de Supabase.

- [ ] **Step 4: Commit**
```bash
git add src/types/index.ts supabase-auth-schema.sql
git commit -m "feat(auth): define rbac schema, rls policies and typescript types"
```

---

### Task 2: Cliente Supabase SSR y Módulo de Autenticación

**Files:**
- Modify: `package.json` (instalar `@supabase/ssr` si no está presente)
- Create: `src/lib/supabase-server.ts`
- Create: `src/lib/auth.ts`
- Modify: `src/lib/store.ts`

**Interfaces:**
- Produces: `createClient()` para Server Components y Route Handlers con cookies seguras; funciones `loginOwner(email, password)`, `logoutUser()`, `getCurrentUser()`, `verifyCashierPin(slug, pin)`.

- [ ] **Step 1: Instalar `@supabase/ssr`**
Ejecutar `npm install @supabase/ssr` para soportar manejo de cookies en Next.js App Router.

- [ ] **Step 2: Crear `src/lib/supabase-server.ts`**
Implementar cliente con `createServerClient` sincronizado con las cookies de Next.js (`cookies()`).

- [ ] **Step 3: Implementar métodos de autenticación en `src/lib/auth.ts`**
Incluir fallback transparente para modo demo/desarrollo local (con las credenciales preconfiguradas del spec) y conexión con Supabase Auth cuando las variables de entorno estén activas.

- [ ] **Step 4: Verificar funcionamiento del helper de autenticación**
Comprobar que `loginOwner` y `verifyCashierPin` resuelvan con los datos correspondientes para los usuarios de prueba.

- [ ] **Step 5: Commit**
```bash
git add package.json package-lock.json src/lib/supabase-server.ts src/lib/auth.ts src/lib/store.ts
git commit -m "feat(auth): add supabase ssr client and auth helper services"
```

---

### Task 3: Next.js Edge Middleware de Protección de Rutas

**Files:**
- Create: `src/middleware.ts`

**Interfaces:**
- Consumes: Cookies de sesión de Supabase y `caja_session`.
- Produces: Interceptación global para `/superadmin/**`, `/admin/**`, `/caja/**`, `/login`, `/registro`.

- [x] **Step 1: Escribir `src/middleware.ts`**
Implementar la regla de coincidencia:
  - Si ruta inicia con `/superadmin`, verificar si el usuario tiene rol `superadmin`.
  - Si ruta inicia con `/admin/[slug]`, verificar sesión y que el `slug` coincida con el comercio asignado (o `superadmin`). Si no coincide, redirigir a `/login?error=forbidden`.
  - Si ruta es `/login` o `/registro` y el usuario ya está autenticado, redirigir a su panel correspondiente.

- [x] **Step 2: Probar middleware localmente**
Intentar acceder a `/superadmin` sin sesión y verificar redirección a `/login`.

- [x] **Step 3: Commit**
```bash
git add src/middleware.ts
git commit -m "feat(security): implement route protection edge middleware"
```

---

### Task 4: Pantalla de Inicio de Sesión Unificada (`/login`)

**Files:**
- Create: `src/app/login/page.tsx`
- Modify: `src/app/layout.tsx` (enlaces de navegación o encabezado si aplica)

**Interfaces:**
- Consumes: `loginOwner` y `verifyCashierPin` de `src/lib/auth.ts`.
- Produces: Interfaz de login con pestañas (Dueño/Admin y Caja por PIN) con botones de prueba de 1-clic.

- [ ] **Step 1: Crear `src/app/login/page.tsx`**
Diseñar interfaz boutique con selector de modo (Dueño / Caja con PIN), inputs con validación visual, botones de prueba rápida para SuperAdmin y Comercio Demo, e indicador de seguridad.

- [ ] **Step 2: Integrar envío de formulario y redirección**
Conectar el submit con `loginOwner()` y en caso de éxito redirigir con `router.push('/superadmin')` o `router.push('/admin/[slug]')`.

- [ ] **Step 3: Verificar en navegador la pantalla `/login`**
Probar tanto el login de SuperAdmin como el de dueño de tienda con los botones de demo y verificar que la transición funcione sin errores de consola.

- [ ] **Step 4: Commit**
```bash
git add src/app/login/page.tsx
git commit -m "feat(ui): add unified boutique login page with role tabs and cashier pin"
```

---

### Task 5: Pantalla de Registro y Onboarding de 14 Días (`/registro`)

**Files:**
- Create: `src/app/registro/page.tsx`
- Modify: `src/app/page.tsx` (actualizar botones CTA a `/registro`)

**Interfaces:**
- Produces: Asistente de alta rápida para nuevos comercios (datos de cuenta, nombre de local, rubro, PIN inicial) con 14 días de prueba gratuita.

- [ ] **Step 1: Crear `src/app/registro/page.tsx`**
Formulario en 3 pasos: 1) Cuenta de usuario, 2) Datos de la tienda, 3) Configuración de bienvenida y PIN de mostrador.

- [ ] **Step 2: Conectar con creación en base de datos**
Generar el nuevo comercio con `estado_cuenta = 'trial'`, `trial_expira_at = NOW() + 14 días`, registrar el perfil y redirigir inmediatamente a su nuevo panel `/admin/[slug]`.

- [ ] **Step 3: Enlazar CTA de la Landing Page**
En [src/app/page.tsx](file:///c:/Users/Carlo/Desktop/Antigravity/Fidelizaci%C3%B3n/src/app/page.tsx), actualizar los botones de "Crear mi club" o "Comenzar gratis" para que apunten a `/registro`.

- [ ] **Step 4: Commit**
```bash
git add src/app/registro/page.tsx src/app/page.tsx
git commit -m "feat(onboarding): add self-serve 14-day trial registration wizard"
```

---

### Task 6: Torre de Control SuperAdmin (`/superadmin`)

**Files:**
- Create: `src/app/superadmin/page.tsx`

**Interfaces:**
- Consumes: Lista de comercios de `LoyaltyStore.getComercios()`.
- Produces: Dashboard maestro con métricas SaaS (MRR estimado, comercios activos, comercios en trial, clientes globales), tabla de comercios con badges y botón "Entrar como comercio".

- [ ] **Step 1: Crear `src/app/superadmin/page.tsx`**
Diseñar la torre de control ejecutiva con métricas clave, buscador en tiempo real, filtro por estado (`trial`, `activo`, `vencido`), y acciones de administración.

- [ ] **Step 2: Implementar funcionalidad "Ver como comercio"**
Botón que permite al SuperAdmin abrir el dashboard de cualquier comercio seleccionado directamente con un banner superior que indica *"Modo Auditoría / Soporte SuperAdmin"*.

- [ ] **Step 3: Verificar vista y navegación de `/superadmin`**
Confirmar que liste las tiendas, calcule métricas globales y permita acceder a cualquier panel de tienda.

- [ ] **Step 4: Commit**
```bash
git add src/app/superadmin/page.tsx
git commit -m "feat(superadmin): add platform control tower dashboard"
```

---

### Task 7: Actualización de Dashboards Existentes (`/admin/[slug]` y `/caja/[slug]`) con Logout y Bloqueo

**Files:**
- Modify: `src/app/admin/[slug]/page.tsx`
- Modify: `src/app/caja/[slug]/page.tsx`

**Interfaces:**
- Produces: Barra superior en el dashboard del comercio con información del usuario autenticado, botón de "Cerrar Sesión", gestión del PIN de mostrador, y bloqueo de terminal de caja si no se ha ingresado el PIN.

- [ ] **Step 1: Agregar barra de sesión y logout en `src/app/admin/[slug]/page.tsx`**
Mostrar badge del plan (`Trial: X días restantes` o `Pro`), email del dueño y botón para cerrar sesión de forma segura.

- [ ] **Step 2: Proteger `src/app/caja/[slug]/page.tsx` con modal de PIN**
Si la sesión de caja no está desbloqueada, presentar el teclado numérico de PIN antes de permitir sumar puntos o entregar premios.

- [ ] **Step 3: Ejecutar build de Next.js (`npm run build`) para verificar compilación estricta**
Asegurar que no existan errores de TypeScript ni fallas de compilación.

- [ ] **Step 4: Commit**
```bash
git add src/app/admin/[slug]/page.tsx src/app/caja/[slug]/page.tsx
git commit -m "feat(ui): add session controls, logout and cashier pin lock overlay"
```
