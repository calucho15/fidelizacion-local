'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Smartphone, 
  Store, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Award, 
  Users, 
  Clock, 
  Zap,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

export default function LandingComercial() {
  const whatsappUrl = "https://wa.me/?text=Hola!%20Quiero%20conocer%20m%C3%A1s%20sobre%20el%20sistema%20de%20fidelizaci%C3%B3n%20para%20mi%20negocio";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Barra de Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-teal-500/20">
            F
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Fideliza<span className="text-teal-400">Local</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/caja/cafe-paris"
            className="text-xs md:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition hidden sm:inline-block"
          >
            Demo Caja
          </Link>
          <Link
            href="/club/cafe-paris"
            className="text-xs md:text-sm font-semibold text-teal-400 hover:text-teal-300 px-3 py-2 rounded-lg transition"
          >
            Demo Cliente ↗
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs md:text-sm font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-teal-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hablar por</span> WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Software de Fidelización para Comercios Locales
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15]">
          Tus clientes vuelven más seguido.<br />
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Tu negocio en su bolsillo.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Creá tu propio club de puntos y premios con tu marca en <strong>72 horas</strong>. Sin descargas de App Store ni contratos de permanencia. Con soporte presencial en tu comercio.
        </p>

        {/* Botones de acción principales */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/club/cafe-paris"
            className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-teal-500/25 transition flex items-center justify-center gap-2.5 text-base"
          >
            <Smartphone className="w-5 h-5" />
            Probar App del Cliente (Demo)
          </Link>
          <Link
            href="/caja/cafe-paris"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2.5 text-base"
          >
            <Store className="w-5 h-5 text-teal-400" />
            Ver Panel de Mostrador (Caja)
          </Link>
        </div>

        {/* Sellos de confianza */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl text-xs text-slate-400 font-medium">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Personalizado con tu logo</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Sin contratos forzados</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Listo en 72 horas</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Soporte presencial y WhatsApp</span>
          </div>
        </div>
      </section>

      {/* El Problema Real */}
      <section className="py-16 px-6 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">La Realidad de Todo Comercio</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ¿Cuántos clientes salieron satisfechos de tu local y <span className="text-teal-400">nunca más volvieron</span>?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            No se fueron disconformes: simplemente se olvidaron de volver. Un programa de puntos y recompensas mantiene tu marca en su mente y les da una razón concreta para elegirte en su próxima compra.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Clientes que ya te conocen</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conseguir un cliente nuevo cuesta hasta 5 veces más que hacer que un cliente recurrente vuelva una vez más al mes.
              </p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Premios que motivan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El cliente ve su progreso en vivo: "A solo 50 puntos de mi café gratis". Eso hace que compre nuevamente para alcanzar el premio.
              </p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Cero demora en caja</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El cajero solo pide el número de teléfono o escanea el QR en 3 segundos. Sin interrumpir la fila del local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">Paso a Paso</span>
          <h2 className="text-3xl font-extrabold text-white">¿Cómo funciona para tu comercio?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl relative">
            <span className="text-4xl font-black text-teal-500/20 absolute top-4 right-4">01</span>
            <h3 className="font-bold text-white text-base mb-2">Armamos tu App</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subimos tu logo, colores, y configuramos los premios según tu ticket promedio. Te llevamos el cartel QR para el mostrador.
            </p>
          </div>

          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl relative">
            <span className="text-4xl font-black text-teal-500/20 absolute top-4 right-4">02</span>
            <h3 className="font-bold text-white text-base mb-2">El Cliente Escanea</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Escanea el QR en el mostrador desde su celular. Ingresa su número de WhatsApp y ya recibe puntos de bienvenida al instante.
            </p>
          </div>

          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl relative">
            <span className="text-4xl font-black text-teal-500/20 absolute top-4 right-4">03</span>
            <h3 className="font-bold text-white text-base mb-2">Suma en Cada Visita</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              El cajero carga los puntos en 3 segundos por monto de ticket o botón rápido. También funciona para envíos a domicilio.
            </p>
          </div>

          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl relative">
            <span className="text-4xl font-black text-teal-500/20 absolute top-4 right-4">04</span>
            <h3 className="font-bold text-white text-base mb-2">Canjea y Vuelve</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Al acumular suficientes puntos, canjea su recompensa favorita en el local. ¡Cliente feliz y fiel asegurado!
            </p>
          </div>
        </div>
      </section>

      {/* Rubros ideales */}
      <section className="py-16 px-6 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ideal para cualquier negocio con clientes recurrentes</h2>
            <p className="text-sm text-slate-400 mt-2">Si tus clientes tienen una próxima compra o visita, podés fidelizarlos.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              '☕ Cafeterías y Panaderías',
              '🍔 Hamburgueserías y Restaurantes',
              '🍦 Heladerías',
              '🛒 Minimercados y Almacenes',
              '🥩 Carnicerías y Fiambrerías',
              '✂️ Barberías y Peluquerías',
              '🐶 Veterinarias y Pet Shops',
              '🎾 Canchas de Pádel y Gimnasios',
              '🍷 Vinotecas y Licorerías',
            ].map((rubro, idx) => (
              <span
                key={idx}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs md:text-sm font-semibold text-slate-200"
              >
                {rubro}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            ¿Querés ver cómo funcionaría en tu negocio?
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Vamos a tu local en persona o te enviamos una muestra personalizada con tu logo y premios en menos de 24 horas sin ningún compromiso.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-teal-500/25 transition flex items-center justify-center gap-2 text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar Demostración por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 FidelizaLocal — Plataforma de Fidelización y Retención de Clientes para Comercios.</p>
        <p className="mt-1">PWA Marca Blanca · Sin contratos de permanencia · Soporte local</p>
      </footer>
    </div>
  );
}
