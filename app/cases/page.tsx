
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cases } from "@/lib/cases";

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Income Verification",
    "Residency",
    "Disability",
    "Payments",
  ];

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const searchableText = [
        item.title,
        item.category,
        item.description,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(query)
      );
    });
  }, [search, category]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            CaseWise
          </Link>

          <Link href="/" className="text-sm text-blue-700 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-3 text-4xl font-bold">
          Case Library
        </h1>

        <p className="mb-8 text-slate-600">
          Browse common Fee Reduction scenarios and find
          relevant guidance.
        </p>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <input
            type="search"
            aria-label="Search case guides"
            placeholder="Search cases..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 md:col-span-2"
          />

          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-5 text-sm text-slate-500">
          Showing {filteredCases.length} of {cases.length} cases
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {filteredCases.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {item.category}
              </span>

              <h2 className="mb-3 text-xl font-semibold">
                {item.title}
              </h2>

              <p className="leading-7 text-slate-600">
                {item.description}
              </p>

              <p className="mt-5 text-xs text-slate-400">
                Detailed case guide coming soon
              </p>
            </article>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">
              No matching cases found
            </h2>
            <p className="mt-2 text-slate-500">
              Try another keyword or category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
