# Design — FidelizaLocal (Hallmark Design System)

A locked design system for FidelizaLocal. Every page redesign reads this file before emitting code.
Created via Hallmark multi-page flow.

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* Hallmark · genre: tactile-craft-hospitality */
/* Hallmark · macrostructure: marketing:asymmetric-bento · app:physical-pass-stack · terminal:workbench */
/* Hallmark · tokens: locked-oklch-tokens */

---

## 1. Genre & Personality
- **Genre:** Tactile Craft Hospitality (Warm Gourmet / Dining Club).
- **Voice:** Made, not generated. Honest, warm, authentic, tactile. Eliminates all AI-slop: zero purple-cyan glows, zero generic 3-card rows, zero fabricated metrics.
- **Inspiration:** Artisan dining club passes, craft print menus, Starbucks Reserve tactile cards, Toast POS clarity.

---

## 2. Macrostructure Family

- **Marketing Landing (`/`):**
  - **Macrostructure:** Asymmetric Split Hero with real live interactive terminal mockup (no fake browser chrome) + Bento Feature Grid with varied tile spans + Real ROI interactive calculator + Direct WhatsApp CTA.
  - **Nav Archetype:** N4 (Boutique floating pill with blurred warm backing and tactile status pill).
  - **Footer Archetype:** Ft3 (Artisan signature footer with real links and live status indicator).

- **Customer Loyalty Club PWA (`/club/[slug]`):**
  - **Macrostructure:** Physical Pass Archetype.
  - Feels like an authentic collectible loyalty card in hand: tactile paper finish, warm embossed foil accents, clear points progress meter, interactive roulette wheel, and clean claimable reward vouchers.

- **Cashier Terminal (`/caja/[slug]`):**
  - **Macrostructure:** High-efficiency Workbench.
  - High-contrast tactile keypad and quick-action stamps designed for high-stress restaurant service speed (sub-3-second customer check-in).

- **Merchant Dashboard (`/admin/[slug]`):**
  - **Macrostructure:** Operational Intelligence Board.
  - Tabular mono numbers, RFM churn matrix with direct one-click WhatsApp recovery action.

---

## 3. Token System (OKLCH Harmonized)

### Backgrounds & Paper
- `--color-paper`: `oklch(97.2% 0.012 85)` — Warm flour / sourdough cream (light, inviting, organic).
- `--color-paper-subtle`: `oklch(94.5% 0.018 80)` — Secondary tinted paper surface for cards.
- `--color-paper-card`: `oklch(99.0% 0.005 85)` — Crisp elevated card surface.
- `--color-paper-dark`: `oklch(18.5% 0.022 55)` — Roasted charcoal espresso (for VIP club cards and terminal headers).
- `--color-paper-dark-surface`: `oklch(23.0% 0.026 55)` — Elevated dark card surface.

### Ink & Contrast (Never pure #000000 or #ffffff)
- `--color-ink`: `oklch(20.0% 0.020 50)` — Deep roasted coffee ink (ultra readable, never synthetic pure black).
- `--color-ink-muted`: `oklch(45.0% 0.025 50)` — Warm charcoal for secondary captions and metadata.
- `--color-ink-faint`: `oklch(65.0% 0.020 60)` — Hairline borders and subtle dividers.
- `--color-ink-on-dark`: `oklch(96.0% 0.010 85)` — Cream text when inside dark surfaces.

### Accents (Distinct roles, never mixed in gradients)
- `--color-amber`: `oklch(76.0% 0.175 68)` — Primary Warm Amber (Craft beer / golden crust / points).
- `--color-terracotta`: `oklch(63.0% 0.210 32)` — Coral / Terracotta (High-energy rewards, streak fires, urgent actions).
- `--color-sage`: `oklch(74.0% 0.140 148)` — Fresh Sage Herb (Success states, points added, checkmarks).
- `--color-slate`: `oklch(40.0% 0.040 240)` — Slate navy (Admin & cashier technical chrome).

---

## 4. Typography Pairing (2+1 Rule)

1. **Display Face:** `Bricolage Grotesque` (Google Fonts, variable weights 600–800) — Roman only, character-rich, artisan print feel, no italic headers.
2. **Body & UI Face:** `Plus Jakarta Sans` (Google Fonts, weights 400, 500, 600) — Rounded humanist sans, warm, maximum mobile readability.
3. **Outlier / Numbers:** `JetBrains Mono` (Google Fonts, weights 500, 700) — Tabular digits for points, ticket numbers, time stamps, and voucher codes.

---

## 5. Interaction & 8-State Floor
Every button, card, and interactive element implements the mandatory 8 states:
1. `default`: Clean tactile border or solid fill.
2. `hover`: Subtle translateY(-1px) + deepening shadow (tactile lift).
3. `:focus-visible`: 2px offset ring with `--color-amber`.
4. `:active`: translateY(1px) tactile press feedback.
5. `disabled`: Opacity 45%, cursor not-allowed, no hover shadow.
6. `loading`: Inline spinner + preserved button width.
7. `error`: Terracotta subtle border pulse.
8. `success`: Sage flash with confirmation icon.

---

## 6. Layout & Responsiveness Discipline
- **Viewport verification:** 320px, 375px, 414px, 768px, 1280px.
- **Zero horizontal scroll:** `overflow-x: clip` on root containers.
- **No 2-line clickable text:** All action buttons and nav items fit comfortably without ugly text wrapping on small screens.
- **Grid tracks:** Always use `minmax(0, 1fr)` to prevent image blowouts.
