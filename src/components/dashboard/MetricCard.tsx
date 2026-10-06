import clsx from "clsx";
import type { ComponentType } from "react";
import NextLink from "next/link";

/**
 * KPI metric card.
 *
 * Tone tints the icon chip; an optional inline SVG sparkline sits opposite it for
 * a data-rich, dashboard-grade feel without pulling in a chart lib.
 */

export type MetricTone = "brand" | "success" | "warning" | "danger" | "neutral";

type IconComponent = ComponentType<{ className?: string; size?: number }>;

const toneChip: Record<MetricTone, string> = {
  brand: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-surface-sunken text-content-muted",
};

/* ── Sparkline ────────────────────────────────────────────────────────────── */

/** Tiny inline area chart. Colours itself via `currentColor`. */
export function Sparkline({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  if (data.length < 2) return null;

  const w = 96;
  const h = 30;
  const pad = 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = h - pad - ((value - min) / range) * (h - pad * 2);

    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${h} L${points[0][0].toFixed(1)},${h} Z`;

  return (
    <svg
      aria-hidden
      className={clsx("h-[30px] w-24", className)}
      fill="none"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
    >
      <path className="fill-current opacity-[0.12]" d={area} />
      <path
        className="stroke-current"
        d={line}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
      />
      <circle
        className="fill-current"
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r={2}
      />
    </svg>
  );
}

/* ── MetricCard ───────────────────────────────────────────────────────────── */

type MetricCardProps = {
  label: string;
  value: string;
  icon: IconComponent;
  tone?: MetricTone;
  /** Small caption under the value. */
  hint?: string;
  /** Optional series rendered as a sparkline (2+ points). */
  sparkline?: number[];
  /** When set, the whole card becomes a link. */
  href?: string;
  loading?: boolean;
  className?: string;
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  hint,
  sparkline,
  href,
  loading,
  className,
}: MetricCardProps) {
  const card = (
    <div
      className={clsx(
        "flex h-full flex-col justify-between rounded-lg",
        "border border-line-hairline bg-surface-raised p-5 shadow-xs",
        "transition-all duration-base ease-standard",
        "hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={clsx(
            "grid size-10 shrink-0 place-items-center rounded-md",
            toneChip[tone]
          )}
        >
          <Icon aria-hidden size={19} />
        </span>
        {sparkline && sparkline.length >= 2 && (
          <span className={clsx("mt-0.5", toneChip[tone].split(" ")[1])}>
            <Sparkline data={sparkline} />
          </span>
        )}
      </div>

      <div className="mt-5 min-w-0">
        <p className="text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
          {label}
        </p>
        {loading ? (
          <div className="xm-skeleton mt-2 h-8 w-24 rounded-xs bg-surface-sunken" />
        ) : (
          <p className="tabular mt-1 text-display-sm font-bold tracking-tight text-content">
            {value}
          </p>
        )}
        {hint && !loading && (
          <p className="mt-1 truncate text-label-sm text-content-subtle">
            {hint}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <NextLink className="block h-full" href={href}>
        {card}
      </NextLink>
    );
  }

  return card;
}

/* ── StatTile (compact) ───────────────────────────────────────────────────── */

type StatTileProps = {
  label: string;
  value: string;
  icon?: IconComponent;
  tone?: MetricTone;
  hint?: string;
  loading?: boolean;
};

/** Compact stat used inside panels, e.g. secondary KPI rows. */
export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
  loading,
}: StatTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line-hairline bg-surface p-3.5 sm:p-4">
      {Icon && (
        <span
          className={clsx(
            "grid size-9 shrink-0 place-items-center rounded-md",
            toneChip[tone]
          )}
        >
          <Icon aria-hidden size={17} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle">
          {label}
        </p>
        {loading ? (
          <div className="xm-skeleton mt-1 h-5 w-16 rounded-xs bg-surface-sunken" />
        ) : (
          <p className="tabular mt-0.5 truncate text-title-md font-bold text-content">
            {value}
          </p>
        )}
        {hint && !loading && (
          <p className="mt-0.5 truncate text-label-sm text-content-subtle">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Grid helper ──────────────────────────────────────────────────────────── */

export const metricGrid =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5";
