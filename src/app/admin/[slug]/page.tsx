'use client';

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* Hallmark · macrostructure: intelligence-board */
/* Hallmark · genre: tactile-craft-hospitality */

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { getCurrentProfile, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Cliente, Comercio, EstadoLealtad, UsuarioPerfil } from '@/types';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  MessageCircle, 
  DollarSign, 
  ArrowLeft, 
  Search, 
  Flame, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  KeyRound,
  Pencil,
  Crown,
  Clock,
  Check,
  X,
  Lock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

function AdminDashboardContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || 'fabbrica-burger';

  const [comercio, setComercio] = useState<Comercio>(DEMO_COMERCIO);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [userProfile, setUserProfile] = useState<UsuarioPerfil | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Impersonation state (from SuperAdmin)
  const isImpersonating = searchParams.get('impersonate') === 'true' || userProfile?.rol === 'superadmin';

  // Logout state
  const [loggingOut, setLoggingOut] = useState(false);

  // PIN quick-setting modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSaving, setPinSaving] = useState(false);
  const [pinMsg, setPinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [c, profile] = await Promise.all([
        LoyaltyStore.getComercio(slug),
        getCurrentProfile(),
      ]);
      setComercio(c);
      setUserProfile(profile);
      const clis = await LoyaltyStore.getClientes(c.id);
      setClientes(clis);
      setLoading(false);
    }
    load();
  }, [slug]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.error('Error logging out', err);
      router.push('/login');
    }
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      setPinMsg({ type: 'error', text: 'El PIN debe ser de 4 dígitos numéricos' });
      return;
    }
    setPinSaving(true);
    setPinMsg(null);
    try {
      await supabase
        .from('comercios')
        .update({ pin_mostrador: newPin, pin_hash: newPin })
        .eq('id', comercio.id);

      DEMO_COMERCIO.pin_mostrador = newPin;
      DEMO_COMERCIO.pin_hash = newPin;

      setComercio(prev => ({
        ...prev,
        pin_mostrador: newPin,
        pin_hash: newPin,
      }));
      setPinMsg({ type: 'success', text: `PIN de mostrador actualizado a ${newPin}` });
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinMsg(null);
        setNewPin('');
      }, 1200);
    } catch (err: any) {
      setPinMsg({ type: 'error', text: err?.message || 'Error al guardar el PIN' });
    } finally {
      setPinSaving(false);
    }
  };

  // Plan badge calculation
  const plan = comercio.plan || 'starter';
  const esTrial = comercio.estado_cuenta === 'trial';
  let diasTrialRestantes = 14;
  if (comercio.trial_expira_at) {
    const diffTime = new Date(comercio.trial_expira_at).getTime() - Date.now();
    diasTrialRestantes = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Cálculos de segmentación RFM
  const clientesVIP = clientes.filter((c) => c.estado_lealtad === 'vip');
  const clientesCrecimiento = clientes.filter((c) => c.estado_lealtad === 'crecimiento');
  const clientesEnRiesgo = clientes.filter((c) => c.estado_lealtad === 'en_riesgo');
  const clientesInactivos = clientes.filter((c) => c.estado_lealtad === 'inactivo');

  // Estimación de Ingreso Fidelizado ($45 USD promedio por cliente habitual mensual)
  const dineroRecuperadoEstimado = (clientesVIP.length + clientesCrecimiento.length) * 45;

  // Filtrado de la lista
  const clientesFiltrados = clientes.filter((c) => {
    const coincideFiltro = filtroEstado === 'todos' || c.estado_lealtad === filtroEstado;
    const coincideBusqueda = 
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      c.telefono.includes(busqueda);
    return coincideFiltro && coincideBusqueda;
  });

  const generarEnlaceWhatsAppRescate = (cliente: Cliente) => {
    const telLimpio = cliente.telefono.replace(/\D/g, '');
    const telWhatsApp = telLimpio.startsWith('58') ? telLimpio : telLimpio.startsWith('0') ? `58${telLimpio.slice(1)}` : `58${telLimpio}`;
    const mensaje = `¡Hola ${cliente.nombre}! Te extrañamos en ${comercio.nombre}. ` +
      `Vimos que tienes ${cliente.puntos_actuales} puntos listos para canjear y estás muy cerca de tu próximo premio. ` +
      `Si vienes a visitarnos o pides delivery esta semana te regalamos puntos dobles en tu cuenta. ¡Te esperamos!`;
    return `https://wa.me/${telWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  };

  const getBadgeEstado = (estado: EstadoLealtad) => {
    switch (estado) {
      case 'vip':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">VIP / Fiel</span>;
      case 'crecimiento':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">En Crecimiento</span>;
      case 'en_riesgo':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">En Riesgo</span>;
      case 'inactivo':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Inactivo</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1c1917] p-4 md:p-8 font-sans selection:bg-amber-400 selection:text-stone-950">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* 1. SuperAdmin Impersonation Banner (if applicable) */}
        {isImpersonating && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 px-4 py-2.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm border border-amber-300">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span className="text-base">👑</span>
              <span>Modo Auditoría SuperAdmin · Viendo tienda como Carlo</span>
            </div>
            <Link
              href="/superadmin"
              className="btn-tactile text-xs font-bold px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>← Volver a SuperAdmin</span>
            </Link>
          </div>
        )}

        {/* 2. User Session Bar & Controls */}
        <div className="bg-white border border-stone-200/90 rounded-2xl px-4 py-3 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          {/* Left: User status & Plan */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold text-xs">
                {userProfile?.nombre ? userProfile.nombre.charAt(0).toUpperCase() : 'D'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900 leading-tight">
                    {userProfile?.nombre || 'Dueño de Tienda'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded font-semibold border border-stone-200">
                    {userProfile?.rol === 'superadmin' ? 'SuperAdmin' : 'Dueño'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono">
                  {userProfile?.email || `dueno@${comercio.slug}.com`}
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-stone-200 hidden sm:block" />

            {/* Active Plan Badge */}
            <div className="flex items-center gap-1.5">
              {esTrial ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full font-bold font-mono-digits text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Trial 14 Días ({diasTrialRestantes} días restantes)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px]">
                  <Crown className="w-3.5 h-3.5 text-emerald-600" />
                  Plan {plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Starter'}
                </span>
              )}
            </div>
          </div>

          {/* Right: PIN Quick-setting & Logout */}
          <div className="flex flex-wrap items-center gap-2">
            {/* PIN de Mostrador Quick-Setting Pill */}
            <button
              onClick={() => {
                setNewPin(comercio.pin_mostrador || '1234');
                setIsPinModalOpen(true);
              }}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf9f7] hover:bg-amber-50 text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-amber-400 rounded-xl font-semibold transition shadow-xs"
              title="Configurar PIN de mostrador para terminal de caja"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>PIN Mostrador:</span>
              <span className="font-mono-digits font-bold bg-white px-2 py-0.5 rounded-lg border border-stone-200 text-stone-900">
                {comercio.pin_mostrador || '1234'}
              </span>
              <Pencil className="w-3 h-3 text-stone-400" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-xl font-semibold transition shadow-xs disabled:opacity-50"
              title="Cerrar sesión de usuario"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}</span>
            </button>
          </div>
        </div>

        {/* Encabezado del Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-300">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2.5 bg-white hover:bg-stone-100 rounded-xl text-stone-600 hover:text-stone-900 border border-stone-200 transition shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{comercio.logo_url}</span>
                <h1 className="font-display text-xl md:text-2xl font-bold text-stone-900">{comercio.nombre}</h1>
                <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono-digits font-bold rounded-full uppercase">
                  Panel Gerencial
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                Customer Loyalty Intelligence · Salud y Retención de Clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/caja/${slug}`}
              className="text-xs font-semibold px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl transition shadow-sm"
            >
              Abrir Caja
            </Link>
            <Link
              href={`/club/${slug}`}
              target="_blank"
              className="btn-tactile text-xs font-bold px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <span>Ver App Cliente</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Métricas Principales (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-white border border-stone-200/90 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold font-mono-digits uppercase">Clientes en Club</span>
              <Users className="w-4 h-4 text-stone-400" />
            </div>
            <div className="font-mono-digits text-3xl font-black text-stone-900">
              {clientes.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Registrados en base de datos</p>
          </div>

          <div className="p-5 bg-white border border-stone-200/90 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold font-mono-digits uppercase">Clientes VIP / Fieles</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-mono-digits text-3xl font-black text-emerald-700">
              {clientesVIP.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Más de 3 visitas en el mes</p>
          </div>

          <div className="p-5 bg-white border border-stone-200/90 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold font-mono-digits uppercase">En Riesgo de Abandono</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-mono-digits text-3xl font-black text-amber-700">
              {clientesEnRiesgo.length}
            </div>
            <p className="text-[11px] text-amber-800 font-semibold mt-1">Requieren mensaje de rescate</p>
          </div>

          <div className="p-5 bg-stone-900 text-stone-100 rounded-3xl shadow-sm border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold font-mono-digits uppercase text-amber-400">Retención Estimada</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono-digits text-3xl font-black text-white">
              ${dineroRecuperadoEstimado.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Por visitas recurrentes activas</p>
          </div>

        </div>

        {/* Sección de Acción: Recuperación Automatizada por WhatsApp */}
        {clientesEnRiesgo.length > 0 && (
          <div className="p-5 bg-amber-50 border border-amber-300 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-stone-900">
                  Acción recomendada: Tienes {clientesEnRiesgo.length} clientes en riesgo de no volver
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Eran clientes habituales pero pasaron más de 20 días sin visitarte. Puedes enviarles una invitación de regreso con puntos dobles directamente a su WhatsApp.
                </p>
              </div>
            </div>

            <button
              onClick={() => setFiltroEstado('en_riesgo')}
              className="btn-tactile px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition shrink-0 shadow-sm"
            >
              Filtrar y Rescatar Clientes
            </button>
          </div>
        )}

        {/* Tabla de Clientes con Filtros RFM */}
        <div className="bg-white border border-stone-200/90 rounded-3xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Base de Clientes & Loyalty Score
              </h3>
              <p className="text-xs text-stone-500">Métrica calculada por algoritmo RFM (Frecuencia, Recencia y Puntos)</p>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o cel..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#faf9f7] border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Filtros de Pestañas */}
          <div className="flex flex-wrap gap-2 pb-4 mb-4 border-b border-stone-100 text-xs font-semibold">
            {[
              { id: 'todos', label: `Todos (${clientes.length})` },
              { id: 'vip', label: `VIP (${clientesVIP.length})` },
              { id: 'crecimiento', label: `En Crecimiento (${clientesCrecimiento.length})` },
              { id: 'en_riesgo', label: `En Riesgo (${clientesEnRiesgo.length})` },
              { id: 'inactivo', label: `Inactivos (${clientesInactivos.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltroEstado(f.id)}
                className={`btn-tactile px-3 py-1.5 rounded-xl transition ${
                  filtroEstado === f.id
                    ? 'bg-stone-900 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Listado de Clientes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 font-mono-digits uppercase tracking-wider border-b border-stone-100">
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">WhatsApp</th>
                  <th className="pb-3 font-semibold">Puntos</th>
                  <th className="pb-3 font-semibold">Visitas</th>
                  <th className="pb-3 font-semibold">Loyalty Score</th>
                  <th className="pb-3 font-semibold">Estado RFM</th>
                  <th className="pb-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-stone-400">
                      No se encontraron clientes con este filtro.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cli) => (
                    <tr key={cli.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 font-bold text-stone-900">{cli.nombre}</td>
                      <td className="py-3 text-stone-500 font-mono-digits">{cli.telefono}</td>
                      <td className="py-3 font-mono-digits font-bold text-amber-700">
                        {cli.puntos_actuales} pts
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1 font-semibold text-stone-700">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          {cli.racha_visitas}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-stone-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full rounded-full" 
                              style={{ width: `${cli.loyalty_score}%` }} 
                            />
                          </div>
                          <span className="font-mono-digits text-stone-600 font-bold">{cli.loyalty_score}/100</span>
                        </div>
                      </td>
                      <td className="py-3">{getBadgeEstado(cli.estado_lealtad)}</td>
                      <td className="py-3 text-right">
                        <a
                          href={generarEnlaceWhatsAppRescate(cli)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-tactile inline-flex items-center gap-1 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-[11px] rounded-xl transition shadow-xs"
                          title="Enviar mensaje de fidelización a WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* PIN de Mostrador Quick-Setting Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => {
                setIsPinModalOpen(false);
                setPinMsg(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <KeyRound className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  PIN de Mostrador
                </h3>
                <p className="text-xs text-stone-500">Terminal de Caja</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              Este PIN de 4 dígitos es requerido por el personal para desbloquear la terminal de caja en mostrador y sumar puntos o entregar premios.
            </p>

            <form onSubmit={handleSavePin} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold font-mono-digits uppercase tracking-wider text-stone-500 block mb-1.5 text-center">
                  Nuevo PIN (4 dígitos numéricos)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono-digits font-black py-3 bg-[#faf9f7] border border-stone-300 rounded-2xl text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  autoFocus
                />
              </div>

              {pinMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center ${
                    pinMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {pinMsg.text}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setPinMsg(null);
                  }}
                  className="w-1/2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pinSaving || newPin.length !== 4}
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl transition shadow-xs"
                >
                  {pinSaving ? 'Guardando...' : 'Guardar PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center text-amber-700">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm font-semibold">Cargando panel de control...</span>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
