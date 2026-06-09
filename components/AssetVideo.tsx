"use client";

type AssetVideoProps = {
  src: string;
  className?: string;
  ariaLabel?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
};

export default function AssetVideo({
  src,
  className = "w-full object-cover",
  ariaLabel = "Product video",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
}: AssetVideoProps) {
  return (
    <video
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      controls={controls}
      className={className}
      aria-label={ariaLabel}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
