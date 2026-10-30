
"use client";

import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Question = {
  id: string;
  title: string;
  description: string;
  options: Option[];
};

const questions: Question[] = [
  {
    id: "account",
    title: "Does the applicant have an active scholarship?",
    description:
      "Check the applicant's Enjoy! Online account and verify there isnt't an active scholarship.",
    options: [
      { label: "Yes, an active scholarship exists", value: "active" },
      { label: "No, there is no active scholarship", value: "none" },
      { label: "Unable to verify the account", value: "unknown" },
    ],
  },
  {
    id: "residency",
    title: "What is the applicant's residency situation?",
    description:
      "Review the submitted residency documents and qualifying address.",
    options: [
      { label: "Verified Palo Alto resident", value: "resident" },
      { label: "Non-resident with children in PAUSD", value: "pausd" },
      { label: "Non-resident without an identified exception", value: "nonresident" },
      { label: "Residency documentation is missing or unclear", value: "missing" },
    ],
  },
  {
    id: "income",
    title: "Which income documentation was provided?",
    description:
      "Review the documents against the current program requirements.",
    options: [
      { label: "Current RAP documentation", value: "rap" },
      { label: "PAUSD free/reduced lunch documentation", value: "lunch" },
      { label: "Prior-year tax return", value: "tax" },
      { label: "Two current pay stubs", value: "paystubs" },
      { label: "Missing or incomplete documentation", value: "missing" },
    ],
  },
  {
    id: "household",
    title: "Are all applicable household members documented?",
    description:
      "Check whether additional adults or household information require review.",
    options: [
      { label: "Yes, documentation appears complete", value: "complete" },
      { label: "No, documents from other adults are missing", value: "missing" },
      { label: "Unable to determine", value: "unknown" },
    ],
  },
];

type Result = {
  title: string;
  explanation: string;
  email: string;
};

function getResult(answers: Record<string, string>): Result {
  if (answers.account === "active") {
    return {
      title: "Existing Scholarship — Follow Up",
      explanation:
        "Verify the current scholarship expiration date before instructing the applicant about reapplication.",
      email:
        "Hello,\n\nThank you for your interest in the Fee Reduction Program. After reviewing your Enjoy! Online account, we noticed that an active scholarship is currently associated with your account.\n\nPlease review the expiration date with our staff. You may reapply on or after the applicable expiration date.\n\nPlease let us know if you have any questions.\n\nBest,",
    };
  }

  if (answers.account === "unknown") {
    return {
      title: "Account Verification Required",
      explanation:
        "Confirm the correct Enjoy! Online account before proceeding with the eligibility review.",
      email:
        "Hello,\n\nThank you for submitting your Fee Reduction application. We are having difficulty locating or verifying the associated Enjoy! Online account.\n\nCould you please confirm the email address associated with your account?\n\nThank you,\n\nBest,",
    };
  }

  if (answers.residency === "missing") {
    return {
      title: "Additional Residency Documentation Required",
      explanation:
        "Request an acceptable, current residency document before continuing.",
      email:
        "Hello,\n\nThank you for submitting your Fee Reduction application. After reviewing your materials, we need additional documentation to verify residency.\n\nPlease provide a current, acceptable proof of residency so we can continue reviewing your application.\n\nBest,",
    };
  }

  if (answers.residency === "nonresident") {
    return {
      title: "Potential Residency Ineligibility",
      explanation:
        "The applicant may not meet the residency requirement. Verify the current policy and any applicable exceptions before making a final determination.",
      email:
        "Hello,\n\nThank you for submitting your Fee Reduction application. Based on the residency information provided, we need to clarify whether your household meets the program's residency requirements.\n\nWe will review the applicable requirements before confirming eligibility.\n\nBest,",
    };
  }

  if (answers.income === "missing" || answers.household === "missing") {
    return {
      title: "Additional Income Documentation Required",
      explanation:
        "The application appears incomplete. Identify and request the outstanding documentation.",
      email:
        "Hello,\n\nThank you for submitting your Fee Reduction application. After reviewing your materials, we noticed that additional household income documentation is needed.\n\nPlease provide the outstanding documents so we can continue processing your application.\n\nBest,",
    };
  }

  if (answers.household === "unknown") {
    return {
      title: "Household Verification Required",
      explanation:
        "Clarify household membership and applicable documentation requirements before completing the review.",
      email:
        "Hello,\n\nThank you for submitting your Fee Reduction application. We need to clarify some household information before completing our review.\n\nPlease contact our office regarding the household members listed on your application.\n\nBest,",
    };
  }

  return {
    title: "Ready for Final Eligibility Review",
    explanation:
      answers.residency === "pausd"
        ? "Review the PAUSD child-only exception and verify supporting documentation. This does not establish adult eligibility."
        : "The preliminary documentation checks are complete. Verify income limits and all current program rules before approving the application.",
    email:
      "Hello,\n\nThank you for submitting your Fee Reduction application. We have received the documentation provided and are continuing our eligibility review.\n\nWe will follow up if additional information is required.\n\nBest,",
  };
}

export default function AssistantPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const finished = step >= questions.length;
  const current = questions[step];
  const result = finished ? getResult(answers) : null;

  function handleAnswer(value: string) {
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);
    setCopied(false);

    if (current.id === "account" && value !== "none") {
      setStep(questions.length);
      return;
    }

    if (
      current.id === "residency" &&
      (value === "missing" || value === "nonresident")
    ) {
      setStep(questions.length);
      return;
    }

    setStep((previous) => previous + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setCopied(false);
  }

  function goBack() {
    if (finished && answers.account !== "none") {
      restart();
      return;
    }

    if (
      finished &&
      ["missing", "nonresident"].includes(answers.residency)
    ) {
      setStep(1);
      return;
    }

    setStep((previous) => Math.max(0, previous - 1));
  }

  async function copyEmail() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen flex-1 bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            Fee Reduction Program
          </p>
          <h1 className="text-4xl font-bold">
            Guided Case Assistant
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Answer the questions below to identify the next steps
            for an application review.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {!finished && current ? (
            <>
              <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-400">
                Question {step + 1} of {questions.length}
              </p>

              <div className="mb-6 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <h2 className="mb-3 text-2xl font-semibold">
                {current.title}
              </h2>

              <p className="mb-7 text-slate-600 dark:text-slate-300">
                {current.description}
              </p>

              <div className="space-y-3">
                {current.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full rounded-xl border border-slate-300 px-5 py-4 text-left transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : result ? (
            <>
              <p className="mb-3 text-sm font-semibold text-blue-700 dark:text-blue-400">
                Preliminary Review Result
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                {result.title}
              </h2>

              <p className="mb-6 leading-7 text-slate-600 dark:text-slate-300">
                {result.explanation}
              </p>

              <div className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">
                    Suggested Email Template
                  </h3>

                  <button
                    onClick={copyEmail}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    {copied ? "Copied!" : "Copy Email"}
                  </button>
                </div>

                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7">
                  {result.email}
                </pre>
              </div>
            </>
          ) : null}

          <div className="mt-8 flex justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="rounded-lg border border-slate-300 px-5 py-2 disabled:opacity-40 dark:border-slate-600"
            >
              Back
            </button>

            <button
              onClick={restart}
              className="rounded-lg border border-slate-300 px-5 py-2 dark:border-slate-600"
            >
              Start Over
            </button>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          Prototype guidance only. Final eligibility decisions require
          verification against current program policies.
        </p>
      </div>
    </main>
  );
}
