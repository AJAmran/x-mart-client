import clsx from "clsx";
import type { ComponentType, ReactNode } from "react";

/**
 * Dashboard surface primitives.
 *
 * Every admin page composes these instead of raw HeroUI Card or ad-hoc divs,
 * so the console keeps one consistent elevation, radius and spacing language.
 */

type IconComponent = ComponentType<{ className?: string; size?: number }>;

/* ── EmptyState ───────────────────────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: IconComponent;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 px-5 py-12 text-center sm:py-16",
        className
      )}
    >
      {Icon && (
        <span className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-content-subtle">
          <Icon aria-hidden size={20} />
        </span>
      )}
      <div>
        <p className="text-body-sm font-semibold text-content">{title}</p>
        {description && (
          <p className="mx-auto mt-1.5 max-w-sm text-label-sm leading-relaxed text-content-subtle">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── Panel ────────────────────────────────────────────────────────────────── */

type PanelProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Show a full-height shimmer block in the body. */
  loading?: boolean;
  /** Render the empty state instead of children. */
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: IconComponent;
  emptyAction?: ReactNode;
  /** Omitted when `loading` or `empty` is set. */
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** Raised card with a consistent header (title / description / action). */
export function Panel({
  title,
  description,
  action,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  emptyIcon: EmptyIcon,
  emptyAction,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  return (
    <section
      className={clsx(
        "flex flex-col overflow-hidden rounded-lg border border-line-hairline",
        "bg-surface-raised shadow-xs",
        className
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-line-hairline px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-title-md font-semibold text-content">{title}</h2>
          {description && (
            <p className="mt-0.5 text-label-sm text-content-subtle">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {action}
          </div>
        )}
      </header>

      <div className={clsx("flex-1 p-5", bodyClassName)}>
        {loading ? (
          <div className="xm-skeleton h-64 w-full rounded-md bg-surface-sunken" />
        ) : empty ? (
          <EmptyState
            action={emptyAction}
            description={emptyDescription}
            icon={EmptyIcon}
            title={emptyTitle ?? "No data yet"}
          />
        ) : (
          children
        )}
      </div>
    </section>
  );
}

/* ── Toolbar ──────────────────────────────────────────────────────────────── */

/**
 * Responsive action/filter row: stacks on mobile, spreads left+right on md+.
 * The first child is treated as the "left" group.
 */
export function Toolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Wraps a group of toolbar controls so they cluster together when wrapping. */
export function ToolbarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-2.5", className)}>
      {children}
    </div>
  );
}
