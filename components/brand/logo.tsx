import Image from "next/image";

type LogoProps = {
  className?: string;
  width?: number;
  alt?: string;
  preload?: boolean;
};

export function Logo({
  className,
  width = 121,
  alt = "Simplex Studio",
  preload = false,
}: LogoProps) {
  return (
    <Image
      src="/brand/logo-black.svg"
      alt={alt}
      width={width}
      height={Math.round((width * 53) / 121)}
      className={className}
      preload={preload}
      unoptimized
    />
  );
}
