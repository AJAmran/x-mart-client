import clsx from "clsx";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Small, token-consistent controls for admin toolbars and headers.
 */

/* ── IconButton ───────────────────────────────────────────────────────────── */

type IconButtonProps = {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Square ghost button for icon-only actions (refresh, export, …). */
export function IconButton({
  label,
  onClick,
  children,
  active,
  disabled,
  className,
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={clsx(
        "grid size-9 shrink-0 place-items-center rounded-md border transition-colors duration-fast ease-standard",
        active
          ? "border-brand/40 bg-brand-subtle text-brand"
          : "border-line-hairline bg-surface-raised text-content-muted hover:bg-surface-sunken hover:text-content",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      disabled={disabled}
      title={label}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ── ActionButton ─────────────────────────────────────────────────────────── */

type ActionButtonProps = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

/** Labeled button used in page-header actions and toolbars. */
export function ActionButton({
  label,
  icon,
  onClick,
  variant = "ghost",
  disabled,
  loading,
  className,
}: ActionButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3.5 text-body-sm font-semibold transition-all duration-fast ease-standard",
        variant === "primary"
          ? "bg-brand text-brand-contrast shadow-brand hover:bg-brand-hover active:scale-[0.98]"
          : "border border-line-hairline bg-surface-raised text-content hover:bg-surface-sunken active:scale-[0.98]",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}

/* ── LinkButton ───────────────────────────────────────────────────────────── */

type LinkButtonProps = {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function LinkButton({
  label,
  href,
  icon,
  variant = "ghost",
  className,
}: LinkButtonProps) {
  return (
    <Link
      className={clsx(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3.5 text-body-sm font-semibold transition-all duration-fast ease-standard",
        variant === "primary"
          ? "bg-brand text-brand-contrast shadow-brand hover:bg-brand-hover active:scale-[0.98]"
          : "border border-line-hairline bg-surface-raised text-content hover:bg-surface-sunken active:scale-[0.98]",
        className
      )}
      href={href}
    >
      {icon}
      {label}
    </Link>
  );
}

/* ── SegmentTabs ──────────────────────────────────────────────────────────── */

type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SegmentTabsProps<T extends string> = {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  label?: string;
  className?: string;
};

/** Segmented control for period / range / filter toggles. */
export function SegmentTabs<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: SegmentTabsProps<T>) {
  return (
    <div
      aria-label={label}
      className={clsx(
        "inline-flex shrink-0 items-center rounded-lg border border-line-hairline bg-surface-sunken p-1",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            aria-pressed={active}
            className={clsx(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-label-sm font-semibold transition-colors duration-fast ease-standard",
              active
                ? "bg-surface-raised text-content shadow-xs"
                : "text-content-subtle hover:text-content"
            )}
            type="button"
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Breadcrumbs ──────────────────────────────────────────────────────────── */

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
      {items.map((item, i) => {
        const last = i === items.length - 1;

        return (
          <span
            key={i}
            className="flex items-center gap-1.5 text-label-sm"
          >
            {i > 0 && (
              <ChevronRight aria-hidden className="size-3.5 text-content-subtle/70" />
            )}
            {item.href && !last ? (
              <Link
                className="font-medium text-content-muted transition-colors duration-fast hover:text-brand"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={last ? "page" : undefined}
                className={last ? "font-semibold text-content" : "text-content-muted"}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
