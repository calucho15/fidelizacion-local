-- ==========================================================
-- SISTEMA DE FIDELIZACIÓN LOCAL - ESQUEMA SUPABASE
-- Optimizado para Hamburgueserías, Pizzerías y Restaurantes
-- ==========================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE COMERCIOS (Multi-tenant)
CREATE TABLE IF NOT EXISTS comercios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- ej: 'fabbrica-burger', 'pizzeria-roma'
    nombre TEXT NOT NULL,
    descripcion TEXT,
    rubro TEXT DEFAULT 'hamburgueseria', -- 'hamburgueseria', 'pizzeria', 'restaurante'
    logo_url TEXT DEFAULT '🍔',
    banner_url TEXT,
    color_primario TEXT DEFAULT '#f59e0b', -- Ámbar dorado cálido
    color_secundario TEXT DEFAULT '#0f172a', -- Pizarra oscura
    telefono_contacto TEXT,
    direccion TEXT,
    monto_por_punto NUMERIC DEFAULT 100, -- Cada $100 suma 1 punto
    puntos_bienvenida INTEGER DEFAULT 50, -- 50 puntos de bienvenida
    pin_mostrador TEXT DEFAULT '1234',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE CLIENTES (Con RFM & Loyalty Score)
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    telefono TEXT NOT NULL, -- Identificador universal (WhatsApp)
    nombre TEXT NOT NULL,
    email TEXT,
    puntos_actuales INTEGER DEFAULT 0 CHECK (puntos_actuales >= 0),
    puntos_historicos INTEGER DEFAULT 0,
    racha_visitas INTEGER DEFAULT 1,
    ultima_visita TIMESTAMPTZ DEFAULT NOW(),
    loyalty_score INTEGER DEFAULT 50,
    estado_lealtad TEXT DEFAULT 'crecimiento', -- 'vip', 'crecimiento', 'en_riesgo', 'inactivo'
    fecha_nacimiento DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (comercio_id, telefono)
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

-- 4. TABLA DE HISTORIAL DE PUNTOS
CREATE TABLE IF NOT EXISTS transacciones_puntos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- 'compra', 'canje', 'bienvenida', 'ruleta', 'rescate'
    puntos INTEGER NOT NULL,
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
    codigo_canje TEXT NOT NULL, -- ej: 'CANJE-4521'
    estado TEXT DEFAULT 'completado',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES DE VELOCIDAD PARA EL MOSTRADOR
CREATE INDEX IF NOT EXISTS idx_clientes_busqueda ON clientes (comercio_id, telefono);
CREATE INDEX IF NOT EXISTS idx_comercios_slug ON comercios (slug);
CREATE INDEX IF NOT EXISTS idx_transacciones_cliente ON transacciones_puntos (cliente_id);

-- POLÍTICAS DE ACCESO PÚBLICO (Para prototipo rápido y demostraciones)
ALTER TABLE comercios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE premios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones_puntos ENABLE ROW LEVEL SECURITY;
ALTER TABLE canjes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública comercios" ON comercios FOR SELECT USING (true);
CREATE POLICY "Lectura pública clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Inserción pública clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualización pública clientes" ON clientes FOR UPDATE USING (true);
CREATE POLICY "Lectura pública premios" ON premios FOR SELECT USING (true);
CREATE POLICY "Lectura pública transacciones" ON transacciones_puntos FOR SELECT USING (true);
CREATE POLICY "Inserción pública transacciones" ON transacciones_puntos FOR INSERT WITH CHECK (true);
CREATE POLICY "Lectura pública canjes" ON canjes FOR SELECT USING (true);
CREATE POLICY "Inserción pública canjes" ON canjes FOR INSERT WITH CHECK (true);

-- ==========================================================
-- COMERCIO DEMO: HAMBURGUESERÍA & PIZZERÍA ARTESANAL
-- ==========================================================
INSERT INTO comercios (slug, nombre, descripcion, rubro, logo_url, color_primario, color_secundario, monto_por_punto, puntos_bienvenida, pin_mostrador)
VALUES 
    ('fabbrica-burger', 'La Fabbrica Burger & Pizza', 'Hamburguesas smash artesanales y pizzas al horno de leña.', 'hamburgueseria', '🍔', '#f59e0b', '#0f172a', 100, 50, '1234')
ON CONFLICT (slug) DO NOTHING;

-- Insertar premios gastronómicos irresistibles
DO $$
DECLARE
    v_id UUID;
BEGIN
    SELECT id INTO v_id FROM comercios WHERE slug = 'fabbrica-burger';
    IF v_id IS NOT NULL THEN
        INSERT INTO premios (comercio_id, titulo, descripcion, puntos_requeridos, orden)
        VALUES
            (v_id, 'Porción de Papas Cheddar & Bacon', 'Papas rústicas crujientes con salsa cheddar casera y crocante de panceta.', 150, 1),
            (v_id, 'Pinta de Cerveza Artesanal o Gaseosa', 'Pinta IPA/Honey o gaseosa línea grande a elección.', 200, 2),
            (v_id, 'Burger Doble Especial con Papas', 'Doble medallón 100% carne de pastura, queso americano, salsa especial y papas fritas.', 450, 3),
            (v_id, 'Pizza Grande Especial a la Piedra', '8 porciones a elección (Muzzarella especial, Fugazzeta o Pepperoni).', 600, 4)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
