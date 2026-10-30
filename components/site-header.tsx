
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          CaseWise
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
            Staff Knowledge Center
          </span>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
