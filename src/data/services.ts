export type ServiceCategory = {
  id: string;
  title: string;
  summary: string;
  audience: string;
  startingPrice: string;
  deliverables: string[];
  documents: string[];
  detailIntro: string;
  pricingNote: string;
  scopeNote: string;
  timeline: string;
  faqs: { question: string; answer: string }[];
  urgency?: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "itr-filing",
    title: "ITR Filing Services",
    summary:
      "Return preparation, tax computation, portal filing, ITR-V delivery, and e-verification support for individuals, businesses, LLPs, companies, and trusts.",
    audience: "Salaried professionals, business owners, investors, NRIs, LLPs, companies, and trusts",
    startingPrice: "Scope based",
    deliverables: [
      "Old vs New Regime comparison",
      "Filed return and acknowledgement",
      "Computation sheet where applicable",
      "Refund tracking for 30 days",
    ],
    documents: [
      "PAN and Aadhaar",
      "Form 16 / Form 16A",
      "Bank statements",
      "Investment proofs",
      "Capital gains statements",
    ],
    detailIntro:
      "ITR filing covers end-to-end return preparation, tax computation review, portal filing, and acknowledgement delivery based on the right return type and the client profile.",
    pricingNote:
      "Engagement scope is confirmed after reviewing the return form, number of income heads, capital gains complexity, foreign assets, and supporting reconciliations.",
    scopeNote:
      "Where accounts, gains statements, or prior-year corrections need deeper review, scope is assessed before confirming the engagement path.",
    timeline:
      "Most standard individual returns can move quickly once complete documents are shared and reconciled.",
    faqs: [
      {
        question: "What affects the engagement scope for ITR filing?",
        answer:
          "The engagement scope depends on the return type, capital gains volume, business income, NRI status, and whether extra computation or reconciliation work is needed.",
      },
      {
        question: "What do we need before filing starts?",
        answer:
          "We usually need identity documents, income proofs, bank statements, investment details, and any broker or rental records relevant to the return.",
      },
    ],
  },
  {
    id: "gst-services",
    title: "GST Services",
    summary:
      "GST registration, monthly and quarterly return filing, annual returns, reconciliation, cancellation, notices, and refund claims.",
    audience: "Businesses, freelancers, exporters, GST-registered taxpayers",
    startingPrice: "Scope based",
    deliverables: [
      "GSTIN certificate support",
      "GSTR-1 and GSTR-3B filing",
      "Annual return and reconciliation",
      "Notice reply and refund tracking",
    ],
    documents: ["PAN", "Aadhaar", "Business address proof", "Sales and purchase data", "Bank details"],
    detailIntro:
      "GST services include registration, return filing, annual compliance, reconciliations, notice support, and refund assistance depending on the client’s filing profile.",
    pricingNote:
      "Engagement scope is confirmed after reviewing filing frequency, invoice volume, reconciliation complexity, and notice handling requirements.",
    scopeNote:
      "Registrations, annual filings, notices, cancellations, and refund claims are quoted based on the exact transaction profile and pending compliance history.",
    timeline:
      "Regular monthly and quarterly work is planned around GST due dates and document readiness.",
    faqs: [
      {
        question: "Why is GST pricing not fixed for every client?",
        answer:
          "GST workloads vary based on number of invoices, reconciliation gaps, amendment needs, and whether there are pending notices or annual return requirements.",
      },
      {
        question: "What should be kept ready for GST filing?",
        answer:
          "Sales data, purchase data, GST login access if required, registration details, and bank or tax payment records should be available.",
      },
    ],
    urgency: "GSTR-3B is typically due by the 20th of every month.",
  },
  {
    id: "tax-planning",
    title: "Tax Planning & Advisory",
    summary:
      "Year-round planning to legally reduce tax liability through regime selection, investment planning, advance tax, salary restructuring, and retainer advisory.",
    audience: "Salaried employees, founders, freelancers, HNIs, business owners",
    startingPrice: "Scope based",
    deliverables: [
      "Written recommendation",
      "Investment roadmap",
      "Quarterly advance tax schedule",
      "Annual advisory option",
    ],
    documents: ["Salary structure", "Investment proofs", "Expected income", "Rent and loan details"],
    detailIntro:
      "Tax planning and advisory is focused on reducing tax outflow legally through better structuring, deduction planning, quarterly reviews, and year-round decisions.",
    pricingNote:
      "Engagement scope is confirmed after reviewing whether the work is a one-time review, structured note, or recurring annual advisory support.",
    scopeNote:
      "For high-income, business-owner, or multi-income situations, scope depends on planning depth, documentation review, and number of advisory rounds.",
    timeline:
      "Advisory timelines depend on the complexity of income streams and how quickly the underlying data is shared.",
    faqs: [
      {
        question: "Is this different from basic ITR filing?",
        answer:
          "Yes. Tax planning is broader and helps clients decide before filing, including regime choice, investment planning, and advance tax strategy.",
      },
      {
        question: "Can this be offered as a yearly service?",
        answer:
          "Yes. Many clients use this as a recurring advisory relationship through the financial year instead of waiting until filing season.",
      },
    ],
  },
  {
    id: "tax-notices",
    title: "Income Tax Notices",
    summary:
      "Handling of intimation, defective return, demand, reassessment, scrutiny, refund failure, and PAN-Aadhaar issues.",
    audience: "Taxpayers who received an Income Tax Department notice",
    startingPrice: "Scope based",
    deliverables: [
      "Notice review",
      "Reply drafting",
      "Revised return or rectification where needed",
      "Representation support for complex matters",
    ],
    documents: ["Notice copy", "Filed ITR", "Form 26AS/AIS", "Supporting proofs", "Portal login access"],
    detailIntro:
      "Notice handling is a time-sensitive representation service for taxpayers who need a professional response, supporting documentation, and clear next-step guidance.",
    pricingNote:
      "Engagement scope is confirmed after reviewing the notice section, urgency, hearing complexity, documentation burden, and representation requirements.",
    scopeNote:
      "Reassessment, scrutiny, demand disputes, and repeated department follow-up are quoted after reviewing the notice and supporting records.",
    timeline:
      "This service is usually treated as urgent because department timelines and response windows are strict.",
    faqs: [
      {
        question: "Why can notice pricing change so much?",
        answer:
          "Notices vary from simple intimation mismatches to full scrutiny or reassessment matters, so response preparation and representation effort can differ significantly.",
      },
      {
        question: "What should a client send first?",
        answer:
          "The notice copy, prior filed return, tax records, AIS or 26AS references, and any facts that explain the department query should be shared immediately.",
      },
    ],
    urgency: "Most notices need action within 15-30 days.",
  },
  {
    id: "nri-tax",
    title: "NRI Tax Services",
    summary:
      "Specialized Indian tax filing and advisory for NRIs, including DTAA claims, residency status, Schedule FA, TDS refund, FEMA, and repatriation.",
    audience: "NRIs, returning Indians, and residents with foreign assets",
    startingPrice: "Scope based",
    deliverables: [
      "Residency status note",
      "ITR-2 filing",
      "DTAA benefit documentation",
      "Remittance form assistance",
    ],
    documents: ["Passport travel dates", "TRC and Form 10F", "India income proofs", "Foreign asset details"],
    detailIntro:
      "NRI tax services are designed for clients dealing with Indian-source income, residency determination, DTAA claims, foreign disclosures, and repatriation-linked compliance.",
    pricingNote:
      "Engagement scope is confirmed after reviewing residency analysis, foreign income disclosures, DTAA documentation, and number of compliance layers involved.",
    scopeNote:
      "Where there are multiple jurisdictions, foreign assets, FEMA implications, or withholding mismatches, the engagement path is confirmed after scope review.",
    timeline:
      "Timelines depend on treaty documentation, travel history, foreign asset disclosures, and the type of return or advisory support required.",
    faqs: [
      {
        question: "What usually makes NRI work more complex?",
        answer:
          "Residency status, DTAA relief, multiple countries, foreign assets, withholding mismatches, and repatriation requirements all affect the scope.",
      },
      {
        question: "What should be prepared before the first review?",
        answer:
          "Travel records, India income details, treaty documents like TRC and Form 10F, and any foreign asset or foreign tax information should be ready.",
      },
    ],
  },
  {
    id: "tds-tcs",
    title: "TDS / TCS Compliance",
    summary:
      "Quarterly TDS returns, Form 16/16A generation, correction statements, TAN registration, and lower TDS certificate applications.",
    audience: "Employers and businesses paying salary, rent, contractor charges, professional service payments, or NRI payments",
    startingPrice: "Scope based",
    deliverables: [
      "24Q, 26Q, and 27Q returns",
      "Form 16 and 16A generation",
      "Correction return filing",
      "Deadline reminders",
    ],
    documents: ["TAN", "Challans", "Deductee PANs", "Payment details", "Salary or vendor data"],
    detailIntro:
      "TDS and TCS compliance is structured for recurring business support across quarterly returns, certificate generation, correction statements, and withholding planning.",
    pricingNote:
      "Engagement scope is confirmed after reviewing employee or vendor count, return type, correction work, and deductee data quality.",
    scopeNote:
      "Large deductee volumes, historical correction issues, and NRI payment compliance are reviewed separately before the engagement path is confirmed.",
    timeline:
      "Quarterly compliance runs on a recurring deadline cycle and works smoothly when challans and deductee data are shared in a timely manner.",
    faqs: [
      {
        question: "Is this a recurring service?",
        answer:
          "Yes. Most businesses use this as a quarterly compliance service because returns, certificates, and corrections repeat through the year.",
      },
      {
        question: "What documents are needed for TDS filing?",
        answer:
          "We usually need the TAN, challan details, deductee records, salary or payment data, and any correction references from previous filings.",
      },
    ],
  },
  {
    id: "business-registration",
    title: "Business Registration & Compliance",
    summary:
      "Company, LLP, OPC, partnership, proprietorship, MSME, Startup India, and ROC annual compliance support.",
    audience: "Entrepreneurs, startups, professional practices, and growing businesses",
    startingPrice: "Scope based",
    deliverables: [
      "Entity setup guidance",
      "Corporate incorporation support",
      "PAN/TAN and statutory registrations",
      "Annual ROC compliance",
    ],
    documents: ["Founder KYC", "Address proof", "Business name options", "Capital and ownership details"],
    detailIntro:
      "Business registration and compliance services help founders choose the right entity structure, complete formation, and maintain the statutory filings that follow.",
    pricingNote:
      "Engagement scope is confirmed after reviewing entity type, number of promoters, document readiness, and add-on registrations or annual compliance work.",
    scopeNote:
      "Private limited companies, LLPs, DPIIT registrations, and annual ROC matters are priced after understanding promoter structure and documentation needs.",
    timeline:
      "Timelines vary by entity type, approval speed, and whether supporting registrations are needed alongside incorporation.",
    faqs: [
      {
        question: "Why does registration pricing depend on structure?",
        answer:
          "Compliance load, documentation, approvals, drafting needs, and post-incorporation steps differ significantly between proprietorships, LLPs, and companies.",
      },
      {
        question: "What should founders keep ready?",
        answer:
          "Founder KYC, address proof, preferred business names, ownership details, and any planned registration requirements should be kept ready.",
      },
    ],
  },
  {
    id: "capital-gains",
    title: "Capital Gains Advisory",
    summary:
      "Accurate capital gains computation and exemption planning for stocks, mutual funds, property, gold, debt funds, and crypto/VDA transactions.",
    audience: "Investors, property sellers, traders, and crypto taxpayers",
    startingPrice: "Scope based",
    deliverables: [
      "Schedule CG/VDA computation",
      "Section 54, 54F, and 54EC planning",
      "Loss carry-forward setup",
      "ITR filing support",
    ],
    documents: ["Broker P&L", "AIS/Form 26AS", "Property sale documents", "Purchase cost proofs"],
    detailIntro:
      "Capital gains advisory is designed for taxpayers who need accurate gain computation, exemption planning, transaction categorisation, and return reporting support.",
    pricingNote:
      "Engagement scope is confirmed after reviewing transaction count, property or crypto complexity, exemption planning, and reconciliation work.",
    scopeNote:
      "High-volume broker statements, mixed asset classes, historical cost reconstruction, and exemption planning are evaluated before the engagement path is confirmed.",
    timeline:
      "Timelines depend on how complete the broker, property, or asset records are and whether exemption planning is time-sensitive.",
    faqs: [
      {
        question: "Why does capital gains work need document review first?",
        answer:
          "Gains treatment depends heavily on transaction records, holding period, cost details, exemptions, and how complete the broker or property data is.",
      },
      {
        question: "What records should be shared at the start?",
        answer:
          "Broker statements, AIS or 26AS data, purchase and sale records, property papers, and any exemption-related documents should be shared first.",
      },
    ],
  },
];
