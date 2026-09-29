'use client';

/* Hallmark · genre: tactile-craft-hospitality */
/* Hallmark · macrostructure: centered-glassmorphic-card */

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crown,
  Delete,
  RotateCcw,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { loginOwner, verifyCashierPin } from '@/lib/auth';

type LoginTab = 'owner' | 'cashier';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState<LoginTab>('owner');

  // Form State: Dueño / Admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form State: Caja / Mostrador
  const [slug, setSlug] = useState('fabbrica-burger');
  const [pin, setPin] = useState('');

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Query parameter errors
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setErrorMessage('Tu sesión no tiene permisos de SuperAdmin.');
    } else if (errorParam === 'forbidden') {
      setErrorMessage('No tienes permiso para acceder a esa tienda.');
    } else if (errorParam === 'expired') {
      setErrorMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
  }, [searchParams]);

  // Demo 1-Click Handlers
  const handleSuperAdminDemo = () => {
    setActiveTab('owner');
    setEmail('admin@fidelizalocal.com');
    setPassword('SuperAdmin*2026');
    setErrorMessage(null);
  };

  const handleComercioDemo = () => {
    setActiveTab('owner');
    setEmail('dueno@fabbricaburger.com');
    setPassword('Fabbrica#2026');
    setErrorMessage(null);
  };

  const handleCajaDemo = () => {
    setActiveTab('cashier');
    setSlug('fabbrica-burger');
    setPin('1234');
    setErrorMessage(null);
  };

  // PIN Keypad Handlers
  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPin('');
  };

  // Submit Dueño / Admin
  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginOwner(email, password);

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Credenciales inválidas. Revisa tu email y contraseña.');
        setLoading(false);
        return;
      }

      setSuccessMessage('¡Acceso concedido! Redirigiendo a tu panel...');

      const redirectParam = searchParams.get('redirect');

      setTimeout(() => {
        if (res.user!.rol === 'superadmin') {
          if (redirectParam && redirectParam.startsWith('/superadmin')) {
            router.push(redirectParam);
          } else {
            router.push('/superadmin');
          }
        } else {
          // comercio_admin
          const storeSlug =
            (res.user as any).slug ||
            (res.user!.comercio_id === 'de8faed9-2d35-454f-9260-31880d197059' ||
            res.user!.email === 'dueno@fabbricaburger.com'
              ? 'fabbrica-burger'
              : 'fabbrica-burger');

          if (redirectParam && redirectParam.startsWith('/admin')) {
            router.push(redirectParam);
          } else {
            router.push(`/admin/${storeSlug}`);
          }
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error de conexión. Intente nuevamente.');
      setLoading(false);
    }
  };

  // Submit Caja / Mostrador
  const handleCashierSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!slug.trim()) {
      setErrorMessage('Ingresa el identificador de la tienda.');
      return;
    }
    if (pin.length !== 4) {
      setErrorMessage('El PIN debe contener exactamente 4 dígitos.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cleanSlug = slug.trim().toLowerCase();
      const res = await verifyCashierPin(cleanSlug, pin);

      if (!res.success) {
        setErrorMessage(res.error || 'PIN incorrecto para esta terminal.');
        setPin('');
        setLoading(false);
        return;
      }

      setSuccessMessage('¡Terminal de caja autorizada! Abriendo punto de venta...');

      setTimeout(() => {
        router.push(`/caja/${cleanSlug}`);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error de verificación de caja.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver a FidelizaLocal</span>
        </Link>

        {/* Security badge */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 backdrop-blur-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Conexión Segura SSL 256-bit</span>
        </div>
      </header>

      {/* Main Glassmorphic Container */}
      <main className="w-full max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20 mb-3">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma integral de lealtad y retención comercial
          </p>
        </div>

        {/* 1-Click Quick Demo Pill Buttons */}
        <div className="mb-5 bg-slate-800/60 border border-slate-700/60 backdrop-blur-md rounded-2xl p-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-2 px-1">
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Acceso Rápido Demo (1-Clic)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">DEV MODE</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleSuperAdminDemo}
              className="px-2 py-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/70 hover:border-amber-500/50 rounded-xl text-left transition flex flex-col items-start group shadow-sm"
            >
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
                <Crown className="w-3 h-3 text-amber-400" />
                SuperAdmin
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate w-full">
                admin@fideliza...
              </span>
            </button>

            <button
              type="button"
              onClick={handleComercioDemo}
              className="px-2 py-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/70 hover:border-amber-500/50 rounded-xl text-left transition flex flex-col items-start group shadow-sm"
            >
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
                <span>🍔</span>
                Fabbrica
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate w-full">
                dueno@fabbrica...
              </span>
            </button>

            <button
              type="button"
              onClick={handleCajaDemo}
              className="px-2 py-2 bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700/70 hover:border-amber-500/50 rounded-xl text-left transition flex flex-col items-start group shadow-sm"
            >
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
                <span>⚡</span>
                Caja Demo
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                PIN: 1234
              </span>
            </button>
          </div>
        </div>

        {/* Card Frame */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/50 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('owner');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'owner'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Dueño / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('cashier');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'cashier'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡</span>
              <span>Caja / Mostrador</span>
            </button>
          </div>

          {/* Feedback: Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Feedback: Success Message */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Dueño / Admin Form */}
          {activeTab === 'owner' && (
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dueno@tunegocio.com"
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar al Panel de Control</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: Caja / Mostrador (PIN Keypad) */}
          {activeTab === 'cashier' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Identificador de tienda (Slug)
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                    placeholder="ej: fabbrica-burger"
                    className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* PIN Display Indicators */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl py-3 px-4 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  PIN de Seguridad de Caja (4 Dígitos)
                </span>
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => {
                    const filled = pin.length > index;
                    return (
                      <div
                        key={index}
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                          filled
                            ? 'bg-amber-400 scale-110 shadow-sm shadow-amber-400/50'
                            : 'bg-slate-800 border border-slate-700'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handlePinDigit(digit)}
                    disabled={loading || pin.length >= 4}
                    className="py-3 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 disabled:opacity-40 text-lg font-bold text-white rounded-xl transition flex items-center justify-center shadow-sm"
                  >
                    {digit}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handlePinClear}
                  disabled={loading || pin.length === 0}
                  className="py-3 bg-slate-950/40 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 active:scale-95 disabled:opacity-30 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePinDigit('0')}
                  disabled={loading || pin.length >= 4}
                  className="py-3 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 disabled:opacity-40 text-lg font-bold text-white rounded-xl transition flex items-center justify-center shadow-sm"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handlePinBackspace}
                  disabled={loading || pin.length === 0}
                  className="py-3 bg-slate-950/40 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 active:scale-95 disabled:opacity-30 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl transition flex items-center justify-center"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              {/* Submit Button for PIN */}
              <button
                type="button"
                onClick={() => handleCashierSubmit()}
                disabled={loading || pin.length !== 4 || !slug.trim()}
                className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Autorizando terminal...</span>
                  </>
                ) : (
                  <>
                    <span>Desbloquear Terminal de Caja</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            ¿Nuevo comercio?{' '}
            <Link
              href="/registro"
              className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-400/40 hover:decoration-amber-300 transition"
            >
              Comienza 14 días gratis
            </Link>
          </p>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Recuperación de Acceso</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Para restablecer tu contraseña o recuperar tu cuenta de comercio, ponte en contacto con nuestro equipo de soporte enviando un correo a:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center font-mono text-xs text-amber-400 mb-4 select-all">
              soporte@fidelizalocal.com
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-500 relative z-10">
        © 2026 FidelizaLocal · Sistema de Fidelización & Control de Lealtad Gastronómica
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-amber-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm font-semibold">Cargando inicio de sesión...</span>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
