import Image from "next/image";

export function EditorialImage({
  src,
  alt,
  className,
  imageClassName,
  imagePosition,
  imageFit,
  aspectRatio,
  priority,
  quality,
  sizes,
}: {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
  aspectRatio?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}) {
  const imageStyle =
    imagePosition || imageFit
      ? { objectPosition: imagePosition, objectFit: imageFit }
      : undefined;

  if (src) {
    return (
      <div
        className={`editorial-image-shell relative overflow-hidden ${className ?? ""}`}
        data-has-image="true"
        style={aspectRatio ? { aspectRatio } : undefined}
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
          style={imageStyle}
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
