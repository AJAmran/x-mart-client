import clsx from "clsx";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: "narrow" | "content" | "default" | "wide" | "full";
};

const widths = {
  narrow: "max-w-3xl",
  content: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
  full: "max-w-none",
} as const;

export function Container({
  width = "wide",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        widths[width],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;