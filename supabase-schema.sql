-- ==========================================================
-- SISTEMA DE FIDELIZACIÓN LOCAL - ESQUEMA DE BASE DE DATOS
-- Compatible con Supabase (PostgreSQL)
-- Copiar y pegar en el SQL Editor de tu proyecto en Supabase
-- ==========================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE COMERCIOS (Multi-tenant)
CREATE TABLE IF NOT EXISTS comercios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- ej: 'cafe-central', 'heladeria-roma'
    nombre TEXT NOT NULL,
    descripcion TEXT,
    rubro TEXT, -- 'cafeteria', 'restaurante', 'minimercado', 'barberia', etc.
    logo_url TEXT,
    banner_url TEXT,
    color_primario TEXT DEFAULT '#00B9B4',
    color_secundario TEXT DEFAULT '#1C2841',
    telefono_contacto TEXT,
    direccion TEXT,
    monto_por_punto NUMERIC DEFAULT 100, -- Cada cuántos pesos/dólares suma 1 punto
    puntos_bienvenida INTEGER DEFAULT 50, -- Puntos regalados al registrarse
    pin_mostrador TEXT DEFAULT '1234', -- Clave rápida para que los cajeros validen en mostrador
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    telefono TEXT NOT NULL, -- Identificador universal (WhatsApp)
    nombre TEXT NOT NULL,
    email TEXT,
    puntos_actuales INTEGER DEFAULT 0 CHECK (puntos_actuales >= 0),
    puntos_historicos INTEGER DEFAULT 0,
    racha_visitas INTEGER DEFAULT 0,
    ultima_visita TIMESTAMPTZ DEFAULT NOW(),
    fecha_nacimiento DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (comercio_id, telefono) -- Un cliente por número de teléfono en cada comercio
);

-- 3. TABLA DE PREMIOS CONFIGURABLES
CREATE TABLE IF NOT EXISTS premios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    puntos_requeridos INTEGER NOT NULL CHECK (puntos_requeridos > 0),
    imagen_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE HISTORIAL DE PUNTOS (Auditoría)
CREATE TABLE IF NOT EXISTS transacciones_puntos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- 'compra', 'canje', 'bienvenida', 'cumpleanos', 'ruleta', 'ajuste'
    puntos INTEGER NOT NULL, -- positivo para sumas, negativo para canjes
    monto_compra NUMERIC DEFAULT 0,
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE CANJES DE PREMIOS
CREATE TABLE IF NOT EXISTS canjes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    premio_id UUID NOT NULL REFERENCES premios(id) ON DELETE RESTRICT,
    puntos_utilizados INTEGER NOT NULL,
    codigo_canje TEXT NOT NULL, -- ej: 'CANJE-7821'
    estado TEXT DEFAULT 'completado', -- 'pendiente', 'completado', 'cancelado'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES PARA VELOCIDAD ULTRA-RÁPIDA EN CAJA
CREATE INDEX IF NOT EXISTS idx_clientes_busqueda ON clientes (comercio_id, telefono);
CREATE INDEX IF NOT EXISTS idx_comercios_slug ON comercios (slug);
CREATE INDEX IF NOT EXISTS idx_transacciones_cliente ON transacciones_puntos (cliente_id);
CREATE INDEX IF NOT EXISTS idx_premios_comercio ON premios (comercio_id, activo);

-- ==========================================================
-- DATOS DE DEMOSTRACIÓN (Para probar el sistema de inmediato)
-- ==========================================================
INSERT INTO comercios (slug, nombre, descripcion, rubro, color_primario, color_secundario, monto_por_punto, puntos_bienvenida, pin_mostrador)
VALUES 
    ('cafe-paris', 'Café & Bakery París', 'Especialistas en café de especialidad y pastelería artesanal.', 'cafeteria', '#00B9B4', '#1C2841', 100, 50, '1234')
ON CONFLICT (slug) DO NOTHING;

-- Insertar premios para el comercio demo
DO $$
DECLARE
    v_comercio_id UUID;
BEGIN
    SELECT id INTO v_comercio_id FROM comercios WHERE slug = 'cafe-paris';
    IF v_comercio_id IS NOT NULL THEN
        INSERT INTO premios (comercio_id, titulo, descripcion, puntos_requeridos, orden)
        VALUES
            (v_comercio_id, 'Café Espresso o Cortado', 'Válido para cualquier opción de café clásico.', 100, 1),
            (v_comercio_id, 'Medialuna o Donut Artesanal', 'Acompañamiento a elección en el mostrador.', 150, 2),
            (v_comercio_id, '20% OFF en tu Desayuno/Merienda', 'Descuento directo en el total de tu ticket.', 300, 3),
            (v_comercio_id, 'Combo Merienda Completa Gratis', 'Café a elección + porción de torta o tostado.', 500, 4)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
