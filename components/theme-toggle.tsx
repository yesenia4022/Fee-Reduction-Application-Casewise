
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return <div className="h-10 w-28" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {isDark ? "☀ Light mode" : "☾ Dark mode"}
    </button>
  );
}
