import Image from "next/image";
import clsx from "clsx";

import { siteConfig } from "@/src/config/site";

export function Logo({
  className,
  height = 36,
  priority = false,
  src = "/logo-on-light.png",
}: {
  className?: string;
  height?: number;
  priority?: boolean;
  /** Swap in the store's own logo without editing this component. */
  src?: string;
}) {
  const width = Math.round(height * 3.923);

  // Alt text names the store, not the product, so a screen reader announces the
  // brand the buyer configured rather than the demo one.
  const alt = `${siteConfig.name} home`;

  return (
    <>
      <Image
        alt={alt}
        className={clsx("h-auto w-auto dark:hidden", className)}
        height={height}
        priority={priority}
        src={src}
        style={{ height: `${height}px` }}
        width={width}
      />
      <Image
        alt={alt}
        className={clsx("hidden h-auto w-auto dark:block", className)}
        height={height}
        priority={priority}
        // The dark variant lives beside the light one on the same path.
        src={src.replace("logo-on-light", "logo-on-dark")}
        style={{ height: `${height}px` }}
        width={width}
      />
    </>
  );
}

export default Logo;