import { Comercio, Cliente, Premio, TransaccionPuntos, Canje, EstadoLealtad } from '@/types';
import { supabase } from './supabase';

export const DEMO_COMERCIO: Comercio = {
  id: 'de8faed9-2d35-454f-9260-31880d197059',
  slug: 'fabbrica-burger',
  nombre: 'La Fabbrica Burger & Pizza',
  descripcion: 'Hamburguesas smash artesanales y pizzas al horno de leña.',
  rubro: 'hamburgueseria',
  logo_url: '🍔',
  color_primario: '#f59e0b',
  color_secundario: '#0f172a',
  telefono_contacto: '+54 9 11 2345-6789',
  direccion: 'Av. Corrientes 1420',
  monto_por_punto: 100,
  puntos_bienvenida: 50,
  pin_mostrador: '1234',
};

export const DEMO_PREMIOS: Premio[] = [
  {
    id: 'p1',
    comercio_id: 'de8faed9-2d35-454f-9260-31880d197059',
    titulo: 'Porción de Papas Cheddar & Bacon',
    descripcion: 'Papas rústicas crujientes con salsa cheddar casera y crocante de panceta.',
    puntos_requeridos: 150,
    activo: true,
    orden: 1,
  },
  {
    id: 'p2',
    comercio_id: 'de8faed9-2d35-454f-9260-31880d197059',
    titulo: 'Pinta de Cerveza Artesanal o Gaseosa',
    descripcion: 'Pinta IPA/Honey o gaseosa línea grande a elección.',
    puntos_requeridos: 200,
    activo: true,
    orden: 2,
  },
  {
    id: 'p3',
    comercio_id: 'de8faed9-2d35-454f-9260-31880d197059',
    titulo: 'Burger Doble Especial con Papas',
    descripcion: 'Doble medallón 100% carne de pastura, queso americano, salsa especial y papas fritas.',
    puntos_requeridos: 450,
    activo: true,
    orden: 3,
  },
  {
    id: 'p4',
    comercio_id: 'de8faed9-2d35-454f-9260-31880d197059',
    titulo: 'Pizza Grande Especial a la Piedra',
    descripcion: '8 porciones a elección (Muzzarella especial, Fugazzeta o Pepperoni).',
    puntos_requeridos: 600,
    activo: true,
    orden: 4,
  },
];

export function calcularSaludCliente(puntosHistoricos: number, rachaVisitas: number, diasInactivo: number): { score: number; estado: EstadoLealtad } {
  let recenciaScore = Math.max(0, 40 - diasInactivo * 2);
  let frecuenciaScore = Math.min(35, rachaVisitas * 5);
  let volumenScore = Math.min(25, Math.floor(puntosHistoricos / 20));

  const totalScore = Math.min(100, Math.round(recenciaScore + frecuenciaScore + volumenScore));

  let estado: EstadoLealtad = 'crecimiento';
  if (diasInactivo > 30) {
    estado = 'inactivo';
  } else if (diasInactivo > 14) {
    estado = 'en_riesgo';
  } else if (totalScore >= 70 || rachaVisitas >= 5) {
    estado = 'vip';
  } else {
    estado = 'crecimiento';
  }

  return { score: totalScore, estado };
}

export const LoyaltyStore = {
  // Obtener Comercio (de Supabase con fallback a demo)
  getComercio: async (slug: string): Promise<Comercio> => {
    try {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (data && !error) return data as Comercio;
    } catch (e) {
      console.warn('Usando fallback de comercio local', e);
    }
    return DEMO_COMERCIO;
  },

  // Obtener Premios
  getPremios: async (comercioId: string): Promise<Premio[]> => {
    try {
      const { data, error } = await supabase
        .from('premios')
        .select('*')
        .eq('comercio_id', comercioId)
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (data && !error && data.length > 0) return data as Premio[];
    } catch (e) {
      console.warn('Usando fallback de premios local', e);
    }
    return DEMO_PREMIOS;
  },

  // Obtener Clientes
  getClientes: async (comercioId: string): Promise<Cliente[]> => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        return (data as any[]).map((c) => {
          const diasInactivo = Math.floor((Date.now() - new Date(c.ultima_visita).getTime()) / (1000 * 3600 * 24));
          const { score, estado } = calcularSaludCliente(c.puntos_historicos, c.racha_visitas, diasInactivo);
          return {
            ...c,
            loyalty_score: c.loyalty_score || score,
            estado_lealtad: (c.estado_lealtad as EstadoLealtad) || estado,
          };
        });
      }
    } catch (e) {
      console.warn('Error al leer clientes de Supabase', e);
    }
    return [];
  },

  // Obtener Cliente por Teléfono
  getClientePorTelefono: async (comercioId: string, telefono: string): Promise<Cliente | null> => {
    const limpio = telefono.replace(/\D/g, '');
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('comercio_id', comercioId)
        .eq('telefono', limpio)
        .maybeSingle();

      if (data && !error) {
        const diasInactivo = Math.floor((Date.now() - new Date(data.ultima_visita).getTime()) / (1000 * 3600 * 24));
        const { score, estado } = calcularSaludCliente(data.puntos_historicos, data.racha_visitas, diasInactivo);
        return {
          ...data,
          loyalty_score: data.loyalty_score || score,
          estado_lealtad: (data.estado_lealtad as EstadoLealtad) || estado,
        } as Cliente;
      }
    } catch (e) {
      console.warn('Error al buscar cliente en Supabase', e);
    }
    return null;
  },

  // Registrar o Login de Cliente
  registrarOObtenerCliente: async (comercioId: string, nombre: string, telefono: string): Promise<Cliente> => {
    const limpio = telefono.replace(/\D/g, '');
    const existente = await LoyaltyStore.getClientePorTelefono(comercioId, limpio);
    if (existente) return existente;

    const { score, estado } = calcularSaludCliente(50, 1, 0);

    const nuevo = {
      comercio_id: comercioId,
      telefono: limpio,
      nombre: nombre.trim(),
      puntos_actuales: 50,
      puntos_historicos: 50,
      racha_visitas: 1,
      ultima_visita: new Date().toISOString(),
      loyalty_score: score,
      estado_lealtad: estado,
    };

    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert(nuevo)
        .select()
        .single();

      if (data && !error) {
        await supabase.from('transacciones_puntos').insert({
          comercio_id: comercioId,
          cliente_id: data.id,
          tipo: 'bienvenida',
          puntos: 50,
          descripcion: 'Puntos de regalo de bienvenida al club',
        });
        return data as Cliente;
      }
    } catch (e) {
      console.error('Error insertando cliente en Supabase', e);
    }

    return {
      id: `cli-${Date.now()}`,
      ...nuevo,
    } as Cliente;
  },

  // Sumar Puntos
  sumarPuntos: async (
    comercioId: string,
    clienteId: string,
    puntos: number,
    montoCompra?: number,
    motivo: string = 'Compra en local'
  ): Promise<Cliente | null> => {
    try {
      // 1. Obtener cliente actual
      const { data: cliente, error: errFetch } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .single();

      if (cliente && !errFetch) {
        const nuevosPuntos = cliente.puntos_actuales + puntos;
        const nuevoHistorico = cliente.puntos_historicos + puntos;
        const nuevaRacha = (cliente.racha_visitas || 1) + 1;
        const { score, estado } = calcularSaludCliente(nuevoHistorico, nuevaRacha, 0);

        const { data: actualizado, error: errUpdate } = await supabase
          .from('clientes')
          .update({
            puntos_actuales: nuevosPuntos,
            puntos_historicos: nuevoHistorico,
            racha_visitas: nuevaRacha,
            ultima_visita: new Date().toISOString(),
            loyalty_score: score,
            estado_lealtad: estado,
          })
          .eq('id', clienteId)
          .select()
          .single();

        if (actualizado && !errUpdate) {
          await supabase.from('transacciones_puntos').insert({
            comercio_id: comercioId,
            cliente_id: clienteId,
            tipo: 'compra',
            puntos: puntos,
            monto_compra: montoCompra || 0,
            descripcion: motivo,
          });
          return actualizado as Cliente;
        }
      }
    } catch (e) {
      console.error('Error sumando puntos en Supabase', e);
    }
    return null;
  },

  // Canjear Premio
  canjearPremio: async (
    comercioId: string,
    clienteId: string,
    premioId: string
  ): Promise<{ exito: boolean; canje?: Canje; mensaje?: string }> => {
    try {
      const { data: cliente } = await supabase.from('clientes').select('*').eq('id', clienteId).single();
      const { data: premio } = await supabase.from('premios').select('*').eq('id', premioId).single();

      if (!cliente || !premio) {
        return { exito: false, mensaje: 'Cliente o premio no encontrado' };
      }

      if (cliente.puntos_actuales < premio.puntos_requeridos) {
        return { exito: false, mensaje: `Puntos insuficientes. Necesitás ${premio.puntos_requeridos} pts.` };
      }

      const nuevosPuntos = cliente.puntos_actuales - premio.puntos_requeridos;
      await supabase.from('clientes').update({ puntos_actuales: nuevosPuntos }).eq('id', clienteId);

      const codigo = `CANJE-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: canjeCreado } = await supabase
        .from('canjes')
        .insert({
          comercio_id: comercioId,
          cliente_id: clienteId,
          premio_id: premioId,
          puntos_utilizados: premio.puntos_requeridos,
          codigo_canje: codigo,
          estado: 'completado',
        })
        .select()
        .single();

      await supabase.from('transacciones_puntos').insert({
        comercio_id: comercioId,
        cliente_id: clienteId,
        tipo: 'canje',
        puntos: -premio.puntos_requeridos,
        descripcion: `Canje de premio: ${premio.titulo} (Código: ${codigo})`,
      });

      return {
        exito: true,
        canje: {
          id: canjeCreado?.id || `canje-${Date.now()}`,
          comercio_id: comercioId,
          cliente_id: clienteId,
          premio_id: premioId,
          premio_titulo: premio.titulo,
          puntos_utilizados: premio.puntos_requeridos,
          codigo_canje: codigo,
          estado: 'completado',
          created_at: new Date().toISOString(),
        },
      };
    } catch (e) {
      console.error('Error al canjear premio en Supabase', e);
      return { exito: false, mensaje: 'Error al procesar el canje' };
    }
  },

  // Obtener Transacciones
  getTransacciones: async (comercioId: string, clienteId?: string): Promise<TransaccionPuntos[]> => {
    try {
      let query = supabase
        .from('transacciones_puntos')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (clienteId) {
        query = query.eq('cliente_id', clienteId);
      }

      const { data, error } = await query;
      if (data && !error) return data as TransaccionPuntos[];
    } catch (e) {
      console.warn('Error consultando transacciones en Supabase', e);
    }
    return [];
  },
};
