'use client';

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* Hallmark · macrostructure: onboarding-wizard */
/* Hallmark · genre: tactile-craft-hospitality */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoyaltyStore } from '@/lib/store';
import { ModeloFidelizacion } from '@/types';
import { 
  Scissors, 
  UtensilsCrossed, 
  ShoppingBag, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Store, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresetRubro {
  id: string;
  rubro: string;
  modelo: ModeloFidelizacion;
  titulo: string;
  subtitulo: string;
  icono: string;
  metaDefault: number;
  premioDefault: string;
  unidadDefault: string;
  color: string;
  ejemploVisual: string;
}

const PRESETS: PresetRubro[] = [
  {
    id: 'barberia',
    rubro: 'barberia',
    modelo: 'sellos',
    titulo: 'Barbería, Peluquería o Spa',
    subtitulo: 'Tarjeta de sellos por visita o corte',
    icono: '💈',
    metaDefault: 5,
    premioDefault: '6to corte con 50% de descuento',
    unidadDefault: 'Corte',
    color: '#0f172a',
    ejemploVisual: 'Cada 5 cortes de pelo, el 6to a mitad de precio.',
  },
  {
    id: 'gastronomia',
    rubro: 'hamburgueseria',
    modelo: 'gasto',
    titulo: 'Gastronomía, Hamburguesas o Bares',
    subtitulo: 'Puntos por consumo en $ / Bs. (Tasa BCV) + ruleta',
    icono: '🍔',
    metaDefault: 60,
    premioDefault: 'Ración de Tequeños o Refresco de Regalo',
    unidadDefault: 'Consumo',
    color: '#f59e0b',
    ejemploVisual: 'Cada $1 consumido (o su equivalente en Bs. a tasa BCV) suma 1 punto.',
  },
  {
    id: 'retail_calzado',
    rubro: 'calzado_retail',
    modelo: 'retail',
    titulo: 'Zapatería, Moda o Retail',
    subtitulo: 'Compras acumuladas o descuentos por par',
    icono: '👟',
    metaDefault: 10,
    premioDefault: '11vo par al 50% de descuento',
    unidadDefault: 'Par de Calzado',
    color: '#1e293b',
    ejemploVisual: 'Por cada 10 pares de zapatos comprados, el 11vo al 50% OFF.',
  },
  {
    id: 'autolavado',
    rubro: 'autolavado',
    modelo: 'sellos',
    titulo: 'Lavadero de Autos o Taller',
    subtitulo: 'Sellos por servicio o lavado completo',
    icono: '🚗',
    metaDefault: 4,
    premioDefault: '5to lavado completo 100% GRATIS',
    unidadDefault: 'Lavado',
    color: '#0369a1',
    ejemploVisual: 'Cada 4 lavados realizados, el 5to lavado es de regalo.',
  },
];

export default function OnboardingPruebaPage() {
  const router = useRouter();

  // Estados del Wizard
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [presetSeleccionado, setPresetSeleccionado] = useState<PresetRubro>(PRESETS[0]);
  
  // Datos del Formulario
  const [nombreComercio, setNombreComercio] = useState('');
  const [telefonoWhatsApp, setTelefonoWhatsApp] = useState('');
  const [metaSellos, setMetaSellos] = useState<number>(PRESETS[0].metaDefault);
  const [textoPremio, setTextoPremio] = useState<string>(PRESETS[0].premioDefault);
  const [iconoEmoji, setIconoEmoji] = useState<string>(PRESETS[0].icono);
  const [loading, setLoading] = useState(false);

  // Comercio Creado
  const [slugCreado, setSlugCreado] = useState<string>('');
  const [copiado, setCopiado] = useState(false);

  const handleSeleccionarPreset = (p: PresetRubro) => {
    setPresetSeleccionado(p);
    setMetaSellos(p.metaDefault);
    setTextoPremio(p.premioDefault);
    setIconoEmoji(p.icono);
    setPaso(2);
  };

  const handleCrearClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreComercio.trim()) return;
    setLoading(true);

    try {
      // Generar slug limpio
      const baseSlug = nombreComercio
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const slugFinal = `${baseSlug || 'mi-local'}-${Math.floor(100 + Math.random() * 900)}`;

      const nuevo = await LoyaltyStore.createComercio({
        slug: slugFinal,
        nombre: nombreComercio.trim(),
        rubro: presetSeleccionado.rubro,
        logo_url: iconoEmoji,
        color_primario: presetSeleccionado.color,
        color_secundario: '#0f172a',
        telefono_contacto: telefonoWhatsApp.trim(),
        modelo_fidelizacion: presetSeleccionado.modelo,
        meta_sellos: metaSellos,
        premio_sellos: textoPremio.trim(),
        unidad_registro: presetSeleccionado.unidadDefault,
        puntos_bienvenida: presetSeleccionado.modelo === 'sellos' ? 1 : 50,
      });

      setSlugCreado(nuevo.slug);
      setPaso(3);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      alert('Hubo un error al crear tu club. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarEnlace = () => {
    const url = `${window.location.origin}/club/${slugCreado}`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] selection:bg-amber-400 selection:text-stone-950 font-sans">
      
      {/* Header del Asistente */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-display font-extrabold flex items-center justify-center text-base">
              F
            </div>
            <span className="font-display font-bold text-base tracking-tight text-stone-900">
              Fideliza<span className="text-amber-600">Local</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              14 Días de Prueba Gratis
            </span>
          </div>
        </div>
      </header>

      {/* Cuerpo del Asistente */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        
        {/* Indicador de Pasos */}
        <div className="flex items-center justify-center gap-3 mb-10 text-xs font-bold font-mono-digits">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${paso >= 1 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'}`}>
            <span>1</span>
            <span className="font-sans font-semibold hidden sm:inline">Tu Rubro</span>
          </div>
          <div className="w-6 h-0.5 bg-stone-300" />
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${paso >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'}`}>
            <span>2</span>
            <span className="font-sans font-semibold hidden sm:inline">Tu Regla & Datos</span>
          </div>
          <div className="w-6 h-0.5 bg-stone-300" />
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${paso === 3 ? 'bg-amber-500 text-stone-950' : 'bg-stone-200 text-stone-500'}`}>
            <span>3</span>
            <span className="font-sans font-semibold hidden sm:inline">Tu Club Activo</span>
          </div>
        </div>

        {/* PASO 1: Selección de Rubro y Modelo de Fidelización */}
        {paso === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold font-mono-digits uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Paso 1 de 2
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3">
                ¿Qué tipo de comercio tienes?
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                Selecciona tu rubro y adaptaremos automáticamente el modelo de sellos, puntos o descuentos para tu negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSeleccionarPreset(p)}
                  className="btn-tactile p-6 bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-amber-500 rounded-3xl text-left shadow-sm flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl p-3 bg-stone-100 rounded-2xl group-hover:scale-110 transition">
                        {p.icono}
                      </span>
                      <span className="text-[10px] font-mono-digits font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                        {p.modelo === 'sellos' ? 'Tarjeta de Sellos' : p.modelo === 'retail' ? 'Compras Acumuladas' : 'Puntos x Consumo'}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-amber-800 transition">
                      {p.titulo}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {p.subtitulo}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
                    <span className="font-medium text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                      Ej: {p.ejemploVisual}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: Configuración del Comercio y de la Regla */}
        {paso === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center max-w-xl mx-auto">
              <button
                onClick={() => setPaso(1)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 mb-2 inline-flex items-center gap-1"
              >
                ← Cambiar rubro ({presetSeleccionado.titulo})
              </button>
              <h1 className="font-display text-3xl font-extrabold text-stone-900">
                Personalizá las reglas de tu Club
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Ajustá el nombre de tu local y la recompensa que más motivará a tus clientes a volver.
              </p>
            </div>

            <form onSubmit={handleCrearClub} className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Nombre y Emoji */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Nombre de tu Comercio
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Barbería Don Pedro, Calzados Rivas, Pizzería Bella"
                    value={nombreComercio}
                    onChange={(e) => setNombreComercio(e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#fdfcfb] border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                    required
                    autoFocus
                  />
                  <select
                    value={iconoEmoji}
                    onChange={(e) => setIconoEmoji(e.target.value)}
                    className="px-3 py-3 bg-stone-100 border border-stone-300 rounded-xl text-xl cursor-pointer"
                    title="Selecciona el icono de tu comercio"
                  >
                    <option value="💈">💈 Barbería</option>
                    <option value="🍔">🍔 Hamburguesería</option>
                    <option value="🍕">🍕 Pizzería</option>
                    <option value="☕">☕ Cafetería</option>
                    <option value="👟">👟 Zapatería</option>
                    <option value="👕">👕 Ropa / Moda</option>
                    <option value="🚗">🚗 Lavadero</option>
                    <option value="⭐">⭐ Comercio</option>
                  </select>
                </div>
              </div>

              {/* Teléfono WhatsApp del Dueño */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Tu WhatsApp de contacto (para soporte y notificaciones)
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 0414-1234567 o +58 414 1234567"
                  value={telefonoWhatsApp}
                  onChange={(e) => setTelefonoWhatsApp(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fdfcfb] border border-stone-300 rounded-xl text-stone-900 font-mono-digits text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  required
                />
              </div>

              {/* Personalización de la Regla de Recompensa */}
              <div className="p-5 bg-amber-50/70 border border-amber-300/80 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span className="font-display font-bold text-sm text-stone-900">
                    Regla de Recompensa para tu {presetSeleccionado.titulo}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {presetSeleccionado.modelo === 'sellos' 
                        ? 'Sellos o visitas para ganar el premio:' 
                        : presetSeleccionado.modelo === 'retail'
                        ? 'Compras requeridas de producto:'
                        : 'Puntos requeridos para el 1er premio:'}
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="1000"
                      value={metaSellos}
                      onChange={(e) => setMetaSellos(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl font-mono-digits font-bold text-stone-900 text-sm focus:outline-none focus:border-amber-600"
                      required
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      {presetSeleccionado.modelo === 'sellos' ? 'Sugerido: 5 visitas' : presetSeleccionado.modelo === 'retail' ? 'Sugerido: 10 compras' : 'Sugerido: 200 puntos'}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Texto del Premio al completar la meta:
                    </label>
                    <input
                      type="text"
                      value={textoPremio}
                      onChange={(e) => setTextoPremio(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-amber-600"
                      required
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Lo que verá el cliente al desbloquear su recompensa.
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de Creación */}
              <button
                type="submit"
                disabled={loading}
                className="btn-tactile w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-base"
              >
                {loading ? 'Generando tu Club en la nube...' : 'Activar mi Club y Comenzar Prueba de 14 Días Gratis'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-stone-500">
                Sin tarjeta de crédito requerida. Acceso inmediato a tu App y Terminal de Mostrador.
              </p>
            </form>
          </div>
        )}

        {/* PASO 3: Éxito — Tu Club está vivo al instante */}
        {paso === 3 && (
          <div className="space-y-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner">
              🎉
            </div>

            <div className="max-w-md mx-auto">
              <span className="text-xs font-bold font-mono-digits uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                14 Días de Prueba Activos
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-stone-900 mt-3">
                ¡Tu Club de Fidelización está listo!
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                <strong>{nombreComercio}</strong> ya tiene su propia Web App PWA y Terminal de Caja sincronizada en tiempo real.
              </p>
            </div>

            {/* Enlace Compartible */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-xl mx-auto text-left shadow-sm space-y-4">
              <span className="text-xs font-bold text-stone-500 font-mono-digits uppercase tracking-wider block">
                Enlace para tus clientes (o para probar en tu celular):
              </span>
              
              <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-2xl border border-stone-200">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/club/${slugCreado}` : `/club/${slugCreado}`}
                  className="bg-transparent text-xs font-mono-digits font-bold text-stone-800 flex-1 outline-none"
                />
                <button
                  onClick={handleCopiarEnlace}
                  className="btn-tactile px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiado ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Botones de Acceso a las 3 Vistas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Link
                  href={`/club/${slugCreado}`}
                  className="btn-tactile p-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-1"
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs font-bold font-display">App del Cliente</span>
                  <span className="text-[10px] text-stone-800">Ver pase digital</span>
                </Link>

                <Link
                  href={`/caja/${slugCreado}`}
                  className="btn-tactile p-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-1"
                >
                  <Store className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold font-display">Terminal de Caja</span>
                  <span className="text-[10px] text-stone-300">Marcar sellos/puntos</span>
                </Link>

                <Link
                  href={`/admin/${slugCreado}`}
                  className="btn-tactile p-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-1"
                >
                  <TrendingUp className="w-5 h-5 text-stone-600" />
                  <span className="text-xs font-bold font-display">Panel Gerencial</span>
                  <span className="text-[10px] text-stone-500">Métricas y rescate</span>
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
              >
                Volver a la página principal
              </Link>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
