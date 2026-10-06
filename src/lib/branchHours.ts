import { isDayType, type TBranch } from "@/src/interface/branch";

const toMinutes = (time?: string): number | null => {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);

  if (Number.isNaN(h)) return null;

  return h * 60 + (m || 0);
};

/** The hours bucket that covers today, if the branch publishes one. */
export function hoursForToday(branch: TBranch) {
  const buckets = branch.operatingHours ?? [];

  if (!buckets.length) return null;

  const day = new Date().getDay(); // 0 = Sunday
  const isWeekend = day === 0 || day === 6;

  const match =
    buckets.find((b) => isDayType(b.dayType, isWeekend ? "weekends" : "weekdays")) ??
    buckets.find((b) => isDayType(b.dayType, "weekdays"));

  return match ?? null;
}

export function isOpenNow(branch: TBranch): boolean {
  const today = hoursForToday(branch);

  if (!today || today.isClosed) return false;

  if (today.is24Hours) return true;

  const opens = toMinutes(today.openingTime);
  const closes = toMinutes(today.closingTime);

  if (opens === null || closes === null) return false;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  return current >= opens && current <= closes;
}

/** Latest closing time across every bucket, in minutes. Null if never open. */
export function latestClosingMinutes(branch: TBranch): number | null {
  let latest: number | null = null;

  for (const bucket of branch.operatingHours ?? []) {
    if (bucket.isClosed || bucket.is24Hours) continue;
    const closes = toMinutes(bucket.closingTime);

    if (closes === null) continue;
    if (latest === null || closes > latest) latest = closes;
  }

  return latest;
}

/** Compact status: "Open · closes 10pm", "Opens 9am", "Closed today". */
export function statusLine(branch: TBranch): string {
  const today = hoursForToday(branch);

  if (!today) return "Hours not published";
  if (today.isClosed) return "Closed today";
  if (today.is24Hours) return "Open 24 hours";
  if (!today.openingTime || !today.closingTime) return "Open";

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const opens = toMinutes(today.openingTime);
  const closes = toMinutes(today.closingTime);

  if (closes !== null && current >= closes) return "Closed for today";
  if (opens !== null && current < opens) return `Opens ${today.openingTime}`;

  return `Open · closes ${today.closingTime}`;
}

/** Human summary of the weekly schedule for the card footer. */
export function scheduleSummary(branch: TBranch): string {
  const buckets = branch.operatingHours ?? [];
  
  if (!buckets.length) return "Hours not published";

  return buckets
    .map((bucket) => {
      const label = bucket.dayType.charAt(0).toUpperCase() + bucket.dayType.slice(1).toLowerCase();
      
      if (bucket.isClosed) return `${label}: closed`;
      if (bucket.is24Hours) return `${label}: 24 hours`;
      if (!bucket.openingTime || !bucket.closingTime) return `${label}: closed`;
     
      return `${label}: ${bucket.openingTime}–${bucket.closingTime}`;
    })
    .join(" · ");
}

/** Deep link straight into turn-by-turn directions for this outlet. */
export function directionsHref(branch: TBranch): string {
  const coords = branch.location?.coordinates?.coordinates;
  const [lng, lat] = Array.isArray(coords) && coords.length === 2 ? coords : [];

  if (typeof lat === "number" && typeof lng === "number") {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  const query = [branch.name, branch.location?.address, branch.location?.city]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
