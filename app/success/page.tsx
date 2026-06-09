import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ultra px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-3xl font-black tracking-tight text-pearl sm:text-4xl">
        Pre-Order Confirmed
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Thank you for securing your CYBER_GLOW vacuum tube DIY kit from
        Chronos Labs. A confirmation email will arrive shortly with shipping
        details.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-neon transition-colors hover:bg-[#ff6a3d]"
      >
        Back to Home
      </Link>
    </div>
  );
}
