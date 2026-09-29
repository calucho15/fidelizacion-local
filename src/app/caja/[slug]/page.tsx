'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { Cliente, Comercio, TransaccionPuntos } from '@/types';
import { 
  Store, 
  Search, 
  PlusCircle, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  DollarSign, 
  Sparkles,
  Ticket
} from 'lucide-react';
import Link from 'next/link';

export default function MostradorCajaPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'cafe-paris';

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
    const c = LoyaltyStore.getComercio(slug);
    setComercio(c);
    cargarHistorial(c.id);
  }, [slug]);

  const cargarHistorial = (comercioId: string) => {
    const txs = LoyaltyStore.getTransacciones(comercioId);
    setHistorialReciente(txs.slice(0, 5));
  };

  const buscarCliente = (tel: string) => {
    setTelefonoBusqueda(tel);
    if (tel.replace(/\D/g, '').length >= 6) {
      const cli = LoyaltyStore.getClientePorTelefono(comercio.id, tel);
      setClienteEncontrado(cli);
    } else {
      setClienteEncontrado(null);
    }
  };

  const handleCrearRapido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTelefono) return;

    const cli = LoyaltyStore.registrarOObtenerCliente(
      comercio.id,
      nuevoNombre.trim() || 'Cliente Nuevo',
      nuevoTelefono
    );
    setClienteEncontrado(cli);
    setMostrarCrear(false);
    setNuevoNombre('');
    setNuevoTelefono('');
    setMensajeExito(`¡Cliente registrado con éxito con ${comercio.puntos_bienvenida} puntos de bienvenida!`);
    cargarHistorial(comercio.id);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const handleSumarPuntos = (puntos: number, monto?: number, nota: string = 'Compra en caja') => {
    if (!clienteEncontrado) return;

    const actualizado = LoyaltyStore.sumarPuntos(comercio.id, clienteEncontrado.id, puntos, monto, nota);
    if (actualizado) {
      setClienteEncontrado({ ...actualizado });
      setMensajeExito(`¡Acreditados +${puntos} puntos a ${actualizado.nombre}! Nuevo saldo: ${actualizado.puntos_actuales} pts.`);
      setMontoTicket('');
      setPuntosPersonalizados('');
      cargarHistorial(comercio.id);
      setTimeout(() => setMensajeExito(''), 5000);
    }
  };

  const calcularPuntosPorMonto = (monto: string) => {
    setMontoTicket(monto);
    const num = parseFloat(monto);
    if (!isNaN(num) && num > 0) {
      // 1 punto cada X pesos
      const pts = Math.floor(num / (comercio.monto_por_punto || 100));
      setPuntosPersonalizados(pts > 0 ? pts.toString() : '1');
    } else {
      setPuntosPersonalizados('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col items-center">
      {/* Barra superior */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/club/${slug}`} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{comercio.logo_url}</span>
              <h1 className="font-bold text-lg md:text-xl text-white">{comercio.nombre}</h1>
              <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Mostrador de Caja
              </span>
            </div>
            <p className="text-xs text-slate-400">Terminal rápida para acreditar puntos a clientes</p>
          </div>
        </div>

        <Link
          href={`/club/${slug}`}
          target="_blank"
          className="text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/30 rounded-lg transition"
        >
          Ver app cliente ↗
        </Link>
      </div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Notificación de éxito */}
        {mensajeExito && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
            <CheckCircle className="w-6 h-6 flex-shrink-0 text-emerald-400" />
            <span className="font-medium">{mensajeExito}</span>
          </div>
        )}

        {/* Búsqueda de Cliente */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            1. Identificar Cliente (WhatsApp o Teléfono)
          </label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="tel"
              placeholder="Ingresá los números del celular (ej: 1123456789)..."
              value={telefonoBusqueda}
              onChange={(e) => buscarCliente(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-lg focus:outline-none focus:border-teal-500 transition"
              autoFocus
            />
          </div>

          {/* Resultado de búsqueda o invitación a crear */}
          {telefonoBusqueda.length >= 6 && !clienteEncontrado && !mostrarCrear && (
            <div className="mt-4 p-4 bg-slate-950/70 border border-dashed border-slate-700 rounded-xl flex items-center justify-between">
              <span className="text-sm text-slate-400">No encontramos un cliente con ese número.</span>
              <button
                onClick={() => {
                  setNuevoTelefono(telefonoBusqueda);
                  setMostrarCrear(true);
                }}
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Registrar ahora
              </button>
            </div>
          )}

          {/* Formulario de registro rápido en caja */}
          {mostrarCrear && (
            <form onSubmit={handleCrearRapido} className="mt-4 p-4 bg-slate-950 border border-teal-500/40 rounded-xl flex flex-col gap-3">
              <h4 className="text-sm font-bold text-teal-400">Registrar nuevo cliente en caja</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  Confirmar y dar bienvenida (+{comercio.puntos_bienvenida} pts)
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarCrear(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-400 text-xs rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Ficha del cliente seleccionado */}
          {clienteEncontrado && (
            <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-teal-400 font-semibold uppercase">Cliente Identificado</span>
                <h3 className="font-bold text-lg text-white">{clienteEncontrado.nombre}</h3>
                <p className="text-xs text-slate-400 font-mono">{clienteEncontrado.telefono}</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Saldo Actual</span>
                  <p className="text-2xl font-black text-teal-400 leading-tight">
                    {clienteEncontrado.puntos_actuales} <span className="text-xs font-normal text-slate-400">pts</span>
                  </p>
                </div>
                <div className="border-l border-slate-700 pl-3">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Visitas</span>
                  <p className="text-lg font-bold text-slate-300 leading-tight">{clienteEncontrado.racha_visitas}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Carga de Puntos (Solo activo cuando hay cliente seleccionado) */}
        <div className={`p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition ${!clienteEncontrado ? 'opacity-40 pointer-events-none' : ''}`}>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            2. Cargar Puntos por Compra
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Por monto de ticket */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Por Monto del Ticket ($)</span>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  placeholder="Ej: 5000"
                  value={montoTicket}
                  onChange={(e) => calcularPuntosPorMonto(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-base focus:border-teal-500 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                ($100 = 1 punto)
              </span>
            </div>

            {/* Puntos resultantes o manuales */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 block mb-1">Puntos a Acreditar</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Pts"
                  value={puntosPersonalizados}
                  onChange={(e) => setPuntosPersonalizados(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-teal-400 font-black text-lg focus:border-teal-500 focus:outline-none font-mono"
                />
                <button
                  onClick={() => {
                    const pts = parseInt(puntosPersonalizados);
                    if (pts > 0) handleSumarPuntos(pts, parseFloat(montoTicket) || 0);
                  }}
                  disabled={!puntosPersonalizados || parseInt(puntosPersonalizados) <= 0}
                  className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-slate-950 font-bold rounded-lg transition whitespace-nowrap text-sm"
                >
                  Cargar
                </button>
              </div>
            </div>
          </div>

          {/* Botones de atajo rápido */}
          <span className="text-xs text-slate-500 block mb-2 font-medium">O atajos de carga rápida directa:</span>
          <div className="grid grid-cols-3 gap-2">
            {[25, 50, 100].map((pts) => (
              <button
                key={pts}
                onClick={() => handleSumarPuntos(pts, 0, 'Carga rápida')}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-sm rounded-xl border border-slate-700 transition"
              >
                +{pts} Puntos
              </button>
            ))}
          </div>
        </div>

        {/* 3. Últimos movimientos en el mostrador */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" />
              Últimas Operaciones en Caja
            </h3>
            <span className="text-xs text-slate-500">En tiempo real</span>
          </div>

          {historialReciente.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">Aún no hay transacciones registradas hoy.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {historialReciente.map((tx) => (
                <div key={tx.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{tx.descripcion || 'Operación'}</span>
                    <span className="text-slate-500 text-[11px] block">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${tx.puntos > 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                    {tx.puntos > 0 ? `+${tx.puntos}` : tx.puntos} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
