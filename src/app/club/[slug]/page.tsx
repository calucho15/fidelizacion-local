'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { Cliente, Premio, Comercio } from '@/types';
import { Award, Gift, Sparkles, CheckCircle2, QrCode, ArrowRight, UserCheck, Flame, RotateCcw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

export default function ClubClientePage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'cafe-paris';
  
  const [comercio, setComercio] = useState<Comercio>(DEMO_COMERCIO);
  const [premios, setPremios] = useState<Premio[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  
  // Formulario de registro rápido
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarQR, setMostrarQR] = useState(false);
  const [girandoRuleta, setGirandoRuleta] = useState(false);
  const [premioRuleta, setPremioRuleta] = useState<string | null>(null);

  useEffect(() => {
    const c = LoyaltyStore.getComercio(slug);
    setComercio(c);
    setPremios(LoyaltyStore.getPremios(c.id));

    // Si ya había una sesión guardada en este dispositivo
    const ultimoTel = localStorage.getItem(`ultimo_telefono_${c.id}`);
    if (ultimoTel) {
      const cli = LoyaltyStore.getClientePorTelefono(c.id, ultimoTel);
      if (cli) setCliente(cli);
    }
  }, [slug]);

  const handleRegistroOIngreso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefono) return;
    setLoading(true);

    setTimeout(() => {
      const cli = LoyaltyStore.registrarOObtenerCliente(
        comercio.id,
        nombre.trim() || 'Cliente Fiel',
        telefono
      );
      setCliente(cli);
      localStorage.setItem(`ultimo_telefono_${comercio.id}`, cli.telefono);
      setLoading(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 400);
  };

  const handleCanjear = (premio: Premio) => {
    if (!cliente) return;
    if (cliente.puntos_actuales < premio.puntos_requeridos) {
      alert(`Te faltan ${premio.puntos_requeridos - cliente.puntos_actuales} puntos para este premio.`);
      return;
    }

    const confirmacion = window.confirm(`¿Quieres canjear "${premio.titulo}" por ${premio.puntos_requeridos} puntos?`);
    if (!confirmacion) return;

    const res = LoyaltyStore.canjearPremio(comercio.id, cliente.id, premio.id);
    if (res.exito && res.canje) {
      confetti({ particleCount: 120, spread: 80 });
      setCliente({ ...cliente, puntos_actuales: cliente.puntos_actuales - premio.puntos_requeridos });
      setMensajeExito(`¡Premio canjeado! Muestra el código [${res.canje.codigo_canje}] al cajero.`);
      setTimeout(() => setMensajeExito(''), 7000);
    } else {
      alert(res.mensaje || 'Error al canjear');
    }
  };

  const handleGirarRuleta = () => {
    if (girandoRuleta || !cliente) return;
    setGirandoRuleta(true);
    setPremioRuleta(null);

    const opciones = [20, 50, 100, 30];
    const premioGanado = opciones[Math.floor(Math.random() * opciones.length)];

    setTimeout(() => {
      setGirandoRuleta(false);
      setPremioRuleta(`¡Ganaste +${premioGanado} Puntos extra! 🎉`);
      const actualizado = LoyaltyStore.sumarPuntos(comercio.id, cliente.id, premioGanado, 0, 'Premio ruleta de la suerte');
      if (actualizado) setCliente({ ...actualizado });
      confetti({ particleCount: 100, spread: 90 });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 selection:bg-teal-500 selection:text-white">
      {/* Contenedor estilo App Móvil */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header con marca del comercio */}
        <div 
          className="p-6 relative text-white"
          style={{ background: `linear-gradient(135deg, ${comercio.color_secundario} 0%, #0d1b2a 100%)` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-2xl border border-white/20">
                {comercio.logo_url}
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">{comercio.nombre}</h1>
                <p className="text-xs text-teal-400 font-medium tracking-wide uppercase">Club de Beneficios</p>
              </div>
            </div>
            {cliente && (
              <button 
                onClick={() => setMostrarQR(!mostrarQR)}
                className="p-2.5 bg-slate-700/60 hover:bg-slate-700 text-teal-300 rounded-xl border border-slate-600 transition"
                title="Ver mi QR"
              >
                <QrCode className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mensaje de alerta / éxito */}
        {mensajeExito && (
          <div className="mx-4 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Modal / Acordeón de Código QR */}
        {mostrarQR && cliente && (
          <div className="p-6 mx-4 my-3 bg-white text-slate-900 rounded-2xl text-center flex flex-col items-center animate-in fade-in">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tu código para sumar puntos</p>
            <QRCodeSVG value={cliente.telefono} size={150} level="M" />
            <p className="mt-3 font-mono font-bold text-base">{cliente.telefono}</p>
            <p className="text-xs text-slate-500">Muestra este código al cajero en el mostrador</p>
            <button 
              onClick={() => setMostrarQR(false)}
              className="mt-3 text-xs text-slate-600 underline font-medium"
            >
              Cerrar QR
            </button>
          </div>
        )}

        {/* Estado 1: Registro rápido si no hay sesión */}
        {!cliente ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-500/10 text-teal-400 rounded-2xl mb-3 border border-teal-500/20">
                <Gift className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold">¡Bienvenido a nuestro Club!</h2>
              <p className="text-sm text-slate-400 mt-1">
                Ingresá tu WhatsApp y llevate <strong className="text-teal-400">{comercio.puntos_bienvenida} puntos de regalo</strong> de inmediato.
              </p>
            </div>

            <form onSubmit={handleRegistroOIngreso} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tu Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Laura Martínez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tu Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Ej: 11 2345 6789"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
              >
                {loading ? 'Accediendo...' : 'Comenzar a sumar puntos'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-slate-500">
              Sin descargas de App Store. Tus puntos se guardan automáticamente en este navegador.
            </p>
          </div>
        ) : (
          /* Estado 2: Dashboard del Cliente */
          <div className="p-5 flex flex-col gap-5">
            {/* Tarjeta de Puntos y Racha */}
            <div className="relative p-5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-slate-950 shadow-xl overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-teal-950/70 uppercase tracking-wider">Puntos acumulados</p>
                  <p className="text-4xl font-extrabold tracking-tight mt-0.5">{cliente.puntos_actuales}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/20 px-2.5 py-1 rounded-full text-xs font-bold text-slate-950">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Racha: {cliente.racha_visitas} visitas</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center text-xs font-medium text-teal-950">
                <span>Hola, <strong>{cliente.nombre}</strong></span>
                <button 
                  onClick={() => setMostrarQR(true)}
                  className="flex items-center gap-1 underline font-bold"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Mostrar QR
                </button>
              </div>
            </div>

            {/* Minijuego: Ruleta de la Suerte */}
            <div className="p-4 bg-slate-900 border border-teal-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ruleta de la Suerte</h4>
                  <p className="text-xs text-slate-400">
                    {premioRuleta ? premioRuleta : 'Probá tu suerte del día'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleGirarRuleta}
                disabled={girandoRuleta}
                className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${girandoRuleta ? 'animate-spin' : ''}`} />
                {girandoRuleta ? 'Girando...' : 'Girar'}
              </button>
            </div>

            {/* Catálogo de Premios */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-400" />
                  Premios Disponibles
                </h3>
                <span className="text-xs text-slate-400">{premios.length} premios</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {premios.map((premio) => {
                  const alcanzado = cliente.puntos_actuales >= premio.puntos_requeridos;
                  const progreso = Math.min(100, Math.round((cliente.puntos_actuales / premio.puntos_requeridos) * 100));

                  return (
                    <div 
                      key={premio.id}
                      className={`p-3.5 rounded-2xl border transition ${
                        alcanzado 
                          ? 'bg-slate-900 border-teal-500/50 shadow-md shadow-teal-500/5' 
                          : 'bg-slate-900/60 border-slate-700/60 opacity-80'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-slate-200">{premio.titulo}</h4>
                          {premio.descripcion && (
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{premio.descripcion}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${alcanzado ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'}`}>
                            {premio.puntos_requeridos} pts
                          </span>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${alcanzado ? 'bg-teal-400' : 'bg-slate-600'}`}
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                        <button
                          onClick={() => handleCanjear(premio)}
                          disabled={!alcanzado}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                            alcanzado 
                              ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm' 
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {alcanzado ? 'Canjear' : `Faltan ${premio.puntos_requeridos - cliente.puntos_actuales}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Salir / Cambiar de cuenta */}
            <div className="text-center pt-2">
              <button 
                onClick={() => {
                  setCliente(null);
                  localStorage.removeItem(`ultimo_telefono_${comercio.id}`);
                }}
                className="text-xs text-slate-500 hover:text-slate-400"
              >
                Cerrar sesión / Cambiar de teléfono
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
