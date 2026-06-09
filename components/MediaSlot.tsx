"use client";

import { useState } from "react";
import Image from "next/image";
import AssetVideo from "@/components/AssetVideo";

function Placeholder({ className = "", label = "Product Media" }: { className?: string; label?: string }) {
  return (
    <div
      className={`flex aspect-[4/3] items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 ${className}`}
    >
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800">
          <svg className="h-5 w-5 text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-xs tracking-widest text-muted uppercase">{label}</p>
      </div>
    </div>
  );
}

type MediaSlotProps = {
  video?: string | null;
  image?: string | null;
  label: string;
  className?: string;
  videoClassName?: string;
  imageAlt?: string;
  fillImage?: boolean;
};

export default function MediaSlot({
  video,
  image,
  label,
  className = "",
  videoClassName = "aspect-[4/3] w-full object-cover",
  imageAlt,
  fillImage = false,
}: MediaSlotProps) {
  const [mediaError, setMediaError] = useState(false);

  if (video && !mediaError) {
    return (
      <div className={`overflow-hidden rounded-xl border border-neutral-800 ${className}`}>
        <AssetVideo
          src={video}
          className={videoClassName}
          ariaLabel={imageAlt ?? label}
        />
      </div>
    );
  }

  if (image && !mediaError) {
    if (fillImage) {
      return (
        <div className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a] ${className}`}>
          <Image
            src={image}
            alt={imageAlt ?? label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setMediaError(true)}
          />
        </div>
      );
    }

    return (
      <div className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a] ${className}`}>
        <Image
          src={image}
          alt={imageAlt ?? label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setMediaError(true)}
        />
      </div>
    );
  }

  return <Placeholder className={className} label={label} />;
}
