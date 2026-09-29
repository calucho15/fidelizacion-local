'use client';

/* Hallmark · genre: tactile-craft-hospitality */
/* Hallmark · macrostructure: multi-step-wizard */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  Tag,
  Palette,
  Gift,
  KeyRound,
  Check,
  PartyPopper,
  Coins
} from 'lucide-react';
import { registerNewStore } from '@/lib/auth';

const RUBROS = [
  { id: 'hamburgueseria', label: 'Hamburguesería', emoji: '🍔', defaultColor: '#f59e0b', defaultPrize: 'Porción de papas cheddar gratis' },
  { id: 'pizzeria', label: 'Pizzería', emoji: '🍕', defaultColor: '#ef4444', defaultPrize: 'Fainá especial o porción extra' },
  { id: 'cafeteria', label: 'Cafetería', emoji: '☕', defaultColor: '#d97706', defaultPrize: 'Café de especialidad al sumar 100 pts' },
  { id: 'cerveceria', label: 'Cervecería', emoji: '🍺', defaultColor: '#eab308', defaultPrize: 'Media pinta artesanal de bienvenida' },
  { id: 'estetica_retail', label: 'Estética / Retail', emoji: '🛍️', defaultColor: '#ec4899', defaultPrize: '15% OFF en tu segunda visita' },
  { id: 'general', label: 'Otro Comercio', emoji: '🏪', defaultColor: '#3b82f6', defaultPrize: 'Premio sorpresa al sumar 100 pts' },
];

const EMOJI_PRESETS = ['🍔', '🍕', '☕', '🍺', '🛍️', '💇', '🌮', '🍦', '🥐', '🏪', '🍩', '🍣'];

const COLOR_PRESETS = [
  { name: 'Ámbar Cálido', hex: '#f59e0b' },
  { name: 'Rojo Pasión', hex: '#ef4444' },
  { name: 'Esmeralda Fresco', hex: '#10b981' },
  { name: 'Azul Intenso', hex: '#3b82f6' },
  { name: 'Violeta Neón', hex: '#8b5cf6' },
  { name: 'Rosa Vibrante', hex: '#ec4899' },
];

export default function RegistroPage() {
  const router = useRouter();

  // Wizard Step
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Cuenta de Acceso
  const [nombreDueno, setNombreDueno] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Identidad del Comercio
  const [nombreComercio, setNombreComercio] = useState('');
  const [rubro, setRubro] = useState(RUBROS[0].id);
  const [slug, setSlug] = useState('');
  const [slugModificadoManualmente, setSlugModificadoManualmente] = useState(false);
  const [logoUrl, setLogoUrl] = useState(RUBROS[0].emoji);
  const [colorPrimario, setColorPrimario] = useState(RUBROS[0].defaultColor);

  // Step 3: Configuración del Club & Mostrador
  const [premioBienvenida, setPremioBienvenida] = useState(RUBROS[0].defaultPrize);
  const [puntosBienvenida, setPuntosBienvenida] = useState(50);
  const [pinMostrador, setPinMostrador] = useState('1234');

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Autogenerar slug cuando cambia el nombre del local si no fue editado manualmente
  useEffect(() => {
    if (!slugModificadoManualmente && nombreComercio) {
      const autoSlug = nombreComercio
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  }, [nombreComercio, slugModificadoManualmente]);

  // Manejar cambio de rubro para sugerir defaults coherentes
  const handleRubroChange = (selectedRubroId: string) => {
    setRubro(selectedRubroId);
    const rubroConfig = RUBROS.find((r) => r.id === selectedRubroId);
    if (rubroConfig) {
      setLogoUrl(rubroConfig.emoji);
      setColorPrimario(rubroConfig.defaultColor);
      setPremioBienvenida(rubroConfig.defaultPrize);
    }
  };

  // Validaciones por paso
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!nombreDueno.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Por favor ingresa un correo electrónico corporativo o personal válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!nombreComercio.trim()) {
      setErrorMessage('Por favor ingresa el nombre de tu local o restaurante.');
      return;
    }
    if (!slug.trim()) {
      setErrorMessage('Por favor define un identificador (slug) para tu club.');
      return;
    }
    setCurrentStep(3);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPin = pinMostrador.trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      setErrorMessage('El PIN de mostrador debe ser de 4 dígitos numéricos.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerNewStore({
        email: email.trim().toLowerCase(),
        password,
        nombreDueno: nombreDueno.trim(),
        nombreComercio: nombreComercio.trim(),
        rubro,
        slug: slug.trim().toLowerCase(),
        logo_url: logoUrl,
        color_primario: colorPrimario,
        puntos_bienvenida: Number(puntosBienvenida) || 50,
        premio_bienvenida: premioBienvenida.trim(),
        pin: cleanPin,
      });

      if (!res.success || !res.comercioSlug) {
        setErrorMessage(res.error || 'No se pudo completar el registro. Intente nuevamente.');
        setLoading(false);
        return;
      }

      // Celebración con confetti
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (confettiErr) {
        console.warn('Efecto visual omitido', confettiErr);
      }

      // Redirección directa al panel de administración del nuevo comercio
      setTimeout(() => {
        router.push(`/admin/${res.comercioSlug}`);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error inesperado durante el registro.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Luces de ambiente decorativas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        {/* Badge de Garantía 14 Días */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prueba 14 Días Gratis · Sin tarjeta de crédito</span>
        </div>
      </header>

      {/* Contenedor Principal del Asistente */}
      <main className="w-full max-w-xl mx-auto px-4 py-4 relative z-10 flex-1 flex flex-col justify-center">
        {/* Cabecera del Wizard */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20 mb-3">
            F
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Lanza el Club de Lealtad de tu Local
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configuración guiada en 3 minutos. Tu terminal y pase digital listos al instante.
          </p>
        </div>

        {/* Barra de Progreso de 3 Pasos */}
        <div className="mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            {/* Paso 1 */}
            <div
              className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition ${
                currentStep === 1
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : currentStep > 1
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 1
                    ? 'bg-amber-500 text-slate-950'
                    : currentStep > 1
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </div>
              <span className="hidden sm:inline">Cuenta</span>
            </div>

            {/* Paso 2 */}
            <div
              className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition ${
                currentStep === 2
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : currentStep > 2
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 2
                    ? 'bg-amber-500 text-slate-950'
                    : currentStep > 2
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
              </div>
              <span className="hidden sm:inline">Tu Local</span>
            </div>

            {/* Paso 3 */}
            <div
              className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition ${
                currentStep === 3
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 3
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                3
              </div>
              <span className="hidden sm:inline">Club & PIN</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Contenido del Paso */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 relative">
          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Celebración de Éxito */}
          {isSuccess ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20 animate-bounce">
                <PartyPopper className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">¡Bienvenido a FidelizaLocal!</h2>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Tu tienda <strong>{nombreComercio}</strong> y tu cuenta de administrador han sido creadas con 14 días de prueba gratuita.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Ingresando a tu panel de control...</span>
              </div>
            </div>
          ) : (
            <>
              {/* PASO 1: Cuenta de Acceso */}
              {currentStep === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Paso 1: Tu Cuenta de Dueño</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ingresa tus datos para administrar tu panel y terminales de caja.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombre del dueño o responsable
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={nombreDueno}
                        onChange={(e) => setNombreDueno(e.target.value)}
                        placeholder="ej: Carlo Rossi"
                        className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email corporativo o comercial
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contacto@tunegocio.com"
                        className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Contraseña segura
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Siguiente: Identidad del Comercio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* PASO 2: Identidad del Comercio */}
              {currentStep === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400" />
                      <span>Paso 2: Identidad de tu Local</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Personaliza cómo verán tus clientes la tarjeta y el club de beneficios.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombre del local comercial
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={nombreComercio}
                        onChange={(e) => setNombreComercio(e.target.value)}
                        placeholder="ej: Café Central o Fabbrica Burger"
                        className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Rubro */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Rubro principal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {RUBROS.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRubroChange(r.id)}
                          className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition ${
                            rubro === r.id
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="text-base">{r.emoji}</span>
                          <span className="truncate">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slug autogenerado */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Enlace web de tu club (Slug)
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        fidelizalocal.com/club/{slug || 'tu-local'}
                      </span>
                    </div>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                          setSlugModificadoManualmente(true);
                        }}
                        placeholder="cafe-central"
                        className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Emoji / Logo & Color Primario */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Emoji representativo
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        {EMOJI_PRESETS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setLogoUrl(emoji)}
                            className={`w-7 h-7 text-sm rounded-lg flex items-center justify-center transition ${
                              logoUrl === emoji
                                ? 'bg-amber-500/30 border border-amber-400 scale-110'
                                : 'hover:bg-slate-800'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Color principal de la marca
                      </label>
                      <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        {COLOR_PRESETS.map((color) => (
                          <button
                            key={color.hex}
                            type="button"
                            onClick={() => setColorPrimario(color.hex)}
                            title={color.name}
                            className={`w-6 h-6 rounded-full transition-transform ${
                              colorPrimario === color.hex ? 'ring-2 ring-white scale-125' : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botones de navegación */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      <span>Siguiente: Club & Mostrador</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* PASO 3: Configuración del Club & Mostrador */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmitFinal} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>Paso 3: Beneficios y Terminal de Mostrador</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Define la recompensa de bienvenida para comensales y el PIN para tus cajeros.
                    </p>
                  </div>

                  {/* Premio de Bienvenida */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Premio estrella de bienvenida (Primer incentivo)
                    </label>
                    <div className="relative">
                      <Gift className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={premioBienvenida}
                        onChange={(e) => setPremioBienvenida(e.target.value)}
                        placeholder="ej: Café de especialidad al sumar 100 pts"
                        className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Puntos de bienvenida y PIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Puntos de regalo de bienvenida
                      </label>
                      <div className="relative">
                        <Coins className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          min="0"
                          max="500"
                          required
                          value={puntosBienvenida}
                          onChange={(e) => setPuntosBienvenida(Number(e.target.value))}
                          className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white outline-none font-mono"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Se acreditan al registrarse el cliente
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        PIN de caja de mostrador (4 dígitos)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={4}
                          required
                          value={pinMostrador}
                          onChange={(e) => setPinMostrador(e.target.value.replace(/\D/g, ''))}
                          placeholder="1234"
                          className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white outline-none font-mono tracking-widest text-center"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Para desbloquear la terminal de caja
                      </span>
                    </div>
                  </div>

                  {/* Vista Previa en Vivo de la Tarjeta Digital */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-semibold text-slate-300">Vista previa del Pase Digital:</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-950 uppercase"
                        style={{ backgroundColor: colorPrimario }}
                      >
                        14 Días Gratis
                      </span>
                    </div>
                    <div className="bg-slate-900 border border-slate-700/70 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md"
                          style={{ backgroundColor: `${colorPrimario}20`, border: `1px solid ${colorPrimario}50` }}
                        >
                          {logoUrl}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white tracking-tight">
                            {nombreComercio || 'Mi Tienda'}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5">
                            <span>Premio inicial:</span>
                            <span className="text-amber-400 font-semibold truncate max-w-[170px]">
                              {premioBienvenida || 'Recompensa'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-amber-400 font-extrabold text-base">
                          +{puntosBienvenida}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Puntos regalo</div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setCurrentStep(2)}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Configurando tu club...</span>
                        </>
                      ) : (
                        <>
                          <span>Lanzar Mi Club Gratis Ahora</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Link a Login */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-400/40 hover:decoration-amber-300 transition"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-500 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60 mt-4">
        <span>© 2026 FidelizaLocal · Plataforma de Lealtad Gastronómica</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sin contratos forzosos · Cancela en cualquier momento</span>
        </div>
      </footer>
    </div>
  );
}
