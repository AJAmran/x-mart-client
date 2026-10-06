"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

type ThemeSwitchProps = {
  className?: string;
  /** Renders the "Theme" word next to the icon. */
  showLabel?: boolean;
};


export function ThemeSwitch({ className, showLabel = false }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle colour theme"
      }
      className={clsx(
        "inline-flex h-10 items-center gap-2 rounded-sm px-2.5 text-content-muted",
        "transition-colors duration-fast ease-standard",
        "hover:bg-surface-sunken hover:text-content",
        showLabel && "h-9 px-3",
        className
      )}
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun
        aria-hidden
        className="size-[18px] shrink-0 rotate-0 scale-100 transition-transform duration-slower ease-standard dark:-rotate-90 dark:scale-0"
      />
      <Moon
        aria-hidden
        className="size-[18px] shrink-0 rotate-90 scale-0 transition-transform duration-slower ease-standard dark:rotate-0 dark:scale-100"
      />
      {showLabel && (
        <span className="text-label-sm font-medium">
          {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
        </span>
      )}
    </button>
  );
}

export default ThemeSwitch;