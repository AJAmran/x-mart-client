import Image from "next/image";
import clsx from "clsx";

export function Logo({
  className,
  height = 36,
  priority = false,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const width = Math.round(height * 3.923);

  return (
    <>
      <Image
        alt="X-mart"
        className={clsx("h-auto w-auto dark:hidden", className)}
        height={height}
        priority={priority}
        src="/logo-on-light.png"
        style={{ height: `${height}px` }}
        width={width}
      />
      <Image
        alt="X-mart"
        className={clsx("hidden h-auto w-auto dark:block", className)}
        height={height}
        priority={priority}
        src="/logo-on-dark.png"
        style={{ height: `${height}px` }}
        width={width}
      />
    </>
  );
}

export default Logo;