import clsx from "clsx";
import { Container } from "./Container";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  width?: "narrow" | "content" | "default" | "wide" | "full";
  /** Vertical rhythm from the spacing scale. */
  spacing?: "none" | "sm" | "md" | "lg";
  tone?: "default" | "raised" | "sunken";
};

const spacings = {
  none: "",
  sm: "py-10 sm:py-12",
  md: "py-16 sm:py-20",
  lg: "py-20 sm:py-28",
} as const;

const tones = {
  default: "",
  raised: "bg-surface-raised",
  sunken: "bg-surface-sunken",
} as const;

export function Section({
  width = "wide",
  spacing = "md",
  tone = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={clsx(spacings[spacing], tones[tone], className)}
      {...props}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
  /** Heading level for correct document outline. Defaults to `h2`. */
  as?: "h1" | "h2" | "h3";
};

/** Eyebrow + title + description + optional action, consistently composed. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        action && "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={clsx("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="mb-3 flex items-center gap-2 text-overline font-semibold uppercase tracking-[0.14em] text-brand">
            <span aria-hidden className="h-px w-6 bg-brand/50" />
            {eyebrow}
          </p>
        )}
        <Heading className="text-display-sm font-bold text-content">
          {title}
        </Heading>
        {description && (
          <p className="mt-3 text-body-lg text-content-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  /**
   * `compact` trades the display-scale headline for a single slim row.
   *
   * The default is a marketing-style hero (`display-md`, up to 46px, on
   * `py-8 sm:py-10`) — right for the storefront, far too loud for a dense admin
   * console where the data is the point. `compact` keeps the title and the
   * action but drops the band to one line.
   */
  variant?: "default" | "compact";
};

/** Standard top-of-page header for interior routes. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  breadcrumbs,
  variant = "default",
}: PageHeaderProps) {
  if (variant === "compact") {
    return (
      <header className="border-b border-line-hairline bg-surface-raised">
        <Container className="py-5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="min-w-0">
              <h1 className="text-title-lg font-bold text-content">{title}</h1>
              {description && (
                <p className="mt-1 text-label-sm text-content-subtle">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="border-b border-line-hairline bg-surface-raised">
      <Container className="py-8 sm:py-10">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4">
            {breadcrumbs}
          </nav>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-2 text-overline font-semibold uppercase tracking-[0.14em] text-brand">
                {eyebrow}
              </p>
            )}
            <h1 className="text-display-md font-bold text-content">{title}</h1>
            {description && (
              <p className="mt-3 text-body-lg text-content-muted">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </Container>
    </header>
  );
}

export default Section;