
export type CaseCategory =
  | "Income Verification"
  | "Residency"
  | "Disability"
  | "Payments";

export type CaseGuide = {
  id: string;
  title: string;
  category: CaseCategory;
  description: string;
  keywords: string[];
};

export const cases: CaseGuide[] = [
  {
    id: "multiple-adults",
    title: "Multiple Adults in a Household",
    category: "Income Verification",
    description:
      "Guidance for reviewing household income documents when multiple adults are listed on an application or lease.",
    keywords: ["income", "lease", "household", "pay stubs"],
  },
  {
    id: "missing-pay-stubs",
    title: "Missing Income Documentation",
    category: "Income Verification",
    description:
      "How to identify missing income documents and determine the appropriate follow-up.",
    keywords: ["income", "missing documents", "employment"],
  },
  {
    id: "non-resident",
    title: "Applicant Residency Questions",
    category: "Residency",
    description:
      "Guidance for checking residency documentation and addressing uncertain residency eligibility.",
    keywords: ["address", "resident", "verification"],
  },
  {
    id: "disability-verification",
    title: "Disability Documentation",
    category: "Disability",
    description:
      "Reviewing acceptable disability verification documentation under the applicable program policy.",
    keywords: ["disability", "verification", "documents"],
  },
  {
    id: "previous-payment",
    title: "Application Submitted After Payment",
    category: "Payments",
    description:
      "Guidance for responding when an applicant requests a discount after paying for an activity.",
    keywords: ["payment", "refund", "retroactive"],
  },
];
