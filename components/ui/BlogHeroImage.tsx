import Image from "next/image";

type BlogHeroImageProps = {
  src: string; // ex.: "/images/blog/juros-compostos-4k.webp"
  alt: string;
  priority?: boolean;
  className?: string;
  caption?: string;
};

export function BlogHeroImage({
  src,
  alt,
  priority = false,
  className = "",
  caption,
}: BlogHeroImageProps) {
  return (
    <figure
      className={[
        "mx-auto w-full max-w-5xl",
        "overflow-hidden rounded-2xl border bg-white/40 shadow-sm",
        className,
      ].join(" ")}
    >
      {/* Container responsivo com aspect ratio 16:9 */}
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
          className="object-cover"
        />
      </div>

      {caption ? (
        <figcaption className="px-4 py-3 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
