'use client';

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* Hallmark · macrostructure: asymmetric-bento */
/* Hallmark · genre: tactile-craft-hospitality */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Store, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Users, 
  Clock, 
  Zap,
  TrendingUp,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Flame,
  Gift
} from 'lucide-react';

export default function LandingComercial() {
  const whatsappUrl = "https://wa.me/?text=Hola!%20Quiero%20conocer%20m%C3%A1s%20sobre%20el%20sistema%20de%20fidelizaci%C3%B3n%20para%20mi%20negocio";

  // Interactive ROI calculator state
  const [dinersPerDay, setDinersPerDay] = useState<number>(60);
  const [ticketAverage, setTicketAverage] = useState<number>(12); // en USD o divisa local

  // Estimaciones basadas en retención clásica (5% a 8% incremento de frecuencia)
  const monthlyClients = dinersPerDay * 26; // 26 días de operación
  const recoveredSalesMonthly = Math.round(monthlyClients * 0.08 * ticketAverage);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] selection:bg-amber-400 selection:text-stone-950 font-sans">
      
      {/* Floating Boutique Navigation (Hallmark N4 Archetype) */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-5xl mx-auto">
        <nav className="bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-100 px-4 py-2.5 rounded-full flex items-center justify-between shadow-xl shadow-stone-950/15">
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-display font-extrabold flex items-center justify-center text-base shadow-sm">
              F
            </div>
            <span className="font-display font-bold text-base tracking-tight text-white">
              Fideliza<span className="text-amber-400">Local</span>
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono-digits tracking-wider uppercase bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700">
              Gastronomía & Retail
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link
              href="/club/fabbrica-burger"
              className="text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full transition hidden md:inline-block"
            >
              Demo Cliente
            </Link>
            <Link
              href="/login"
              className="text-stone-300 hover:text-white px-3 py-1.5 rounded-full transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/empezar"
              className="btn-tactile px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Crear Club Gratis</span>
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white p-1.5 rounded-full transition hidden sm:inline-flex items-center"
              title="Contactar por WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section — Asymmetric Split Layout with Live Pass Mockup */}
      <section className="pt-28 md:pt-36 pb-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda: Mensaje y Propuesta de Valor */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Club de recompensas a medida para tu local</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.08]">
              Tus clientes vuelven más seguido.<br />
              <span className="text-amber-600 underline decoration-amber-300/80 decoration-4 underline-offset-4">
                Tu marca en su bolsillo.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Lanzá el club de fidelización propio de tu restaurante o hamburguesería en <strong>72 horas</strong>. Sin descargas pesadas de tienda, con acumulación de puntos en 3 segundos en el mostrador y recuperación automática de clientes por WhatsApp.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link
                href="/empezar"
                className="btn-tactile px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm md:text-base"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Crear mi Club (14 Días Gratis)</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </Link>

              <Link
                href="/club/fabbrica-burger"
                className="btn-tactile px-5 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm md:text-base shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Ver Demo Cliente en Vivo</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            </div>

            {/* Sellos de confianza con ritmo editorial */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Tu logo y tus colores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Listo en 72 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Display QR para mostrador</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta física de fidelización interactiva (Mockup vivo) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-stone-900 text-stone-100 rounded-3xl p-6 shadow-2xl shadow-stone-900/25 border border-stone-800 relative overflow-hidden">
              
              {/* Foil decorativo artesanal */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Cabecera de la tarjeta */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-mono-digits uppercase tracking-wider text-amber-400 block font-bold">
                    Club de Miembros
                  </span>
                  <h3 className="font-display text-xl font-bold text-white tracking-tight">
                    La Fabbrica Burger
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                  Nivel Oro
                </div>
              </div>

              {/* Puntos y visualización de progreso */}
              <div className="bg-stone-950/70 rounded-2xl p-4 border border-stone-800/80 mb-5">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-stone-400">Puntos Disponibles</span>
                  <span className="font-mono-digits text-2xl font-black text-amber-400">
                    340 <span className="text-xs font-normal text-stone-400">pts</span>
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Próximo premio: 500 pts</span>
                  <span className="text-amber-300 font-semibold">Faltan 160 pts</span>
                </div>
              </div>

              {/* Recompensa desbloqueada */}
              <div className="bg-amber-950/30 border border-amber-600/30 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-amber-200">Pinta Artesanal Desbloqueada</div>
                  <div className="text-stone-400 text-[11px]">Canjeable con tu mozo o en caja</div>
                </div>
              </div>

              {/* Acceso directo a probar */}
              <Link
                href="/club/fabbrica-burger"
                className="btn-tactile w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <span>Abrir Pase en mi Teléfono</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid — Características con Variedad de Spans (Anti AI-Slop) */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold font-mono-digits uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Arquitectura del Sistema
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3">
            Diseñado para el ritmo real del local gastronómico
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Sin fricciones para el cliente que come en tu salón ni demoras en la fila de tu caja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Span 2 - Experiencia Cliente PWA */}
          <div className="md:col-span-2 bg-white border border-stone-200/90 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-stone-300 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900">
                Tu cliente no tiene que descargar nada de la App Store
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                Funciona como Web App Progresiva (PWA): escanean el código QR en la mesa o en el mostrador y en <strong>5 segundos</strong> tienen su tarjeta de puntos guardada en la pantalla de inicio de su iPhone o Android, con su nombre y saldo actualizado en tiempo real.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-medium text-stone-700">
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Ruleta diaria de premios
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Catálogo de canjes visual
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Historial de visitas
              </span>
            </div>
          </div>

          {/* Card 2: Span 1 - Check-in Rápido de Caja */}
          <div className="md:col-span-1 bg-stone-900 text-stone-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between border border-stone-800">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Check-in de mostrador en 3 segundos
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                El cajero simplemente pide el teléfono o escanea el QR. Teclado numérico táctil optimizado para sumar puntos mientras se cobra el ticket sin demorar la fila.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800">
              <Link
                href="/caja/fabbrica-burger"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Probar simulador de caja</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Span 1 - Algoritmo RFM & Churn */}
          <div className="md:col-span-1 bg-white border border-stone-200/90 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-stone-300 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                Detección de clientes en riesgo
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                El sistema detecta automáticamente a los clientes habituales que llevan más de 20 días sin venir y te permite enviarles un WhatsApp de regreso en 1 clic.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <Link
                href="/admin/fabbrica-burger"
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1"
              >
                <span>Ver panel de retención</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Span 2 - Materiales y Despliegue Físico */}
          <div className="md:col-span-2 bg-[#f4efe8] border border-[#e6ded3] rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900">
                Display físico para mostradores y mesas incluido
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed max-w-xl">
                Te entregamos los carteles de mesa y mostrador diseñados con tu logo y código QR directo de alta durabilidad, listos para colocar en tu local desde el primer día.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-300/80 flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Soporte presencial de inducción para tu personal</span>
              <span className="text-amber-800 font-mono-digits">Garantía 72h</span>
            </div>
          </div>

        </div>
      </section>

      {/* Calculadora Interactiva de Retención Gastronómica */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 md:p-10 border border-stone-800 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono-digits uppercase tracking-wider text-amber-400 block mb-1 font-bold">
              Impacto Económico Directo
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              ¿Cuánto deja de ganar tu local por clientes que no vuelven?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Controles deslizantes */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-stone-300">Clientes que atiendes por día:</span>
                  <span className="font-mono-digits text-amber-400 text-sm font-bold">{dinersPerDay} personas/día</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  step="5"
                  value={dinersPerDay}
                  onChange={(e) => setDinersPerDay(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-stone-300">Ticket promedio estimado:</span>
                  <span className="font-mono-digits text-amber-400 text-sm font-bold">${ticketAverage}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  step="1"
                  value={ticketAverage}
                  onChange={(e) => setTicketAverage(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-stone-400 leading-normal">
                * Con solo lograr que un <strong>8%</strong> de tus comensales habituales vuelva 1 vez más al mes gracias a sus puntos acumulados.
              </p>
            </div>

            {/* Resultado estimado */}
            <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800 text-center flex flex-col justify-center items-center">
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Facturación Adicional Estimada
              </span>
              <div className="font-display text-4xl sm:text-5xl font-black text-amber-400 my-2">
                +${recoveredSalesMonthly.toLocaleString()}
                <span className="text-xs text-stone-400 font-normal block font-sans">al mes en tu local</span>
              </div>
              <p className="text-xs text-stone-300 mt-2">
                Equivale a <strong>{Math.round(dinersPerDay * 26 * 0.08)} visitas extra</strong> mensuales de clientes que ya te conocen y les gusta tu comida.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Planes Transparentes (Sin Contratos de Permanencia) */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold font-mono-digits uppercase tracking-wider text-stone-500">
            Inversión y Retorno
          </span>
          <h2 className="font-display text-3xl font-extrabold text-stone-900 mt-1">
            Planes claros, sin comisiones por ticket
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Plan Piloto Comercio */}
          <div className="bg-white border-2 border-amber-500 rounded-3xl p-8 shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-amber-500 text-stone-950 font-bold text-[11px] rounded-full uppercase tracking-wider">
              Recomendado para Gastronomía
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-stone-900">Plan Local Gastronómico</h3>
              <p className="text-xs text-stone-600 mt-1">Para restaurantes, cafeterías, burgers y pizzerías.</p>

              <div className="my-6">
                <span className="font-display text-4xl font-black text-stone-900">$35</span>
                <span className="text-xs text-stone-500 ml-1">/ mes</span>
                <div className="text-[11px] text-amber-800 font-semibold mt-1">
                  En $ USD o Bolívares (Bs.) a Tasa Oficial BCV · Pago Móvil disponible
                </div>
              </div>

              <ul className="space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Clientes ilimitados y transacciones ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Web App personalizada con tu marca</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Terminal de caja rápida táctil</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Ruleta diaria de premios integrada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cartel físico A5 para mostrador con tu QR</span>
                </li>
              </ul>
            </div>

            <Link
              href="/empezar"
              className="btn-tactile mt-8 w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-sm"
            >
              <span>Comenzar Prueba Gratis (14 Días)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Plan Cadena / Multi-sucursal */}
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900">Plan Multi-Sucursal</h3>
              <p className="text-xs text-stone-600 mt-1">Para marcas con 2 o más puntos de venta.</p>

              <div className="my-6">
                <span className="font-display text-4xl font-black text-stone-900">$65</span>
                <span className="text-xs text-stone-500 ml-1">/ mes</span>
                <div className="text-[11px] text-stone-500 font-semibold mt-1">
                  Hasta 3 sucursales sincronizadas
                </div>
              </div>

              <ul className="space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Puntos compartidos entre sucursales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Múltiples terminales de caja simultáneas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Comparativa de retención por punto de venta</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Soporte prioritario y capacitación presencial</span>
                </li>
              </ul>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile mt-8 w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition"
            >
              <span>Consultar por mi Cadena</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* Artisan Signature Footer (Hallmark Ft3 Archetype) */}
      <footer className="border-t border-stone-200 bg-[#f7f5f0] py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-display font-extrabold flex items-center justify-center text-sm">
              F
            </div>
            <div>
              <span className="font-display font-bold text-stone-900 text-sm">FidelizaLocal</span>
              <span className="block text-[11px] text-stone-500">Plataforma de Retención y Puntos para Comercios Locales</span>
            </div>
          </div>

          <div className="flex items-center gap-5 font-medium flex-wrap">
            <Link href="/registro" className="text-amber-700 hover:text-amber-800 font-bold transition">
              Crear Club Gratis
            </Link>
            <Link href="/login" className="hover:text-stone-900 transition">
              Iniciar Sesión
            </Link>
            <Link href="/club/fabbrica-burger" className="hover:text-stone-900 transition">
              App Cliente
            </Link>
            <Link href="/caja/fabbrica-burger" className="hover:text-stone-900 transition">
              Terminal Mostrador
            </Link>
            <Link href="/admin/fabbrica-burger" className="hover:text-stone-900 transition">
              Panel Dueño
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono-digits">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistemas operativos en Vercel & Supabase</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
