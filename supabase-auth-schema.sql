-- ==========================================================
-- SISTEMA DE AUTENTICACIÓN MULTI-TENANT Y CONTROL RBAC
-- Esquema de Seguridad, Perfiles y Políticas RLS para Supabase
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------
-- 1. EXTENSIÓN DE TABLA COMERCIOS (Campos de Plan, Cuenta y PIN)
-- ----------------------------------------------------------
ALTER TABLE public.comercios 
ADD COLUMN IF NOT EXISTS pin_hash TEXT DEFAULT '1234',
ADD COLUMN IF NOT EXISTS estado_cuenta TEXT DEFAULT 'trial' CHECK (estado_cuenta IN ('trial', 'activo', 'suspendido', 'vencido')),
ADD COLUMN IF NOT EXISTS trial_expira_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise'));

-- Actualizar registros existentes con valores por defecto si tienen NULL
UPDATE public.comercios 
SET 
    pin_hash = COALESCE(pin_hash, '1234'),
    estado_cuenta = COALESCE(estado_cuenta, 'trial'),
    trial_expira_at = COALESCE(trial_expira_at, NOW() + INTERVAL '14 days'),
    plan = COALESCE(plan, 'starter')
WHERE pin_hash IS NULL OR estado_cuenta IS NULL OR trial_expira_at IS NULL OR plan IS NULL;

-- ----------------------------------------------------------
-- 2. TABLA DE PERFILES DE USUARIO (RBAC Multi-tenant)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usuarios_perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('superadmin', 'comercio_admin', 'cajero')),
    comercio_id UUID REFERENCES public.comercios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimización de lookups y RLS
CREATE INDEX IF NOT EXISTS idx_usuarios_perfiles_rol_comercio 
ON public.usuarios_perfiles (rol, comercio_id);

CREATE INDEX IF NOT EXISTS idx_usuarios_perfiles_email 
ON public.usuarios_perfiles (email);

-- ----------------------------------------------------------
-- 3. FUNCIÓN HELPER: PERFIL DEL USUARIO AUTENTICADO
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE (rol TEXT, comercio_id UUID) 
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT rol, comercio_id 
    FROM public.usuarios_perfiles 
    WHERE id = (SELECT auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated;

-- ----------------------------------------------------------
-- 4. HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------
ALTER TABLE public.usuarios_perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comercios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones_puntos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canjes ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 5. POLÍTICAS RLS: USUARIOS_PERFILES
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Acceso a perfiles de usuario" ON public.usuarios_perfiles;
CREATE POLICY "Acceso a perfiles de usuario" ON public.usuarios_perfiles
FOR ALL TO authenticated
USING (
    id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) AND up.rol = 'superadmin'
    )
)
WITH CHECK (
    id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) AND up.rol = 'superadmin'
    )
);

-- ----------------------------------------------------------
-- 6. POLÍTICAS RLS: COMERCIOS
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Acceso a comercios por rol" ON public.comercios;
CREATE POLICY "Acceso a comercios por rol" ON public.comercios
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = comercios.id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = comercios.id)
    )
);

-- ----------------------------------------------------------
-- 7. POLÍTICAS RLS: CLIENTES
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Aislamiento de clientes por comercio" ON public.clientes;
CREATE POLICY "Aislamiento de clientes por comercio" ON public.clientes
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = clientes.comercio_id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = clientes.comercio_id)
    )
);

-- ----------------------------------------------------------
-- 8. POLÍTICAS RLS: PREMIOS
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Aislamiento de premios por comercio" ON public.premios;
CREATE POLICY "Aislamiento de premios por comercio" ON public.premios
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = premios.comercio_id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = premios.comercio_id)
    )
);

-- ----------------------------------------------------------
-- 9. POLÍTICAS RLS: TRANSACCIONES_PUNTOS
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Aislamiento de transacciones por comercio" ON public.transacciones_puntos;
CREATE POLICY "Aislamiento de transacciones por comercio" ON public.transacciones_puntos
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = transacciones_puntos.comercio_id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = transacciones_puntos.comercio_id)
    )
);

-- ----------------------------------------------------------
-- 10. POLÍTICAS RLS: CANJES
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Aislamiento de canjes por comercio" ON public.canjes;
CREATE POLICY "Aislamiento de canjes por comercio" ON public.canjes
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = canjes.comercio_id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios_perfiles up
        WHERE up.id = (SELECT auth.uid()) 
        AND (up.rol = 'superadmin' OR up.comercio_id = canjes.comercio_id)
    )
);

-- ----------------------------------------------------------
-- 11. REGISTROS SEMILLA (SEED) PARA ENTORNO DEMO Y PRUEBAS
-- Cuentas:
--   - SuperAdmin: admin@fidelizalocal.com / admin123
--   - Comercio: dueno@fabbricaburger.com / fabbrica123
-- ----------------------------------------------------------
DO $$
DECLARE
    v_fabbrica_id UUID;
    v_admin_auth_id UUID;
    v_dueno_auth_id UUID;
BEGIN
    -- Asegurar comercio demo de Fabbrica Burger
    SELECT id INTO v_fabbrica_id FROM public.comercios WHERE slug = 'fabbrica-burger';

    IF v_fabbrica_id IS NULL THEN
        INSERT INTO public.comercios (
            slug, nombre, descripcion, rubro, logo_url, color_primario, color_secundario,
            monto_por_punto, puntos_bienvenida, pin_mostrador, pin_hash, estado_cuenta, plan
        ) VALUES (
            'fabbrica-burger', 'La Fabbrica Burger & Pizza', 'Hamburguesas smash artesanales y pizzas al horno de leña.',
            'hamburgueseria', '🍔', '#f59e0b', '#0f172a', 100, 50, '1234', '1234', 'trial', 'starter'
        )
        RETURNING id INTO v_fabbrica_id;
    ELSE
        UPDATE public.comercios
        SET 
            pin_hash = COALESCE(pin_hash, '1234'),
            estado_cuenta = COALESCE(estado_cuenta, 'trial'),
            plan = COALESCE(plan, 'starter')
        WHERE id = v_fabbrica_id;
    END IF;

    -- 1. Semilla en auth.users si no existen previamente
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@fidelizalocal.com') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            'a0000000-0000-0000-0000-000000000001',
            'authenticated',
            'authenticated',
            'admin@fidelizalocal.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nombre":"Super Administrador"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dueno@fabbricaburger.com') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            'a0000000-0000-0000-0000-000000000002',
            'authenticated',
            'authenticated',
            'dueno@fabbricaburger.com',
            crypt('fabbrica123', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nombre":"Dueño Fabbrica Burger"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    -- 2. Obtener IDs asociados
    SELECT id INTO v_admin_auth_id FROM auth.users WHERE email = 'admin@fidelizalocal.com';
    SELECT id INTO v_dueno_auth_id FROM auth.users WHERE email = 'dueno@fabbricaburger.com';

    -- 3. Vincular con perfiles de usuarios
    IF v_admin_auth_id IS NOT NULL THEN
        INSERT INTO public.usuarios_perfiles (id, email, nombre, rol, comercio_id)
        VALUES (v_admin_auth_id, 'admin@fidelizalocal.com', 'Super Administrador', 'superadmin', NULL)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            nombre = EXCLUDED.nombre,
            rol = 'superadmin',
            updated_at = NOW();
    END IF;

    IF v_dueno_auth_id IS NOT NULL THEN
        INSERT INTO public.usuarios_perfiles (id, email, nombre, rol, comercio_id)
        VALUES (v_dueno_auth_id, 'dueno@fabbricaburger.com', 'Dueño Fabbrica Burger', 'comercio_admin', v_fabbrica_id)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            nombre = EXCLUDED.nombre,
            rol = 'comercio_admin',
            comercio_id = v_fabbrica_id,
            updated_at = NOW();
    END IF;

END $$;
