
"use client";

import { useState } from "react";
import { accountNotFoundEmail } from "@/lib/assistant/email-templates";

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

type Result = {
  title: string;
  explanation: string;
  email: string;
};

const questions: Question[] = [
  {
    id: "account",
    title: "Does the applicant currently have an active scholarship?",
    description:
      "Check the applicant's Enjoy! Online account and verify whether an active scholarship exists.",
    options: [
      { label: "Yes, an active scholarship exists", value: "active" },
      { label: "No, there is no active scholarship", value: "none" },
      { label: "Unable to verify the account", value: "unknown" },
    ],
  },
  {
    id: "residency",
    title: "Which type of residency verification did the applicant provide?",
    description:
      "Select the residency document submitted with the Fee Reduction Application. Confirm that it is current, legible, and applies to the applicant before determining eligibility.",
    options: [
      { label: "Valid CA Driver's License or Identification Card", value: "license" },
      { label: "City of Palo Alto Utility Bill", value: "utility" },
      { label: "Current Lease showing address", value: "lease" },
      { label: "Telephone Bill (landline)", value: "landline" },
      { label: "Applicant is not a Palo Alto resident", value: "nonresident" },
      { label: "No residency verification provided", value: "missing" },
    ],
  },
  {
    id: "income",
    title: "Which income documentation was provided?",
    description:
      "Review the documents against current program requirements.",
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
      "Check whether additional household documentation is required.",
    options: [
      { label: "Yes, documentation appears complete", value: "complete" },
      { label: "No, documents from other adults are missing", value: "missing" },
      { label: "Unable to determine", value: "unknown" },
    ],
  },
  {
    id: "children",
    title: "Does the application list any children or dependents?",
    description:
      "The applicant is not a Palo Alto resident. Check whether any children or dependents are listed on the Fee Reduction Application.",
    options: [
      { label: "Yes, children/dependents are listed", value: "yes" },
      { label: "No, no children/dependents are listed", value: "no" },
    ],
  },
];

const CHILDREN_STEP = questions.findIndex((question) => question.id === "children");
const RESULT_STEP = questions.length;
const EXPIRATION_STEP = questions.length + 1;

function formatDate(dateString: string): string {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getResult(
  answers: Record<string, string>,
  expirationDate: string
): Result {
  if (answers.account === "active") {
    const formattedDate = formatDate(expirationDate);

    return {
      title: "Existing Scholarship — Application Cannot Be Processed",
      explanation:
        `The applicant has an active scholarship valid through ${formattedDate}. Verify the date in Enjoy! Online before sending the response.`,
      email: `Hello,

Thank you for submitting your Fee Reduction Application.

After reviewing your Enjoy! Online account, we see that you currently have an active scholarship that is valid through ${formattedDate}. Because your current scholarship is still active, we are unable to process a new Fee Reduction Application at this time.

If you would like to reapply for the Fee Reduction Program, please submit a new application on or after ${formattedDate}.

If you have any questions, please feel free to reach out.

Thank you,
`,
    };
  }

  if (answers.account === "unknown") {
  return {
    title: "Enjoy! Online Account Verification Required",

    explanation:
      "We were unable to locate the applicant's Enjoy! Online account. " +
      "Provide account creation instructions or request the email " +
      "associated with an existing account.",

    email: accountNotFoundEmail(),
  };
}

  if (answers.residency === "nonresident" && answers.children === "yes") {
    return {
      title: "Follow Up — Possible Child-Only Eligibility",
      explanation:
        "The applicant is not a Palo Alto resident, but children or dependents are listed. Request PAUSD free/reduced lunch documentation for review. Do not imply adult eligibility or guarantee a scholarship.",
      email: `Hello,

Thank you for submitting your Fee Reduction Application.

After reviewing your supporting documentation, we noticed that your address is outside of Palo Alto. However, we also noticed that you listed children or dependents on your application.

If your children or dependents participate in the PAUSD Free or Reduced-Price Lunch Program, please send us a PDF of the documentation confirming their participation. We can then review whether your children or dependents qualify for the Fee Reduction Program under the applicable eligibility requirements.

Please note that this exception does not extend eligibility to adults who are not Palo Alto residents.

If you have any questions, please feel free to reach out.

Thank you,`,
    };
  }

  if (answers.residency === "nonresident" && answers.children === "no") {
    return {
      title: "Residency Requirement Not Met — Review Before Sending",
      explanation:
        "No qualifying Palo Alto residency or child-only exception was identified. Confirm the address and current program rules before sending an ineligibility notice.",
      email: `Hello,

Thank you for submitting your Fee Reduction Application.

After reviewing your application and supporting documentation, we noticed that your address is outside of Palo Alto. Unfortunately, we are unable to approve your application for the Fee Reduction Program because Palo Alto residency is a requirement for eligibility, and no applicable exception was identified.

If you believe there has been an error regarding your residency information, please feel free to contact us.

Thank you,`,
    };
  }

  if (answers.residency === "missing") {
    return {
      title: "Additional Residency Documentation Required",
      explanation:
        "Request acceptable residency documentation before continuing.",
      email: `Hello,

Thank you for submitting your Fee Reduction Application.

After reviewing your materials, we need additional documentation to verify your residency.

Please provide one of the accepted residency verification documents so we can continue reviewing your application.

Thank you,
`,
    };
  }

  if (answers.income === "missing" || answers.household === "missing") {
    return {
      title: "Additional Income Documentation Required",
      explanation:
        "Identify and request the outstanding household income documents.",
      email: `Hello,

Thank you for submitting your Fee Reduction Application.

After reviewing your materials, we noticed that additional household income documentation is needed.

Please provide the outstanding documents so we can continue processing your application.

Thank you,
`,
    };
  }

  if (answers.household === "unknown") {
    return {
      title: "Household Verification Required",
      explanation:
        "Clarify household information before completing the application review.",
      email: `Hello,

Thank you for submitting your Fee Reduction Application.

We need to clarify some household information before completing our review.

Please contact our office regarding the household members listed on your application.

Thank you,
`,
    };
  }

  return {
    title: "Documentation Selected — Verification Still Required",
    explanation:
      answers.residency === "pausd"
        ? "PAUSD enrollment evidence may support a child-only residency exception for a nonresident household. Verify the children's enrollment and all current program requirements; this document alone does not establish eligibility for adults or final approval."
        : "A residency document type was selected, but its validity and qualifying address have not yet been confirmed by this questionnaire. Verify residency, income limits, and all current program rules before approval.",
    email: `Hello,

Thank you for submitting your Fee Reduction Application.

We have received your documentation and are continuing our eligibility review.

We will follow up if additional information is required.

Thank you,
`,
  };
}

export default function AssistantPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [expirationDate, setExpirationDate] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedResidency, setSelectedResidency] = useState("");

  const isExpirationStep = step === EXPIRATION_STEP;
  const finished = step === RESULT_STEP;
  const current = step < questions.length ? questions[step] : null;

  const result = finished
    ? getResult(answers, expirationDate)
    : null;

  function handleAnswer(value: string) {
    if (!current) return;

    const updated = { ...answers, [current.id]: value };
    if (current.id === "residency") {
      delete updated.income;
      delete updated.household;
      delete updated.children;
    }
    if (current.id === "account") {
      for (const key of Object.keys(updated)) {
        if (key !== "account") delete updated[key];
      }
    }
    setAnswers(updated);
    setCopied(false);

    if (current.id === "account") {
      if (value === "active") {
        setStep(EXPIRATION_STEP);
        return;
      }

      if (value === "unknown") {
        setStep(RESULT_STEP);
        return;
      }
    }

    if (current.id === "residency") {
      if (value === "nonresident") {
        setStep(CHILDREN_STEP);
        return;
      }
      if (value === "missing") {
        setStep(RESULT_STEP);
        return;
      }
    }

    // Children is a special branch. All other paths finish after household.
    if (current.id === "children" || current.id === "household") {
      setStep(RESULT_STEP);
      return;
    }

    setStep((previous) => previous + 1);
  }

  function restart() {
    setAnswers({});
    setExpirationDate("");
    setSelectedResidency("");
    setStep(0);
    setCopied(false);
  }

  function goBack() {
    setCopied(false);

    if (isExpirationStep) {
      setStep(0);
      return;
    }

    if (step === CHILDREN_STEP) {
      setStep(1);
      return;
    }

    if (finished) {
      if (answers.account === "active") {
        setStep(EXPIRATION_STEP);
      } else if (answers.account === "unknown") {
        setStep(0);
      } else if (answers.residency === "nonresident") {
        setStep(CHILDREN_STEP);
      } else if (answers.residency === "missing") {
        setStep(1);
      } else {
        setStep(3);
      }
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
          {isExpirationStep ? (
            <>
              <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-400">
                Follow-Up Question
              </p>

              <h2 className="mb-3 text-2xl font-semibold">
                When does the applicant&apos;s current scholarship expire?
              </h2>

              <p className="mb-6 text-slate-600 dark:text-slate-300">
                Check the expiration date listed in Enjoy! Online.
                This date will automatically appear in the email template.
              </p>

              <label
                htmlFor="expiration-date"
                className="mb-2 block text-sm font-medium"
              >
                Scholarship Expiration Date
              </label>

              <input
                id="expiration-date"
                type="date"
                value={expirationDate}
                onChange={(event) =>
                  setExpirationDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <button
                type="button"
                disabled={!expirationDate}
                onClick={() => {
                  setCopied(false);
                  setStep(RESULT_STEP);
                }}
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate Email Template
              </button>
            </>
          ) : !finished && current ? (
            <>
              <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-400">
                Question {step === CHILDREN_STEP ? 3 : step + 1} of 4
              </p>

              <div className="mb-6 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: `${((step === CHILDREN_STEP ? 3 : step + 1) / 4) * 100}%`,
                  }}
                />
              </div>

              <h2 className="mb-3 text-2xl font-semibold">
                {current.title}
              </h2>

              <p className="mb-7 text-slate-600 dark:text-slate-300">
                {current.description}
              </p>

              {current.id === "children" && (
                <aside className="mb-7 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                  <p className="text-sm leading-6">
                    <strong>Important PAUSD exception:</strong> If a household lives
                    outside Palo Alto but their children/dependents attend PAUSD,
                    review the child-only eligibility exception. PAUSD enrollment
                    does not automatically qualify adults.
                  </p>
                </aside>
              )}

              {current.id === "residency" ? (
                <div className="space-y-6">
                  <aside className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                    <p className="text-sm leading-6">
                      <strong>Important residency reminder:</strong> East Palo Alto
                      and Stanford, CA are not qualifying Palo Alto residency
                      addresses. &quot;E Palo Alto&quot; on a California ID means East Palo Alto.
                    </p>
                  </aside>

                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Residency documents
                    </legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {current.options
                        .filter((option) => !["nonresident", "missing"].includes(option.value))
                        .map((option) => (
                        <label
                          key={option.value}
                          className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                            selectedResidency === option.value
                              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 dark:border-blue-400 dark:bg-blue-950/40 dark:ring-blue-400"
                              : "border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="residency-proof"
                            value={option.value}
                            checked={selectedResidency === option.value}
                            onChange={() => setSelectedResidency(option.value)}
                            className="h-4 w-4 shrink-0 accent-blue-600"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Other situations
                    </legend>
                    <div className="space-y-3">
                      {current.options
                        .filter((option) => ["nonresident", "missing"].includes(option.value))
                        .map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                            selectedResidency === option.value
                              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 dark:border-blue-400 dark:bg-blue-950/40 dark:ring-blue-400"
                              : "border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="residency-proof"
                            value={option.value}
                            checked={selectedResidency === option.value}
                            onChange={() => setSelectedResidency(option.value)}
                            className="h-4 w-4 shrink-0 accent-blue-600"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    type="button"
                    disabled={!selectedResidency}
                    onClick={() => handleAnswer(selectedResidency)}
                    className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {current.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswer(option.value)}
                      className="w-full rounded-xl border border-slate-300 px-5 py-4 text-left transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
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
                    type="button"
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
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="rounded-lg border border-slate-300 px-5 py-2 disabled:opacity-40 dark:border-slate-600"
            >
              Back
            </button>

            <button
              type="button"
              onClick={restart}
              className="rounded-lg border border-slate-300 px-5 py-2 dark:border-slate-600"
            >
              Start Over
            </button>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          Staff must verify all information and current policies
          before sending an email or making an eligibility decision.
        </p>
      </div>
    </main>
  );
}