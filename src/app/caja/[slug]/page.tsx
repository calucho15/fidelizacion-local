'use client';

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* Hallmark · macrostructure: cashier-workbench */
/* Hallmark · genre: tactile-craft-hospitality */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { Cliente, Comercio, TransaccionPuntos } from '@/types';
import { 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  DollarSign,
  Plus,
  Flame,
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function MostradorCajaPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'fabbrica-burger';

  const [comercio, setComercio] = useState<Comercio>(DEMO_COMERCIO);
  const [telefonoBusqueda, setTelefonoBusqueda] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  
  // Registro rápido en caja
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');

  // Carga de puntos
  const [montoTicket, setMontoTicket] = useState('');
  const [puntosPersonalizados, setPuntosPersonalizados] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [historialReciente, setHistorialReciente] = useState<TransaccionPuntos[]>([]);

  useEffect(() => {
    async function init() {
      const c = await LoyaltyStore.getComercio(slug);
      setComercio(c);
      const txs = await LoyaltyStore.getTransacciones(c.id);
      setHistorialReciente(txs.slice(0, 5));
    }
    init();
  }, [slug]);

  const cargarHistorial = async (comercioId: string) => {
    const txs = await LoyaltyStore.getTransacciones(comercioId);
    setHistorialReciente(txs.slice(0, 5));
  };

  const buscarCliente = async (tel: string) => {
    setTelefonoBusqueda(tel);
    if (tel.replace(/\D/g, '').length >= 6) {
      const cli = await LoyaltyStore.getClientePorTelefono(comercio.id, tel);
      setClienteEncontrado(cli);
    } else {
      setClienteEncontrado(null);
    }
  };

  const handleCrearRapido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTelefono) return;

    const cli = await LoyaltyStore.registrarOObtenerCliente(
      comercio.id,
      nuevoNombre.trim() || 'Cliente Nuevo',
      nuevoTelefono
    );
    setClienteEncontrado(cli);
    setMostrarCrear(false);
    setNuevoNombre('');
    setNuevoTelefono('');
    setMensajeExito(`¡Cliente registrado con éxito con +${comercio.puntos_bienvenida} puntos de bienvenida!`);
    await cargarHistorial(comercio.id);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const handleSumarPuntos = async (puntos: number, monto?: number, nota: string = 'Consumo en restaurante') => {
    if (!clienteEncontrado) return;

    const actualizado = await LoyaltyStore.sumarPuntos(comercio.id, clienteEncontrado.id, puntos, monto, nota);
    if (actualizado) {
      setClienteEncontrado({ ...actualizado });
      setMensajeExito(`¡Acreditados +${puntos} puntos a ${actualizado.nombre}! Nuevo saldo: ${actualizado.puntos_actuales} pts.`);
      setMontoTicket('');
      setPuntosPersonalizados('');
      await cargarHistorial(comercio.id);
      setTimeout(() => setMensajeExito(''), 5000);
    }
  };

  const calcularPuntosPorMonto = (monto: string) => {
    setMontoTicket(monto);
    const num = parseFloat(monto);
    if (!isNaN(num) && num > 0) {
      const pts = Math.floor(num / (comercio.monto_por_punto || 100));
      setPuntosPersonalizados(pts > 0 ? pts.toString() : '1');
    } else {
      setPuntosPersonalizados('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1c1917] p-4 md:p-8 flex flex-col items-center selection:bg-amber-400 selection:text-stone-950 font-sans">
      
      {/* Barra superior de Terminal (Workbench) */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6 pb-4 border-b border-stone-300">
        <div className="flex items-center gap-3">
          <Link 
            href={`/club/${slug}`} 
            className="p-2 bg-white hover:bg-stone-100 rounded-xl text-stone-600 hover:text-stone-900 border border-stone-200 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{comercio.logo_url}</span>
              <h1 className="font-display font-bold text-lg md:text-xl text-stone-900 leading-tight">
                {comercio.nombre}
              </h1>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono-digits px-2 py-0.5 rounded-full font-bold uppercase">
                Terminal Mostrador
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">Operación rápida sincronizada con Supabase Cloud</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/${slug}`}
            className="text-xs font-semibold px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl transition shadow-sm"
          >
            Panel Dueño
          </Link>
          <Link
            href={`/club/${slug}`}
            target="_blank"
            className="btn-tactile text-xs font-bold px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition shadow-sm"
          >
            App Cliente ↗
          </Link>
        </div>
      </div>

      {/* Contenedor Principal de la Terminal */}
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Notificación de éxito */}
        {mensajeExito && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="flex-1">{mensajeExito}</span>
          </div>
        )}

        {/* Búsqueda de Cliente en Mostrador */}
        <div className="p-6 bg-white border border-stone-200/90 rounded-3xl shadow-sm">
          <label className="text-xs font-bold font-mono-digits uppercase tracking-wider text-stone-500 block mb-2">
            1. Identificar Cliente (WhatsApp o Teléfono)
          </label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="tel"
              placeholder="Ingresá o escaneá el número..."
              value={telefonoBusqueda}
              onChange={(e) => buscarCliente(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#faf9f7] border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 font-mono-digits text-lg focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
              autoFocus
            />
          </div>

          {/* Resultado de búsqueda o invitación a crear */}
          {telefonoBusqueda.length >= 6 && !clienteEncontrado && !mostrarCrear && (
            <div className="mt-4 p-4 bg-[#fbfaf8] border border-dashed border-stone-300 rounded-2xl flex items-center justify-between">
              <span className="text-xs text-stone-600">Cliente no registrado en la base de datos.</span>
              <button
                onClick={() => {
                  setNuevoTelefono(telefonoBusqueda);
                  setMostrarCrear(true);
                }}
                className="btn-tactile px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrar en 3 segs</span>
              </button>
            </div>
          )}

          {/* Formulario de registro rápido en caja */}
          {mostrarCrear && (
            <form onSubmit={handleCrearRapido} className="mt-4 p-5 bg-[#faf8f5] border border-amber-300 rounded-2xl flex flex-col gap-3">
              <h4 className="font-display text-sm font-bold text-stone-900">Registrar nuevo cliente en mostrador</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono WhatsApp"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 font-mono-digits focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="btn-tactile px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Guardar en Supabase (+{comercio.puntos_bienvenida} pts)
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarCrear(false)}
                  className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Ficha del cliente seleccionado */}
          {clienteEncontrado && (
            <div className="mt-4 p-4 bg-amber-50/70 border border-amber-300/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-digits text-amber-800 font-bold uppercase tracking-wider">
                  Cliente Identificado
                </span>
                <h3 className="font-display font-bold text-lg text-stone-900 leading-tight">
                  {clienteEncontrado.nombre}
                </h3>
                <p className="text-xs text-stone-500 font-mono-digits">{clienteEncontrado.telefono}</p>
              </div>

              <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-sm">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold font-mono-digits">
                    Saldo Actual
                  </span>
                  <p className="font-mono-digits text-2xl font-black text-amber-700 leading-tight">
                    {clienteEncontrado.puntos_actuales} <span className="text-xs font-normal text-stone-500 font-sans">pts</span>
                  </p>
                </div>
                <div className="pl-3 border-l border-stone-200 text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold font-mono-digits">Racha</span>
                  <p className="text-sm font-bold text-stone-800 flex items-center gap-1 justify-end">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    {clienteEncontrado.racha_visitas} visitas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección 2: Acreditar Puntos (Solo si hay cliente) */}
        {clienteEncontrado && (
          <div className="p-6 bg-white border border-stone-200/90 rounded-3xl shadow-sm space-y-6">
            <span className="text-xs font-bold font-mono-digits uppercase tracking-wider text-stone-500 block">
              2. Cargar Consumo y Asignar Puntos
            </span>

            {/* Acciones Rápidas (Sellos de Visita) */}
            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-2">
                Sellos rápidos por visita habitual:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { pts: 25, label: 'Café / Bebida' },
                  { pts: 50, label: 'Almuerzo / Menú' },
                  { pts: 100, label: 'Cena / Combo' },
                  { pts: 200, label: 'Mesa Grande' },
                ].map((preset) => (
                  <button
                    key={preset.pts}
                    onClick={() => handleSumarPuntos(preset.pts, undefined, preset.label)}
                    className="btn-tactile p-3 bg-[#faf9f7] hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-2xl flex flex-col items-center justify-center transition text-center shadow-xs"
                  >
                    <span className="font-mono-digits text-xl font-bold text-stone-900">
                      +{preset.pts}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carga por Monto de Ticket */}
            <div className="pt-4 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-700 block mb-2">
                O calcular por importe del ticket de caja:
              </span>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="number"
                    placeholder="Monto total del ticket (ej: 4500)"
                    value={montoTicket}
                    onChange={(e) => calcularPuntosPorMonto(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#faf9f7] border border-stone-300 rounded-xl text-sm font-mono-digits text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-center min-w-[90px]">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono-digits font-semibold">Puntos</span>
                    <span className="font-mono-digits font-bold text-base text-amber-700">
                      {puntosPersonalizados || '0'}
                    </span>
                  </div>

                  <button
                    disabled={!puntosPersonalizados || parseInt(puntosPersonalizados) <= 0}
                    onClick={() => handleSumarPuntos(parseInt(puntosPersonalizados), parseFloat(montoTicket))}
                    className="btn-tactile px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-300 font-bold text-xs rounded-xl flex-1 sm:flex-initial transition shadow-sm"
                  >
                    Acreditar Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historial Reciente de la Terminal */}
        <div className="p-6 bg-white border border-stone-200/90 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              Últimas acreditaciones en esta caja
            </h3>
            <span className="text-[11px] font-mono-digits text-stone-500">En vivo Supabase</span>
          </div>

          <div className="divide-y divide-stone-100">
            {historialReciente.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">No hay operaciones recientes registradas hoy.</p>
            ) : (
              historialReciente.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-800">{tx.descripcion || tx.tipo}</span>
                    <span className="block text-[11px] text-stone-400 font-mono-digits">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="font-mono-digits font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    +{tx.puntos} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
