import { Comercio, Cliente, Premio, TransaccionPuntos, Canje } from '@/types';

// Comercio de demostración listo para usar
export const DEMO_COMERCIO: Comercio = {
  id: 'demo-comercio-1',
  slug: 'cafe-paris',
  nombre: 'Café & Bakery París',
  descripcion: 'Cafetería de especialidad y pastelería artesanal en el centro de la ciudad.',
  rubro: 'cafeteria',
  logo_url: '☕',
  color_primario: '#00B9B4',
  color_secundario: '#1C2841',
  telefono_contacto: '+54 9 11 2345-6789',
  direccion: 'Av. San Martín 450',
  monto_por_punto: 100, // $100 = 1 punto
  puntos_bienvenida: 50,
  pin_mostrador: '1234',
};

export const DEMO_PREMIOS: Premio[] = [
  {
    id: 'premio-1',
    comercio_id: 'demo-comercio-1',
    titulo: 'Café Espresso o Cortado',
    descripcion: 'Válido para cualquier opción de café clásico en pocillo.',
    puntos_requeridos: 100,
    activo: true,
    orden: 1,
  },
  {
    id: 'premio-2',
    comercio_id: 'demo-comercio-1',
    titulo: 'Medialuna o Donut Artesanal',
    descripcion: 'Acompañamiento a elección recién horneado.',
    puntos_requeridos: 150,
    activo: true,
    orden: 2,
  },
  {
    id: 'premio-3',
    comercio_id: 'demo-comercio-1',
    titulo: '20% OFF en Desayuno o Merienda',
    descripcion: 'Descuento directo aplicado sobre el total de tu ticket.',
    puntos_requeridos: 300,
    activo: true,
    orden: 3,
  },
  {
    id: 'premio-4',
    comercio_id: 'demo-comercio-1',
    titulo: 'Combo Merienda Especial Gratis',
    descripcion: 'Café grande + tostado especial de jamón y queso o torta del día.',
    puntos_requeridos: 500,
    activo: true,
    orden: 4,
  },
];

// Helper para guardar y leer del LocalStorage (persistencia en navegador)
const STORAGE_KEYS = {
  CLIENTES: 'fideliza_clientes',
  TRANSACCIONES: 'fideliza_transacciones',
  CANJES: 'fideliza_canjes',
  PREMIOS: 'fideliza_premios',
};

export const LoyaltyStore = {
  getComercio: (slug: string): Comercio => {
    return DEMO_COMERCIO;
  },

  getPremios: (comercioId: string): Premio[] => {
    if (typeof window === 'undefined') return DEMO_PREMIOS;
    const stored = localStorage.getItem(`${STORAGE_KEYS.PREMIOS}_${comercioId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_PREMIOS;
  },

  getClientes: (comercioId: string): Cliente[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`${STORAGE_KEYS.CLIENTES}_${comercioId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  getClientePorTelefono: (comercioId: string, telefono: string): Cliente | null => {
    const clientes = LoyaltyStore.getClientes(comercioId);
    return clientes.find((c) => c.telefono.replace(/\D/g, '') === telefono.replace(/\D/g, '')) || null;
  },

  registrarOObtenerCliente: (comercioId: string, nombre: string, telefono: string): Cliente => {
    const limpioTel = telefono.replace(/\D/g, '');
    let cliente = LoyaltyStore.getClientePorTelefono(comercioId, limpioTel);

    if (cliente) {
      return cliente;
    }

    const comercio = LoyaltyStore.getComercio('demo');
    const nuevoCliente: Cliente = {
      id: `cli-${Date.now()}`,
      comercio_id: comercioId,
      nombre: nombre.trim(),
      telefono: limpioTel,
      puntos_actuales: comercio.puntos_bienvenida,
      puntos_historicos: comercio.puntos_bienvenida,
      racha_visitas: 1,
      ultima_visita: new Date().toISOString(),
    };

    const clientes = LoyaltyStore.getClientes(comercioId);
    clientes.push(nuevoCliente);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.CLIENTES}_${comercioId}`, JSON.stringify(clientes));
    }

    // Registrar transacción de bienvenida
    LoyaltyStore.registrarTransaccion({
      comercio_id: comercioId,
      cliente_id: nuevoCliente.id,
      tipo: 'bienvenida',
      puntos: comercio.puntos_bienvenida,
      descripcion: 'Puntos de regalo por bienvenida al club',
    });

    return nuevoCliente;
  },

  sumarPuntos: (
    comercioId: string,
    clienteId: string,
    puntos: number,
    montoCompra?: number,
    motivo: string = 'Compra en local'
  ): Cliente | null => {
    const clientes = LoyaltyStore.getClientes(comercioId);
    const index = clientes.findIndex((c) => c.id === clienteId);
    if (index === -1) return null;

    const cliente = clientes[index];
    cliente.puntos_actuales += puntos;
    cliente.puntos_historicos += puntos;
    cliente.racha_visitas += 1;
    cliente.ultima_visita = new Date().toISOString();

    clientes[index] = cliente;
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.CLIENTES}_${comercioId}`, JSON.stringify(clientes));
    }

    LoyaltyStore.registrarTransaccion({
      comercio_id: comercioId,
      cliente_id: cliente.id,
      tipo: 'compra',
      puntos: puntos,
      monto_compra: montoCompra,
      descripcion: motivo,
    });

    return cliente;
  },

  canjearPremio: (comercioId: string, clienteId: string, premioId: string): { exito: boolean; canje?: Canje; mensaje?: string } => {
    const clientes = LoyaltyStore.getClientes(comercioId);
    const cliente = clientes.find((c) => c.id === clienteId);
    const premio = LoyaltyStore.getPremios(comercioId).find((p) => p.id === premioId);

    if (!cliente || !premio) {
      return { exito: false, mensaje: 'Cliente o premio no encontrado' };
    }

    if (cliente.puntos_actuales < premio.puntos_requeridos) {
      return { exito: false, mensaje: `Puntos insuficientes. Necesitas ${premio.puntos_requeridos} pts.` };
    }

    // Descontar puntos
    cliente.puntos_actuales -= premio.puntos_requeridos;
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.CLIENTES}_${comercioId}`, JSON.stringify(clientes));
    }

    const codigo = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevoCanje: Canje = {
      id: `canje-${Date.now()}`,
      comercio_id: comercioId,
      cliente_id: cliente.id,
      premio_id: premio.id,
      premio_titulo: premio.titulo,
      puntos_utilizados: premio.puntos_requeridos,
      codigo_canje: codigo,
      estado: 'completado',
      created_at: new Date().toISOString(),
    };

    LoyaltyStore.registrarTransaccion({
      comercio_id: comercioId,
      cliente_id: cliente.id,
      tipo: 'canje',
      puntos: -premio.puntos_requeridos,
      descripcion: `Canje de premio: ${premio.titulo} (Código: ${codigo})`,
    });

    return { exito: true, canje: nuevoCanje };
  },

  registrarTransaccion: (data: Omit<TransaccionPuntos, 'id' | 'created_at'>): TransaccionPuntos => {
    const tx: TransaccionPuntos = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${STORAGE_KEYS.TRANSACCIONES}_${data.comercio_id}`);
      const list: TransaccionPuntos[] = stored ? JSON.parse(stored) : [];
      list.unshift(tx);
      localStorage.setItem(`${STORAGE_KEYS.TRANSACCIONES}_${data.comercio_id}`, JSON.stringify(list));
    }
    return tx;
  },

  getTransacciones: (comercioId: string, clienteId?: string): TransaccionPuntos[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`${STORAGE_KEYS.TRANSACCIONES}_${comercioId}`);
    if (!stored) return [];
    try {
      const list: TransaccionPuntos[] = JSON.parse(stored);
      if (clienteId) {
        return list.filter((tx) => tx.cliente_id === clienteId);
      }
      return list;
    } catch (e) {
      return [];
    }
  },
};
