# 🚀 Plataforma de Fidelización de Clientes Local

> **Proyecto de Negocio Tecnológico Local:** Sistema de fidelización y club de beneficios marca blanca para comercios de proximidad (gastronomía, minimercados, servicios y tiendas).

---

## 📌 Documento Clave para Analizar
Antes de revisar el código, lee el **Estudio de Viabilidad y Modelo de Negocio**:
👉 **[Leer Informe de Factibilidad y Arquitectura (INFORME_FACTIBILIDAD.md)](./INFORME_FACTIBILIDAD.md)**

En dicho informe se detalla:
* **Costes iniciales:** Prácticamente **$0 USD/mes** para arrancar (aprovechando capas gratuitas de Vercel y Supabase).
* **Flujo de caja:** Cómo se cargan puntos en **3 segundos** en el mostrador para no demorar la fila.
* **Margen comercial:** Por qué 2 o 3 comercios suscriptores pagan el 100% de la operación y el resto es ganancia recurrente.

---

## 🏗️ Estructura del Software Desarrollado

El sistema ya cuenta con sus 3 módulos operativos funcionales:

| Módulo | Ruta Local | Descripción |
| :--- | :--- | :--- |
| **🌐 Landing Comercial** | `/` | Web de venta dirigida a dueños de comercios locales para captar clientes y agendar demos. |
| **📱 PWA de Clientes** | `/club/cafe-paris` | Tarjeta digital de puntos, ruleta de la suerte, catálogo de premios y canjes con confeti. |
| **🖥️ Mostrador de Caja** | `/caja/cafe-paris` | Terminal ultra rápida para el cajero (búsqueda por WhatsApp y carga de puntos en 1 clic). |
| **🗄️ Base de Datos** | `supabase-schema.sql` | Script SQL multi-comercio listo para pegar en Supabase (PostgreSQL). |

---

## 💻 Cómo Ejecutar el Proyecto

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Fidelización
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   * **Landing Comercial:** [http://localhost:3000](http://localhost:3000)
   * **App Cliente Demo:** [http://localhost:3000/club/cafe-paris](http://localhost:3000/club/cafe-paris)
   * **Caja Mostrador Demo:** [http://localhost:3000/caja/cafe-paris](http://localhost:3000/caja/cafe-paris)

---

## 🛠️ Stack Tecnológico
* **Frontend:** Next.js 16 + React + TypeScript + Tailwind CSS
* **Librerías:** Lucide Icons, Canvas Confetti, QRCode React
* **Base de datos / BaaS:** Supabase (PostgreSQL) + LocalStorage fallback
