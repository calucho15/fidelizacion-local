export type EstadoLealtad = 'vip' | 'crecimiento' | 'en_riesgo' | 'inactivo';

export type RolUsuario = 'superadmin' | 'comercio_admin' | 'cajero';
export type EstadoCuenta = 'trial' | 'activo' | 'suspendido' | 'vencido';
export type PlanComercio = 'starter' | 'pro' | 'enterprise';

export interface UsuarioPerfil {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  comercio_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Comercio {
  id: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  rubro: string;
  logo_url?: string;
  banner_url?: string;
  color_primario: string;
  color_secundario: string;
  telefono_contacto?: string;
  direccion?: string;
  monto_por_punto: number; // Ej: cada $100 suma 1 punto
  puntos_bienvenida: number;
  pin_mostrador: string;
  pin_hash?: string;
  estado_cuenta?: EstadoCuenta;
  trial_expira_at?: string;
  plan?: PlanComercio;
}

export interface Cliente {
  id: string;
  comercio_id: string;
  telefono: string;
  nombre: string;
  email?: string;
  puntos_actuales: number;
  puntos_historicos: number;
  racha_visitas: number;
  ultima_visita: string;
  fecha_nacimiento?: string;
  loyalty_score: number; // 0 a 100 basado en RFM
  estado_lealtad: EstadoLealtad;
}

export interface Premio {
  id: string;
  comercio_id: string;
  titulo: string;
  descripcion?: string;
  puntos_requeridos: number;
  imagen_url?: string;
  activo: boolean;
  orden: number;
}

export interface TransaccionPuntos {
  id: string;
  comercio_id: string;
  cliente_id: string;
  tipo: 'compra' | 'canje' | 'bienvenida' | 'cumpleanos' | 'ruleta' | 'ajuste';
  puntos: number;
  monto_compra?: number;
  descripcion?: string;
  created_at: string;
}

export interface Canje {
  id: string;
  comercio_id: string;
  cliente_id: string;
  premio_id: string;
  premio_titulo: string;
  puntos_utilizados: number;
  codigo_canje: string;
  estado: 'pendiente' | 'completado' | 'cancelado';
  created_at: string;
}
