"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CheckoutModal, { type CheckoutProduct } from "@/components/CheckoutModal";
import AssetVideo from "@/components/AssetVideo";
import MediaSlot from "@/components/MediaSlot";
import { SITE_IMAGES, SITE_VIDEOS } from "@/lib/assets";

/* ─── Motion presets ─── */
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};

/* ─── Product catalog ─── */
type ProductDetails = CheckoutProduct & {
  imageLabel: string;
  mediaVideo?: string | null;
  mediaImage?: string | null;
  badge: string;
  title: string;
  subtitle: string;
  tech: string;
  deliveryStatus: string;
  displayFormat?: string;
  bullets: string[];
  cta: string;
  kind: "matrix" | "heritage";
};

const matrixEdgeGlow: ProductDetails = {
  name: "CYBER_GLOW: Matrix Edge-Glow",
  price: "199.99",
  imageLabel: "Matrix Edge-Glow · Ready Out of Box",
  mediaImage: SITE_IMAGES.matrixPricing,
  badge: "Plug & Play",
  title: "THE MATRIX EDGE-GLOW",
  subtitle: "Instant Cyber Aesthetic",
  tech: "3D Laser-Etched Stacked Acrylic Plates + Bottom Addressable LED Side-Lit Simulation",
  deliveryStatus: "100% Fully Assembled Finished Product — Ready Out of the Box",
  bullets: [
    "Zero assembly required — unbox, plug in, glow",
    "Dust-proof sealed enclosure for maintenance-free display",
    "Unlimited app-controlled RGB color matrix",
    "Infinite lifespan — no fragile tubes to replace",
    "Perfect for instant desk impact with zero friction",
  ],
  cta: "Get Matrix Edge-Glow",
  kind: "matrix",
};

const in14CompactKit: ProductDetails = {
  name: "CYBER_GLOW: Heritage IN-14 Compact",
  price: "299.99",
  imageLabel: "Heritage IN-14 Compact · 4-Digit",
  mediaImage: SITE_IMAGES.in14CompactPricing,
  badge: "Hardcore DIY",
  title: "THE HERITAGE IN-14 COMPACT",
  subtitle: "4-Digit Compact",
  tech: "4× Genuine Vintage Soviet IN-14 Vacuum Tubes (iconic top-glass nipples) · Clear acrylic chassis · Exposed matte-black PCB · Gold-plated sockets",
  deliveryStatus: "Hardcore DIY Assembly Kit — Satisfying 5-minute zero-tool setup ritual",
  displayFormat: "4-Digit Time (HH:MM) — sleek, ultra-focused, space-saving",
  bullets: [
    "Legendary IN-14 tall tubes with distinct glass nipples",
    "Authentic warm orange neon discharge — real physical glow",
    "Premium clear acrylic + exposed PCB architecture",
    "White USB-C cable and control remote included",
    "The perfect entry to genuine Soviet vacuum hardware",
  ],
  cta: "Secure IN-14 Compact Kit",
  kind: "heritage",
};

const in14ProMaxKit: ProductDetails = {
  name: "CYBER_GLOW: Heritage IN-14 PRO-MAX",
  price: "349.99",
  imageLabel: "Heritage IN-14 PRO-MAX · 6-Digit",
  mediaImage: SITE_IMAGES.in14ProMaxPricing,
  badge: "Flagship · Batch 01",
  title: "THE HERITAGE IN-14 PRO-MAX",
  subtitle: "6-Digit Flagship",
  tech: "6× Genuine Soviet IN-14 Vacuum Tubes + 2× Vertical Neon Separator Columns (neon dots) · Same clear acrylic + matte-black PCB premium architecture",
  deliveryStatus: "Hardcore DIY Assembly Kit — Satisfying zero-tool setup ritual",
  displayFormat: "Full 6-Digit Time (HH:MM:SS) with pulsing seconds for maximum visual impact",
  bullets: [
    "Elite 6-digit layout with neon dot separators",
    "Pulsing second-hand tracking — living, breathing time",
    "Absolute desktop monument — the prestige centerpiece",
    "Identical premium chassis architecture as Compact kit",
    "100% authentic NOS Soviet vacuum tube experience",
  ],
  cta: "Claim IN-14 PRO-MAX Kit",
  kind: "heritage",
};

const assemblySteps = [
  {
    step: "01",
    title: "Unbox the Engineering",
    description:
      "Receive a precision-engineered, high-transparency clear acrylic chassis with fully exposed matte-black PCB circuitry.",
    visual: "unbox" as const,
  },
  {
    step: "02",
    title: "Seat the Tubes",
    description:
      "Gently seat genuine NOS Soviet IN-14 tubes — legendary tall glass with distinct top nipples — into gold-plated sockets. Safe, seamless, and deeply satisfying.",
    visual: "plug" as const,
  },
  {
    step: "03",
    title: "Ignite the Glow",
    description:
      "Connect the hidden USB-C cable and watch your desktop monument pulse with authentic neon life for the first time.",
    visual: "ignite" as const,
  },
];

const guarantees = [
  "Free Worldwide Priority Shipping",
  "30-Day Risk-Free Guarantee",
  "Secure Checkout via PayPal",
];

/* ─── Primitives ─── */
function StoreBrand({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Chronos<span className="text-accent"> Labs</span>
    </span>
  );
}

function NeonButton({
  children,
  size = "md",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-sm",
    lg: "px-10 py-4 text-base sm:text-lg",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 40px rgba(255,87,34,0.55), 0 0 100px rgba(255,87,34,0.25)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-full bg-accent font-semibold tracking-wide text-white shadow-neon transition-colors hover:bg-[#ff6a3d] ${sizes[size]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
    </motion.button>
  );
}

function PriceDisplay({ price, compact = false }: { price: string; compact?: boolean }) {
  const [whole, cents] = price.split(".");

  return (
    <div className="flex items-baseline gap-0.5">
      <span
        className={`font-black tracking-tight text-pearl ${
          compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
        }`}
      >
        ${whole}
      </span>
      <span className={`font-bold text-pearl ${compact ? "text-xl" : "text-2xl"}`}>
        .{cents}
      </span>
      <span className="ml-1 text-sm text-muted">USD</span>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-muted sm:text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SpecBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-accent uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{value}</p>
    </div>
  );
}

function MatrixRgbVisual() {
  const colors = ["#FF5722", "#7C4DFF", "#00E5FF", "#76FF03"];

  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "linear-gradient(135deg, #FF5722 0%, #7C4DFF 50%, #00E5FF 100%)",
            "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 50%, #76FF03 100%)",
            "linear-gradient(135deg, #00E5FF 0%, #76FF03 50%, #FF5722 100%)",
            "linear-gradient(135deg, #76FF03 0%, #FF5722 50%, #7C4DFF 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative flex items-end gap-2 px-6 pb-12 sm:gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              boxShadow: [
                `0 0 16px ${colors[i]}55`,
                `0 0 32px ${colors[i]}88`,
                `0 0 16px ${colors[i]}55`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            className="h-14 w-7 rounded-sm border border-white/20 bg-white/5 backdrop-blur-sm sm:h-16 sm:w-8"
          />
        ))}
      </div>
      <p className="absolute bottom-3 text-[10px] tracking-[0.2em] text-muted uppercase">
        Laser-Etched Acrylic · RGB Edge-Lit
      </p>
    </div>
  );
}

const RITUAL_MEDIA = {
  unbox: {
    video: SITE_VIDEOS.assemblyUnbox,
    image: SITE_IMAGES.assemblyUnbox,
    label: "Step 1 · Unbox",
  },
  plug: {
    video: SITE_VIDEOS.assemblySeatTubes,
    image: null,
    label: "Step 2 · Seat Tubes",
  },
  ignite: {
    video: SITE_VIDEOS.assemblyIgnite,
    image: null,
    label: "Step 3 · Ignite",
  },
} as const;

function RitualVisual({ type }: { type: "unbox" | "plug" | "ignite" }) {
  const media = RITUAL_MEDIA[type];

  if (media.video || media.image) {
    return (
      <div className="relative">
        <MediaSlot
          video={media.video}
          image={media.image}
          label={media.label}
          fillImage
          imageAlt={media.label}
        />
        {type === "unbox" && (
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
        )}
      </div>
    );
  }

  if (type === "unbox") {
    return (
      <MediaSlot
        video={null}
        image={null}
        label={media.label}
      />
    );
  }

  if (type === "plug") {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative flex items-end gap-3 px-6 pb-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease }}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-16 w-8 rounded-t-full border border-accent/40 bg-gradient-to-b from-[#FF6B35]/30 to-transparent shadow-[0_0_20px_rgba(255,107,53,0.2)] sm:h-20 sm:w-10" />
              <div className="h-3 w-10 rounded-sm border border-amber-500/30 bg-amber-500/10" />
            </motion.div>
          ))}
        </div>
        <p className="absolute bottom-3 text-[10px] tracking-[0.2em] text-muted uppercase">
          IN-14 · Gold-plated sockets
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]">
      <motion.div
        className="absolute h-32 w-32 rounded-full bg-accent/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-end gap-2 sm:gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              boxShadow: [
                "0 0 12px rgba(255,107,53,0.3)",
                "0 0 28px rgba(255,107,53,0.55)",
                "0 0 12px rgba(255,107,53,0.3)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            className="h-14 w-7 rounded-t-full border border-[#FF6B35]/50 bg-[#FF6B35]/20 sm:h-16 sm:w-8"
          />
        ))}
      </div>
      <div className="absolute bottom-4 flex items-center gap-2 rounded-full border border-neutral-700 bg-[#111]/80 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(255,87,34,0.8)]" />
        <span className="text-[10px] tracking-wider text-muted uppercase">USB-C Connected</span>
      </div>
    </div>
  );
}

function RitualStepCard({
  step,
  title,
  description,
  visual,
  index,
}: {
  step: string;
  title: string;
  description: string;
  visual: "unbox" | "plug" | "ignite";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.12, ease }}
      className="group flex flex-col rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-5 transition-colors hover:border-neutral-700 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Step {step}
        </span>
        <span className="text-[10px] tracking-widest text-neutral-600 uppercase">
          Ritual
        </span>
      </div>
      <RitualVisual type={visual} />
      <h3 className="mt-5 text-lg font-bold tracking-tight text-pearl sm:text-xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </motion.div>
  );
}

function PathPanel({
  eyebrow,
  title,
  description,
  price,
  tags,
  accent,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  tags: string[];
  accent: "rgb" | "vacuum";
  delay?: number;
}) {
  const accentBorder = accent === "rgb" ? "border-cyan-500/30" : "border-accent/30";
  const accentBg = accent === "rgb" ? "bg-cyan-500/10 text-cyan-400" : "bg-accent/10 text-accent";
  const dotColor = accent === "rgb" ? "bg-cyan-400" : "bg-accent";

  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={`flex flex-col rounded-2xl border ${accentBorder} bg-[#0a0a0a] p-6 sm:p-8`}
    >
      <span className={`mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${accentBg}`}>
        {eyebrow}
      </span>
      <h3 className="text-2xl font-black tracking-tight text-pearl sm:text-3xl">{title}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-neutral-800 bg-[#111] px-3 py-1 text-[10px] font-medium tracking-wide text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        From{" "}
        <span className="text-lg font-black text-pearl">
          ${price}
        </span>
      </p>
      <div className={`mt-4 h-px w-full ${accent === "rgb" ? "bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" : "bg-gradient-to-r from-transparent via-accent/40 to-transparent"}`} />
      <div className="mt-4 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotColor} shadow-neon`} />
        <span className="text-xs tracking-wide text-muted uppercase">
          {accent === "rgb" ? "Instant Gratification" : "Tactile Ritual"}
        </span>
      </div>
    </motion.div>
  );
}

function HeroVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease }}
      className="relative mx-auto mb-12 w-full max-w-5xl sm:mb-14"
    >
      <div className="neon-border overflow-hidden rounded-2xl">
        <AssetVideo
          src={SITE_VIDEOS.hero}
          className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
          ariaLabel="CYBER_GLOW product showcase"
        />
      </div>
      <div className="mx-auto mt-[-2px] h-20 w-3/4 bg-gradient-to-b from-accent/10 to-transparent blur-2xl" />
    </motion.div>
  );
}

function ProductPricingCard({
  product,
  featured = false,
  delay = 0,
  onCheckout,
}: {
  product: ProductDetails;
  featured?: boolean;
  delay?: number;
  onCheckout: () => void;
}) {
  const isMatrix = product.kind === "matrix";

  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#0a0a0a] p-5 sm:p-6 ${
        featured
          ? "border-accent/40 shadow-[0_0_25px_rgba(255,87,34,0.25)]"
          : isMatrix
            ? "border-cyan-500/20"
            : "border-neutral-800"
      }`}
    >
      {featured && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,87,34,0.15)",
              "0 0 36px rgba(255,87,34,0.28)",
              "0 0 20px rgba(255,87,34,0.15)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex flex-1 flex-col">
        <MediaSlot
          className="mb-5"
          video={product.mediaVideo}
          image={product.mediaImage}
          label={product.imageLabel}
          videoClassName="aspect-[4/3] w-full object-cover"
          imageAlt={product.imageLabel}
        />

        <span
          className={`mb-2 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase ${
            featured
              ? "border border-accent/30 bg-accent/10 text-accent"
              : isMatrix
                ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border border-neutral-700 bg-[#111] text-muted"
          }`}
        >
          {product.badge}
        </span>

        <h3 className="text-lg font-black leading-tight tracking-tight text-pearl sm:text-xl">
          {product.title}
        </h3>
        <p className="mt-1 text-xs font-semibold tracking-wide text-muted">
          {product.subtitle}
        </p>

        <div className="mt-4 space-y-3">
          <SpecBlock label="Tech" value={product.tech} />
          <SpecBlock label="Delivery Status" value={product.deliveryStatus} />
          {product.displayFormat && (
            <SpecBlock label="Display Format" value={product.displayFormat} />
          )}
        </div>

        <div className="mt-5">
          <PriceDisplay price={product.price} compact />
        </div>

        <div className="mt-5 flex-1">
          <BulletList items={product.bullets} />
        </div>

        <motion.button
          type="button"
          onClick={onCheckout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-6 w-full rounded-full py-3 text-xs font-semibold tracking-wide transition-colors sm:text-sm ${
            featured
              ? "bg-accent text-white shadow-neon hover:bg-[#ff6a3d]"
              : isMatrix
                ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                : "border border-neutral-700 bg-[#111] text-pearl hover:border-neutral-600 hover:bg-[#161616]"
          }`}
        >
          {product.cta}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CheckoutProduct>({
    name: in14ProMaxKit.name,
    price: in14ProMaxKit.price,
  });

  const openCheckout = (product: CheckoutProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505]">
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md bg-[#050505]/70">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg font-black tracking-tighter text-pearl sm:text-xl"
          >
            <StoreBrand />
          </motion.span>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NeonButton size="sm" onClick={scrollToPricing}>
              Shop Now
            </NeonButton>
          </motion.div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* ─── HERO ─── */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 lg:px-8">
          <HeroVideo />

          <div className="mx-auto w-full max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-xs font-medium tracking-[0.3em] text-accent uppercase sm:text-sm"
            >
              CYBER_GLOW · Three Ways to Illuminate
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-5xl leading-[1.05] font-black tracking-tight text-pearl sm:text-6xl md:text-7xl"
            >
              Every Desk Deserves
              <br />
              <span className="text-glow text-accent">a Soul.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg md:text-xl"
            >
              Plug-and-play RGB edge-glow — or build your own Soviet vacuum tube
              monument. Three premium paths, one cyber aesthetic.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease }}
              className="mx-auto mt-3 max-w-xl text-sm text-muted"
            >
              Matrix Edge-Glow · IN-14 Compact · IN-14 PRO-MAX
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <NeonButton size="lg" onClick={scrollToPricing}>
                Choose Your Model — From $199.99
              </NeonButton>
            </motion.div>
          </div>
        </section>

        {/* ─── SPLIT NARRATIVE: TWO PATHS ─── */}
        <section className="relative px-6 py-24 lg:px-8 lg:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp} className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-4 text-xs font-medium tracking-[0.25em] text-accent uppercase">
                The Split Narrative
              </p>
              <h2 className="text-3xl font-black tracking-tight text-pearl sm:text-4xl lg:text-5xl">
                Instant Glow — or The Ritual of Creation.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                Some crave zero-friction brilliance the moment they unbox. Others
                demand the tactile satisfaction of seating genuine Soviet vacuum
                tubes with their own hands. Chronos Labs honors both souls.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <PathPanel
                eyebrow="Path 01 · Convenience"
                title="Plug In. Glow Instantly."
                description="The Matrix Edge-Glow arrives 100% fully assembled — laser-etched stacked acrylic plates side-lit by addressable RGB LEDs. No tools, no tubes, no waiting. Unbox it, connect USB-C, and command an infinite color matrix from your phone. Dust-proof sealed. Infinite lifespan."
                price={matrixEdgeGlow.price}
                tags={["Ready Out of Box", "App RGB Control", "Zero Assembly", "Infinite Lifespan"]}
                accent="rgb"
              />
              <PathPanel
                eyebrow="Path 02 · Heritage"
                title="Build It. Feel It Glow."
                description="The Heritage IN-14 kits are for purists — genuine vintage Soviet vacuum tubes with iconic top-glass nipples, clear acrylic chassis, and exposed matte-black PCB with gold-plated sockets. A satisfying zero-tool assembly ritual transforms your desk into a living monument of warm orange neon."
                price={in14CompactKit.price}
                tags={["NOS IN-14 Tubes", "5-Min DIY Ritual", "Real Neon Glow", "Gold-Plated Sockets"]}
                accent="vacuum"
                delay={0.12}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0.6 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
              className="mx-auto mt-14 h-px max-w-md bg-gradient-to-r from-cyan-500/50 via-neutral-600 to-accent/50"
            />
          </div>
        </section>

        {/* ─── MATRIX EDGE-GLOW ─── */}
        <section className="px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div {...fadeUp}>
              <p className="mb-4 text-xs font-medium tracking-[0.25em] text-cyan-400 uppercase">
                Simulated Brilliance
              </p>
              <h2 className="text-3xl leading-tight font-black tracking-tight text-pearl sm:text-4xl lg:text-5xl">
                Edge-Lit Acrylic.
                <br />
                Infinite Color Matrix.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                The Matrix Edge-Glow fuses precision 3D laser-etched stacked
                acrylic plates with bottom-mounted addressable LEDs for a
                side-lit nixie aesthetic — without a single vacuum tube. Fully
                sealed against dust, app-controlled RGB delivers unlimited mood
                presets, and the hardware lasts forever.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {["Laser-Etched Acrylic", "Addressable RGB", "Dust-Proof Sealed", "App Control"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-300/80"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              {SITE_VIDEOS.matrixShowcase ? (
                <MediaSlot
                  video={SITE_VIDEOS.matrixShowcase}
                  label="Matrix Edge-Glow Showcase"
                />
              ) : (
                <MatrixRgbVisual />
              )}
            </motion.div>
          </div>
        </section>

        {/* ─── AUTHENTIC VACUUM TECH ─── */}
        <section className="relative px-6 py-24 lg:px-8 lg:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="order-2 lg:order-1">
              <MediaSlot
                video={SITE_VIDEOS.in14VacuumDetail}
                label="IN-14 Vacuum Tube Detail"
              />
            </motion.div>

            <motion.div {...fadeUp} className="order-1 lg:order-2">
              <p className="mb-4 text-xs font-medium tracking-[0.25em] text-accent uppercase">
                Authentic Vacuum Tech
              </p>
              <h2 className="text-3xl leading-tight font-black tracking-tight text-pearl sm:text-4xl lg:text-5xl">
                Real Neon. Real Glass. Real History.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                Both Heritage IN-14 kits ship with genuine vintage Soviet IN-14
                vacuum tubes — legendary tall glass cylinders with distinct
                top-glass nipples. Compact (4-digit) and PRO-MAX (6-digit) share
                the identical premium architecture: high-transparency clear acrylic
                casing, fully exposed matte-black PCB, and gold-plated tube
                sockets. Genuine inert-gas ionization produces the{" "}
                <span className="text-accent">warm orange discharge</span> no
                simulation can replicate.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {["IN-14 NOS Tubes", "Clear Acrylic Chassis", "Gold-Plated Sockets"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-neutral-800 bg-[#111] px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── THE ASSEMBLY RITUAL ─── */}
        <section className="relative px-6 py-24 lg:px-8 lg:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp} className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-4 text-xs font-medium tracking-[0.25em] text-accent uppercase">
                Heritage Kits Only
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-pearl">
                The Ritual of Creation.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                IN-14 Compact and PRO-MAX kits require no soldering. Seat your
                genuine tubes, connect USB-C, and experience the pure satisfaction
                of bringing vintage vacuum hardware to life with your own hands.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {assemblySteps.map((item, i) => (
                <RitualStepCard key={item.step} {...item} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              className="mt-10 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-[#111] px-4 py-2 text-xs font-medium tracking-wide text-muted">
                <span aria-hidden>🔧</span>
                5-Minute Zero-Tool Assembly · IN-14 Kits Only
              </span>
            </motion.div>
          </div>
        </section>

        {/* ─── PRICING & CHECKOUT ─── */}
        <section id="pricing" className="px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp} className="mb-14 text-center">
              <p className="mb-4 text-xs font-medium tracking-[0.25em] text-accent uppercase">
                Choose Your Model
              </p>
              <h2 className="text-3xl font-black tracking-tight text-pearl sm:text-4xl lg:text-5xl">
                Three Variants. One Standard.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted">
                Instant RGB edge-glow at $199.99 — or step into authentic Soviet
                vacuum heritage at $299.99 and $349.99. Every model ships with
                premium Chronos Labs engineering.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <ProductPricingCard
                product={matrixEdgeGlow}
                onCheckout={() =>
                  openCheckout({ name: matrixEdgeGlow.name, price: matrixEdgeGlow.price })
                }
              />
              <ProductPricingCard
                product={in14CompactKit}
                delay={0.08}
                onCheckout={() =>
                  openCheckout({ name: in14CompactKit.name, price: in14CompactKit.price })
                }
              />
              <ProductPricingCard
                product={in14ProMaxKit}
                featured
                delay={0.16}
                onCheckout={() =>
                  openCheckout({ name: in14ProMaxKit.name, price: in14ProMaxKit.price })
                }
              />
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-neutral-800/60 px-6 py-16 lg:px-8">
          <motion.div {...fadeUp} className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
              {guarantees.map((label) => (
                <span
                  key={label}
                  className="text-sm font-medium tracking-wide text-muted"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-16 flex flex-col items-center gap-4 border-t border-neutral-800/40 pt-10">
              <StoreBrand className="text-lg font-black tracking-tighter text-pearl" />
              <p className="text-xs tracking-wide text-muted">
                © 2026 Chronos Labs. All rights reserved.
              </p>
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  );
}
