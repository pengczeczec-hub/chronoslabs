/**
 * Static asset registry — all files live under /public.
 *
 * Adding a new video:
 *   1. Copy the .mp4 → public/assets/videos/{english-name}.mp4
 *   2. Set the matching key below (replace `null` with the path)
 *   3. Use <MediaSlot video={SITE_VIDEOS.yourKey} /> or <AssetVideo src={...} />
 *
 * Deploy: include the entire public/assets/ folder on the server.
 */

const video = (filename: string) => `/assets/videos/${filename}`;
const image = (filename: string) => `/assets/images/${filename}`;

export const SITE_VIDEOS = {
  /** Hero — 電競感 */
  hero: video("hero-esports.mp4"),

  /** Matrix Edge-Glow section & pricing card */
  /** Matrix Edge-Glow — Edge-Lit Acrylic. Infinite Color Matrix. (機板轉場) */
  matrixShowcase: video("matrix-showcase.mp4"),
  matrixPricing: null as string | null,

  /** Heritage IN-14 pricing cards */
  in14CompactPricing: null as string | null,
  in14ProMaxPricing: null as string | null,

  /** Authentic Vacuum Tech — Real Neon. Real Glass. Real History. (輝光燈泡介紹2) */
  in14VacuumDetail: video("in14-vacuum-detail.mp4"),

  /** Assembly Ritual steps (Heritage kits) */
  /** Step 1 — Unbox the Engineering (機板介紹) */
  assemblyUnbox: video("assembly-unbox.mp4"),
  /** Step 2 — Seat the Tubes (組裝) */
  assemblySeatTubes: video("assembly-seat-tubes.mp4"),
  /** Step 3 — Ignite the Glow (電競感) */
  assemblyIgnite: video("assembly-ignite.mp4"),
} as const;

export const SITE_IMAGES = {
  /** Assembly Ritual step 1 fallback image */
  assemblyUnbox: null as string | null,

  /** Matrix Edge-GLOW pricing card */
  matrixPricing: image("matrix-pricing.png"),

  /** Heritage IN-14 Compact pricing card (4bit 展示) */
  in14CompactPricing: image("in14-compact-pricing.png"),

  /** Heritage IN-14 PRO-MAX pricing card (6bit 展示) */
  in14ProMaxPricing: image("in14-pro-max-pricing.png"),
} as const;

export type SiteVideoKey = keyof typeof SITE_VIDEOS;
