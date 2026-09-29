'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { Cliente, Comercio, EstadoLealtad } from '@/types';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  MessageCircle, 
  DollarSign, 
  ArrowLeft, 
  Search, 
  Flame, 
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'fabbrica-burger';

  const [comercio, setComercio] = useState<Comercio>(DEMO_COMERCIO);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const c = await LoyaltyStore.getComercio(slug);
      setComercio(c);
      const clis = await LoyaltyStore.getClientes(c.id);
      setClientes(clis);
      setLoading(false);
    }
    load();
  }, [slug]);

  // Cálculos de segmentación RFM
  const clientesVIP = clientes.filter((c) => c.estado_lealtad === 'vip');
  const clientesCrecimiento = clientes.filter((c) => c.estado_lealtad === 'crecimiento');
  const clientesEnRiesgo = clientes.filter((c) => c.estado_lealtad === 'en_riesgo');
  const clientesInactivos = clientes.filter((c) => c.estado_lealtad === 'inactivo');

  // Estimación de Dinero Recuperado ($22.000 por cliente gastronómico retenido)
  const dineroRecuperadoEstimado = (clientesVIP.length + clientesCrecimiento.length) * 22000;

  // Filtrado de la lista
  const clientesFiltrados = clientes.filter((c) => {
    const coincideFiltro = filtroEstado === 'todos' || c.estado_lealtad === filtroEstado;
    const coincideBusqueda = 
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      c.telefono.includes(busqueda);
    return coincideFiltro && coincideBusqueda;
  });

  const generarEnlaceWhatsAppRescate = (cliente: Cliente) => {
    const mensaje = `¡Hola ${cliente.nombre}! Te extrañamos en ${comercio.nombre} 🍔🍕. ` +
      `Vimos que tenés ${cliente.puntos_actuales} puntos listos para canjear y estás muy cerca de tu próximo premio. ` +
      `Si venís a comer o pedís delivery esta semana te regalamos puntos dobles en tu cuenta. ¡Te esperamos!`;
    return `https://wa.me/${cliente.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
  };

  const getBadgeEstado = (estado: EstadoLealtad) => {
    switch (estado) {
      case 'vip':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🟢 VIP / Fiel</span>;
      case 'crecimiento':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">🔵 En Crecimiento</span>;
      case 'en_riesgo':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">🟡 En Riesgo</span>;
      case 'inactivo':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">🔴 Inactivo</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Encabezado del Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{comercio.logo_url}</span>
                <h1 className="text-xl md:text-2xl font-black text-white">{comercio.nombre}</h1>
                <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold rounded-full">
                  Supabase Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer Loyalty Intelligence Engine · Salud y Retención de Clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/caja/${slug}`}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              Ir a Caja ↗
            </Link>
            <Link
              href={`/club/${slug}`}
              target="_blank"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              Ver App Cliente
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tarjetas de Métricas Principales (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Clientes */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total en el Club</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-white">{clientes.length}</p>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Sincronizado en Supabase
              </p>
            </div>
          </div>

          {/* Clientes VIP */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clientes VIP / Fieles</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-emerald-400">{clientesVIP.length}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Generan el 60% del consumo habitual
              </p>
            </div>
          </div>

          {/* Clientes en Riesgo (Alerta) */}
          <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">En Riesgo de Abandono</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-amber-300">{clientesEnRiesgo.length}</p>
              <p className="text-xs text-amber-200/80 font-medium mt-1">
                Excedieron su ciclo habitual de visita
              </p>
            </div>
          </div>

          {/* Métrica Estrella: Dinero Recuperado */}
          <div className="p-5 bg-gradient-to-br from-amber-950 to-slate-900 border border-amber-500/40 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Dinero Recuperado</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-black text-amber-300">
                ${dineroRecuperadoEstimado.toLocaleString()}
              </p>
              <p className="text-xs text-amber-400 font-medium mt-1">
                Ventas estimadas retenidas
              </p>
            </div>
          </div>

        </div>

        {/* Sección de Rescate Inmediato (Clientes en Riesgo) */}
        {clientesEnRiesgo.length > 0 && (
          <div className="p-6 bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h2 className="text-lg font-bold text-white">
                    Campaña de Rescate: Clientes a punto de perderse
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estos clientes solían venir pero llevan días sin visitarnos.
                  Un mensaje personalizado por WhatsApp con sus puntos los incentiva a volver hoy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clientesEnRiesgo.map((cli) => (
                <div 
                  key={cli.id}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-sm text-white">{cli.nombre}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{cli.telefono}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-amber-400 font-bold">{cli.puntos_actuales} pts acumulados</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">Score: {cli.loyalty_score}/100</span>
                    </div>
                  </div>

                  <a
                    href={generarEnlaceWhatsAppRescate(cli)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Rescatar por WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directorio de Clientes en Supabase */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Directorio de Clientes (Supabase Cloud)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Clasificados automáticamente por el algoritmo RFM</p>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nombre o celular..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Filtros de Pestañas */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-semibold">
            {[
              { id: 'todos', label: `Todos (${clientes.length})` },
              { id: 'vip', label: `🟢 VIP (${clientesVIP.length})` },
              { id: 'crecimiento', label: `🔵 En Crecimiento (${clientesCrecimiento.length})` },
              { id: 'en_riesgo', label: `🟡 En Riesgo (${clientesEnRiesgo.length})` },
              { id: 'inactivo', label: `🔴 Inactivos (${clientesInactivos.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFiltroEstado(tab.id)}
                className={`px-3 py-2 rounded-lg transition whitespace-nowrap ${
                  filtroEstado === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabla de Clientes */}
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-xs text-slate-500 py-6 text-center">Cargando clientes desde Supabase...</p>
            ) : clientesFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">Aún no hay clientes registrados en esta categoría.</p>
                <p className="text-xs text-slate-500 mt-1">Podés registrar clientes de prueba en el panel de mostrador o en la app de cliente.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Cliente</th>
                    <th className="py-3 px-3">Estado Lealtad</th>
                    <th className="py-3 px-3">Loyalty Score</th>
                    <th className="py-3 px-3">Puntos Actuales</th>
                    <th className="py-3 px-3">Visitas</th>
                    <th className="py-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {clientesFiltrados.map((cli) => (
                    <tr key={cli.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{cli.nombre}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{cli.telefono}</span>
                      </td>
                      <td className="py-3 px-3">
                        {getBadgeEstado(cli.estado_lealtad)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                cli.loyalty_score >= 70 ? 'bg-emerald-400' : cli.loyalty_score >= 45 ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                              style={{ width: `${cli.loyalty_score}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-300 font-bold">{cli.loyalty_score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-amber-400 text-sm">{cli.puntos_actuales}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300 font-bold">{cli.racha_visitas} visitas</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={generarEnlaceWhatsAppRescate(cli)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg transition text-[11px] font-bold"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
