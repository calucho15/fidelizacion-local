'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { Cliente, Comercio, TransaccionPuntos } from '@/types';
import { 
  Search, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  DollarSign
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
    setMensajeExito(`¡Cliente registrado con éxito en Supabase con ${comercio.puntos_bienvenida} puntos de bienvenida!`);
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
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Mostrador / Caja
              </span>
            </div>
            <p className="text-xs text-slate-400">Terminal rápida sincronizada con Supabase Cloud</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/${slug}`}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-lg transition"
          >
            Panel Dueño
          </Link>
          <Link
            href={`/club/${slug}`}
            target="_blank"
            className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition"
          >
            App Cliente ↗
          </Link>
        </div>
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
              placeholder="Ingresá el número de celular del cliente..."
              value={telefonoBusqueda}
              onChange={(e) => buscarCliente(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-lg focus:outline-none focus:border-amber-500 transition"
              autoFocus
            />
          </div>

          {/* Resultado de búsqueda o invitación a crear */}
          {telefonoBusqueda.length >= 6 && !clienteEncontrado && !mostrarCrear && (
            <div className="mt-4 p-4 bg-slate-950/70 border border-dashed border-slate-700 rounded-xl flex items-center justify-between">
              <span className="text-sm text-slate-400">Cliente no registrado en la base de datos.</span>
              <button
                onClick={() => {
                  setNuevoTelefono(telefonoBusqueda);
                  setMostrarCrear(true);
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Registrar en 3 segs
              </button>
            </div>
          )}

          {/* Formulario de registro rápido en caja */}
          {mostrarCrear && (
            <form onSubmit={handleCrearRapido} className="mt-4 p-4 bg-slate-950 border border-amber-500/40 rounded-xl flex flex-col gap-3">
              <h4 className="text-sm font-bold text-amber-400">Registrar nuevo cliente en mostrador</h4>
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
                  placeholder="Teléfono WhatsApp"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  Guardar en Supabase (+{comercio.puntos_bienvenida} pts)
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
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase">Cliente Identificado</span>
                <h3 className="font-bold text-lg text-white">{clienteEncontrado.nombre}</h3>
                <p className="text-xs text-slate-400 font-mono">{clienteEncontrado.telefono}</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Puntos Disponibles</span>
                  <p className="text-2xl font-black text-amber-400 leading-tight">
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

        {/* 2. Carga de Puntos */}
        <div className={`p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition ${!clienteEncontrado ? 'opacity-40 pointer-events-none' : ''}`}>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            2. Cargar Puntos de la Cuenta / Ticket
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Monto del Ticket / Mesa ($)</span>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  placeholder="Ej: 15000"
                  value={montoTicket}
                  onChange={(e) => calcularPuntosPorMonto(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-base focus:border-amber-500 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                ($100 gastados = 1 punto)
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 block mb-1">Puntos a Acreditar</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Pts"
                  value={puntosPersonalizados}
                  onChange={(e) => setPuntosPersonalizados(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-black text-lg focus:border-amber-500 focus:outline-none font-mono"
                />
                <button
                  onClick={() => {
                    const pts = parseInt(puntosPersonalizados);
                    if (pts > 0) handleSumarPuntos(pts, parseFloat(montoTicket) || 0);
                  }}
                  disabled={!puntosPersonalizados || parseInt(puntosPersonalizados) <= 0}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold rounded-lg transition whitespace-nowrap text-sm"
                >
                  Acreditar
                </button>
              </div>
            </div>
          </div>

          <span className="text-xs text-slate-500 block mb-2 font-medium">O atajos directos por consumo:</span>
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 200].map((pts) => (
              <button
                key={pts}
                onClick={() => handleSumarPuntos(pts, 0, 'Carga directa')}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm rounded-xl border border-slate-700 transition"
              >
                +{pts} Puntos
              </button>
            ))}
          </div>
        </div>

        {/* 3. Últimos movimientos */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Operaciones Recientes en la Nube
            </h3>
            <span className="text-xs text-slate-500">Supabase Live</span>
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
                  <span className={`font-mono font-bold text-sm ${tx.puntos > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
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
