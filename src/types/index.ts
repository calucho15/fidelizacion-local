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
