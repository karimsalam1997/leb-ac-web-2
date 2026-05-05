import Image from "next/image";

export function EditorialImage({
  src,
  alt,
  className,
  imageClassName,
  imagePosition,
  priority,
  quality,
  sizes,
}: {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imagePosition?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}) {
  if (src) {
    return (
      <div
        className={`editorial-image-shell relative overflow-hidden ${className ?? ""}`}
        data-has-image="true"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? "eager" : undefined}
          quality={quality}
          sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
          className={`object-cover ${imageClassName ?? ""}`}
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      </div>
    );
  }

  return (
    <div
      className={`editorial-image-shell placeholder-art ${className ?? ""}`}
      aria-label={alt}
    />
  );
}
