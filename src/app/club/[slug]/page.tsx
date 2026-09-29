'use client';

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* Hallmark · macrostructure: physical-pass-stack */
/* Hallmark · genre: tactile-craft-hospitality */
/* Hallmark · location: Venezuela (Guanare, Portuguesa) */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoyaltyStore, DEMO_COMERCIO } from '@/lib/store';
import { Cliente, Premio, Comercio } from '@/types';
import { 
  Award, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  Flame, 
  RotateCcw,
  Ticket,
  X,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

export default function ClubClientePage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'fabbrica-burger';
  
  const [comercio, setComercio] = useState<Comercio>(DEMO_COMERCIO);
  const [premios, setPremios] = useState<Premio[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  
  // Formulario inteligente de acceso / registro
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [esNuevoCliente, setEsNuevoCliente] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarQR, setMostrarQR] = useState(false);
  const [girandoRuleta, setGirandoRuleta] = useState(false);
  const [premioRuleta, setPremioRuleta] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const c = await LoyaltyStore.getComercio(slug);
      setComercio(c);
      const pr = await LoyaltyStore.getPremios(c.id);
      setPremios(pr);

      // Auto-login por memoria de dispositivo
      const ultimoTel = localStorage.getItem(`ultimo_telefono_${c.id}`);
      if (ultimoTel) {
        const cli = await LoyaltyStore.getClientePorTelefono(c.id, ultimoTel);
        if (cli) setCliente(cli);
      }
    }
    loadData();
  }, [slug]);

  // Paso 1: Verificar si el número de celular ya es miembro del club
  const handleVerificarTelefono = async (e: React.FormEvent) => {
    e.preventDefault();
    const telLimpio = telefono.trim();
    if (!telLimpio) return;
    setLoading(true);

    try {
      const cliExistente = await LoyaltyStore.getClientePorTelefono(comercio.id, telLimpio);
      if (cliExistente) {
        // Cliente ya registrado -> Acceso instantáneo
        setCliente(cliExistente);
        localStorage.setItem(`ultimo_telefono_${comercio.id}`, cliExistente.telefono);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        // No existe en la base de datos -> Pedir nombre para darle la bienvenida
        setEsNuevoCliente(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Registrar nuevo cliente y otorgar puntos de bienvenida
  const handleCompletarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefono || !nombre.trim()) return;
    setLoading(true);

    try {
      const nuevo = await LoyaltyStore.registrarOObtenerCliente(
        comercio.id,
        nombre.trim(),
        telefono.trim()
      );
      setCliente(nuevo);
      localStorage.setItem(`ultimo_telefono_${comercio.id}`, nuevo.telefono);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCanjear = async (premio: Premio) => {
    if (!cliente) return;
    if (cliente.puntos_actuales < premio.puntos_requeridos) {
      alert(`Te faltan ${premio.puntos_requeridos - cliente.puntos_actuales} puntos para este premio.`);
      return;
    }

    const confirmacion = window.confirm(`¿Quieres canjear "${premio.titulo}" por ${premio.puntos_requeridos} puntos?`);
    if (!confirmacion) return;

    const res = await LoyaltyStore.canjearPremio(comercio.id, cliente.id, premio.id);
    if (res.exito && res.canje) {
      confetti({ particleCount: 120, spread: 80 });
      setCliente({ ...cliente, puntos_actuales: cliente.puntos_actuales - premio.puntos_requeridos });
      setMensajeExito(`¡Premio canjeado! Muestra el código [${res.canje.codigo_canje}] al mesonero o cajero.`);
      setTimeout(() => setMensajeExito(''), 8000);
    } else {
      alert(res.mensaje || 'Error al canjear');
    }
  };

  const handleGirarRuleta = async () => {
    if (girandoRuleta || !cliente) return;
    setGirandoRuleta(true);
    setPremioRuleta(null);

    const opciones = [10, 20, 30, 50];
    const premioGanado = opciones[Math.floor(Math.random() * opciones.length)];

    setTimeout(async () => {
      setGirandoRuleta(false);
      setPremioRuleta(`¡Ganaste +${premioGanado} Puntos de regalo! 🎯`);
      const actualizado = await LoyaltyStore.sumarPuntos(comercio.id, cliente.id, premioGanado, 0, 'Premio ruleta de la suerte');
      if (actualizado) setCliente({ ...actualizado });
      confetti({ particleCount: 100, spread: 90 });
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1c1917] flex flex-col items-center justify-start p-3 sm:p-6 selection:bg-amber-400 selection:text-stone-950 font-sans">
      
      {/* Contenedor PWA formato teléfono / Wallet */}
      <div className="w-full max-w-md flex flex-col gap-4 pb-12">
        
        {/* Cabecera del Club / Marca */}
        <header className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 font-display font-extrabold flex items-center justify-center text-xl shadow-sm border border-stone-800">
              {comercio.logo_url || '🍔'}
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-stone-900 leading-tight">
                {comercio.nombre}
              </h1>
              <p className="text-[11px] font-mono-digits tracking-wider uppercase text-amber-800 font-semibold">
                Club de Puntos & Recompensas
              </p>
            </div>
          </div>

          {cliente && (
            <button 
              onClick={() => setMostrarQR(!mostrarQR)}
              className="btn-tactile px-3 py-1.5 bg-stone-900 text-amber-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border border-stone-800"
            >
              <QrCode className="w-4 h-4" />
              <span>Mi QR</span>
            </button>
          )}
        </header>

        {/* Notificación de Éxito / Canje */}
        {mensajeExito && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="flex-1">{mensajeExito}</div>
          </div>
        )}

        {/* Modal de Tarjeta QR para Mostrador o Mesonero */}
        {mostrarQR && cliente && (
          <div className="p-6 bg-white border border-stone-300 rounded-3xl text-center shadow-xl animate-in zoom-in-95 flex flex-col items-center relative">
            <button 
              onClick={() => setMostrarQR(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono-digits uppercase tracking-wider text-stone-500 font-bold mb-1">
              Escanea en caja o con tu mesonero
            </span>
            <h3 className="font-display text-lg font-bold text-stone-900 mb-4">
              Pase Digital de {cliente.nombre}
            </h3>
            
            <div className="p-3 bg-white border-2 border-stone-900 rounded-2xl shadow-inner mb-3">
              <QRCodeSVG value={cliente.telefono} size={160} level="M" />
            </div>

            <p className="font-mono-digits font-bold text-sm text-stone-800">
              {cliente.telefono}
            </p>
            <p className="text-[11px] text-stone-500 mt-1 max-w-xs">
              Presenta este código al mesonero o en caja al momento de pagar para acumular tus puntos o canjear tus premios.
            </p>
          </div>
        )}

        {/* ESTADO 1: Acceso Inteligente por Teléfono o Registro */}
        {!cliente ? (
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            
            {!esNuevoCliente ? (
              /* Sub-paso A: Ingreso rápido con celular (para clientes nuevos o recurrentes) */
              <>
                <div className="text-center">
                  <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-stone-900">
                    Acumula puntos y gana premios
                  </h2>
                  <p className="text-xs text-stone-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Ingresa tu número de WhatsApp para ver tu saldo de puntos o activar tu pase de bienvenida.
                  </p>
                </div>

                <form onSubmit={handleVerificarTelefono} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Tu número de WhatsApp / Celular
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 0414-1234567 o 0412-5556789"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-4 py-3 bg-[#fdfcfb] border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-mono-digits text-sm transition"
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-tactile w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm mt-1"
                  >
                    {loading ? 'Consultando en la base de datos...' : 'Continuar al Club'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              /* Sub-paso B: Es su primera vez en el negocio -> Pedir su nombre para otorgar bienvenida */
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-left">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                    <UserPlus className="w-4 h-4 text-amber-700" />
                    <span>¡Es tu primera visita en {comercio.nombre}!</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    El número <strong className="font-mono-digits text-stone-800">{telefono}</strong> aún no está registrado. Completa tu nombre para crearte tu pase digital y regalarte tus primeros <strong className="text-amber-800 font-mono-digits">+{comercio.puntos_bienvenida} puntos de bienvenida</strong>.
                  </p>
                </div>

                <form onSubmit={handleCompletarRegistro} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      ¿Cómo te llamas? (Nombre y Apellido)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Carlos Rivas"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-4 py-3 bg-[#fdfcfb] border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm transition"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEsNuevoCliente(false)}
                      className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-tactile flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                    >
                      {loading ? 'Creando tu cuenta...' : 'Activar mi Pase y Reclamar Puntos'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 text-center">
              <span className="text-[11px] text-stone-500">
                PWA segura · Guárdala en tu pantalla de inicio en Safari o Chrome
              </span>
            </div>
          </div>
        ) : (
          /* ESTADO 2: Pase Físico Digital de Miembro */
          <div className="flex flex-col gap-4">
            
            {/* Tarjeta Física de Miembro (Estilo Cartulina Artesanal) */}
            <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 shadow-xl border border-stone-800 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-mono-digits uppercase tracking-wider text-amber-400 font-bold block">
                    Pase de Miembro
                  </span>
                  <h2 className="font-display text-2xl font-black text-white tracking-tight">
                    {cliente.nombre}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-800/90 border border-stone-700 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Racha: {cliente.racha_visitas} visitas</span>
                </div>
              </div>

              {/* Saldo de Puntos o Tarjeta de Sellos Dinámica */}
              <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800/90 mb-4">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs text-stone-400">
                    {comercio.modelo_fidelizacion === 'sellos' 
                      ? 'Sellos Acumulados' 
                      : comercio.modelo_fidelizacion === 'retail'
                      ? 'Compras de Calzado'
                      : 'Saldo de Puntos'}
                  </span>
                  <div className="font-display font-black text-3xl text-amber-400 font-mono-digits">
                    {comercio.modelo_fidelizacion === 'sellos' || comercio.modelo_fidelizacion === 'retail' ? (
                      <span>
                        {cliente.puntos_actuales} <span className="text-xs font-normal text-stone-400 font-sans">/ {comercio.meta_sellos || 5}</span>
                      </span>
                    ) : (
                      <span>
                        {cliente.puntos_actuales} <span className="text-xs font-normal text-stone-400 font-sans">pts</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Grilla Táctil de Sellos para Barberías, Lavaderos y Servicios */}
                {(comercio.modelo_fidelizacion === 'sellos' || comercio.modelo_fidelizacion === 'retail') ? (
                  <div className="pt-2 border-t border-stone-800">
                    <div className="flex justify-between items-center text-[11px] text-stone-400 mb-2">
                      <span>Meta: {comercio.premio_sellos || 'Premio al completar la tarjeta'}</span>
                      <span className="text-amber-400 font-bold font-mono-digits">
                        {Math.max(0, (comercio.meta_sellos || 5) - cliente.puntos_actuales) === 0 
                          ? '¡Meta cumplida!' 
                          : `Faltan ${Math.max(0, (comercio.meta_sellos || 5) - cliente.puntos_actuales)}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                      {Array.from({ length: comercio.meta_sellos || 5 }).map((_, idx) => {
                        const stepNum = idx + 1;
                        const isStamped = cliente.puntos_actuales >= stepNum;
                        const isLast = stepNum === (comercio.meta_sellos || 5);

                        return (
                          <div
                            key={stepNum}
                            className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                              isStamped
                                ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold scale-105 shadow-sm'
                                : isLast
                                ? 'bg-amber-950/40 border-amber-500/50 text-amber-400/80 animate-pulse'
                                : 'bg-stone-900 border-stone-800 text-stone-600'
                            }`}
                          >
                            {isStamped ? (
                              <span className="text-base">✓</span>
                            ) : isLast ? (
                              <Gift className="w-4 h-4 text-amber-400" />
                            ) : (
                              <span className="text-[11px] font-mono-digits font-bold">{stepNum}</span>
                            )}
                            <span className="text-[8px] font-mono-digits uppercase tracking-tight">
                              {isLast ? 'PREMIO' : (comercio.unidad_registro || 'VISITA')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Modo Puntos Tradicional / Gastronómico */
                  <div className="mt-3 pt-3 border-t border-stone-800 flex justify-between gap-1.5">
                    {[1, 2, 3, 4, 5].map((step) => {
                      const filled = (cliente.racha_visitas >= step);
                      return (
                        <div 
                          key={step} 
                          className={`flex-1 py-1.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1 transition ${
                            filled 
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' 
                              : 'bg-stone-900 border-stone-800 text-stone-600'
                          }`}
                        >
                          <span className="text-[9px] font-mono-digits">VISITA {step}</span>
                          <div className={`w-2.5 h-2.5 rounded-full ${filled ? 'bg-amber-400' : 'bg-stone-700'}`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botón rápido para abrir QR */}
              <button 
                onClick={() => setMostrarQR(true)}
                className="btn-tactile w-full py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-stone-700 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Mostrar QR para Sumar Puntos en Mesa o Caja</span>
              </button>
            </div>

            {/* Minijuego: Ruleta de la Suerte */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-stone-900">Ruleta de la Suerte</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    {premioRuleta ? premioRuleta : 'Prueba tu suerte y gana puntos extra en tu visita'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGirarRuleta}
                disabled={girandoRuleta}
                className="btn-tactile px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${girandoRuleta ? 'animate-spin' : ''}`} />
                <span>{girandoRuleta ? 'Girando...' : 'Girar'}</span>
              </button>
            </div>

            {/* Catálogo de Premios Gastronómicos */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    Premios Disponibles
                  </h3>
                  <p className="text-[11px] text-stone-500">Canjéalos directamente con tu mesonero o en caja</p>
                </div>
                <span className="text-[11px] font-mono-digits bg-stone-100 px-2 py-0.5 rounded-full text-stone-600 font-semibold">
                  {premios.length} opciones
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {premios.map((premio) => {
                  const alcanzado = cliente.puntos_actuales >= premio.puntos_requeridos;
                  const progreso = Math.min(100, Math.round((cliente.puntos_actuales / premio.puntos_requeridos) * 100));

                  return (
                    <div 
                      key={premio.id}
                      className={`p-4 rounded-2xl border transition ${
                        alcanzado 
                          ? 'bg-amber-50/50 border-amber-300 shadow-sm' 
                          : 'bg-[#faf8f5] border-stone-200 opacity-90'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-display font-bold text-sm text-stone-900">
                            {premio.titulo}
                          </h4>
                          {premio.descripcion && (
                            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                              {premio.descripcion}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs font-mono-digits font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                          alcanzado 
                            ? 'bg-amber-500 text-stone-950' 
                            : 'bg-stone-200 text-stone-700'
                        }`}>
                          {premio.puntos_requeridos} pts
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mt-3.5 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              alcanzado ? 'bg-amber-500' : 'bg-stone-400'
                            }`}
                            style={{ width: `${progreso}%` }}
                          />
                        </div>

                        <button
                          onClick={() => handleCanjear(premio)}
                          disabled={!alcanzado}
                          className={`btn-tactile text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                            alcanzado 
                              ? 'bg-stone-900 hover:bg-stone-800 text-amber-300 shadow-sm' 
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          {alcanzado ? 'Canjear Premio' : `Faltan ${premio.puntos_requeridos - cliente.puntos_actuales}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cerrar Sesión / Cambiar Teléfono */}
            <div className="text-center pt-2">
              <button 
                onClick={() => {
                  setCliente(null);
                  setEsNuevoCliente(false);
                  localStorage.removeItem(`ultimo_telefono_${comercio.id}`);
                }}
                className="text-xs text-stone-500 hover:text-stone-800 transition underline"
              >
                Cerrar sesión / Cambiar de número
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
