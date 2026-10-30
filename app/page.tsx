
import Link from "next/link";

const features = [
  {
    title: "Case Library",
    description:
      "Search case scenarios, review documentation requirements, and find step-by-step guidance.",
    href: "/cases",
    label: "Browse Cases",
  },
  {
    title: "Guided Case Assistant",
    description:
      "Answer a series of questions to find relevant policies and recommended next steps.",
    href: "/assistant",
    label: "Start Questionnaire",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex-1 bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            Fee Reduction Program
          </p>

          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">
            How can we help today?
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Find guidance for common application scenarios,
            review documentation requirements, and navigate
            complex cases with confidence.
          </p>

          <div className="mt-8 max-w-2xl">
            <label
              htmlFor="case-search"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Search the knowledge base
            </label>

            <input
              id="case-search"
              type="search"
              placeholder="Search cases, policies, or documentation..."
              disabled
              className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-900 shadow-sm outline-none disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Search functionality coming soon.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">
            Choose how you want to get started
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>

                <p className="mb-8 flex-1 leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>

                <Link
                  href={feature.href}
                  className="inline-flex w-fit items-center rounded-lg bg-blue-700 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {feature.label}

                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          CaseWise — A case guidance and knowledge management application.
        </footer>
      </div>
    </main>
  );
}
