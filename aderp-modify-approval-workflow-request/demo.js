// Modify Approval Workflow or DoA (ADERP) — Demo (strict mapping)

// Optional external links in your description (set if you have them)
const URLS = {
  issue:       "https://example.com/incident",
  enhancement: "https://example.com/enhancement",
  reporting:   "https://example.com/reporting"
};

// --- Mapping --------------------------------------------------------------
// Offering labels -> internal domains used in the dependency tree
const OFFERING_TO_DOMAIN = {
  "Human Resources (ADERP - Fusion)": "HR",
  "Procurement (ADERP - Fusion)": "Procurement",
  "Finance (ADERP - Fusion)": "Finance"
};

// Full dependency: Domain -> Module -> [Workflows]
const MAP = {
  HR: {
    "Core HR (Person Management)": [
      "Hire / Rehire Approval",
      "Transfer / Global Transfer Approval",
      "Termination / Separation Approval",
      "Salary Change (Merit/Adjustment) Approval",
      "Bank Account Change Approval",
      "Personal Information Change Approval",
      "Position Create/Update Approval",
      "Other (specify)"
    ],
    "Payroll": [
      "Payroll Run Sign-off / Pre-Run Approval",
      "Payment File / PPR Approval for Payroll",
      "Retro Pay / Element Entry Approval",
      "Off-Cycle Payment Approval",
      "Payroll Costing Allocation Change Approval",
      "Payroll Bank File Release Approval",
      "Other (specify)"
    ],
    "Absence Management": [
      "Leave Request Approval",
      "Carryover / Encashment Approval",
      "Balance Adjustment Approval",
      "Other (specify)"
    ],
    "Time & Labor (OTL)": [
      "Timecard Approval",
      "Time Correction / Retract Approval",
      "Schedule Change Approval",
      "Other (specify)"
    ],
    "Compensation": [
      "Merit Plan / Cycle Approval",
      "Individual Compensation Award Approval",
      "Grade / Step Change Approval",
      "Other (specify)"
    ],
    "Benefits": [
      "Enrollment Exception Approval",
      "Life Event Approval",
      "Other (specify)"
    ],
    "Recruiting": [
      "Requisition Approval",
      "Offer Approval",
      "Other (specify)"
    ],
    "Onboarding": [
      "Task Package Approval",
      "Other (specify)"
    ],
    "Learning": [
      "Course/Program Creation Approval",
      "Enrollment / Assignment Approval",
      "Other (specify)"
    ],
    "Talent / Performance": [
      "Goal Plan Approval",
      "Performance Document Workflow Change",
      "Other (specify)"
    ],
    "HR Help Desk": [
      "HRSR Category / Workflow Change Approval",
      "SLA / Priority Matrix Change Approval",
      "Other (specify)"
    ]
  },

  Procurement: {
    "Self-Service Procurement (SSP)": [
      "Requisition Approval",
      "Amount/Threshold DoA Change",
      "Other (specify)"
    ],
    "Purchasing": [
      "Purchase Order Approval",
      "PO Change Order Approval",
      "Receipt/Return Workflow Change",
      "Other (specify)"
    ],
    "Supplier Registration/Qualification": [
      "Supplier Registration Approval",
      "Supplier Qualification Approval",
      "Supplier Change Request Approval",
      "Other (specify)"
    ],
    "Supplier Portal": [
      "Supplier User Access Workflow",
      "Supplier Bank Change Approval (Portal)",
      "Other (specify)"
    ],
    "Sourcing": [
      "Award Recommendation Approval",
      "Negotiation Strategy / Exception Approval",
      "Other (specify)"
    ],
    "Procurement Contracts": [
      "Contract Approval",
      "Amendment Approval",
      "Other (specify)"
    ],
    "Agreements (Blanket/Contract)": [
      "Blanket Agreement Approval",
      "Agreement Amendment Approval",
      "Other (specify)"
    ],
    "Catalog & Category Management": [
      "Item/Category Create/Change Approval",
      "Catalog Mapping/Price Change Approval",
      "Other (specify)"
    ]
  },

  Finance: {
    "Accounts Payable": [
      "AP Invoice Approval",
      "Payment Process Request (PPR) Approval",
      "Supplier Bank Account Change Approval",
      "Debit/Credit Memo Approval",
      "Other (specify)"
    ],
    "Expenses": [
      "Expense Report Approval",
      "Cash Advance Approval",
      "Policy Exception Approval",
      "Other (specify)"
    ],
    "Accounts Receivable": [
      "Credit Memo / Write-off Approval",
      "Customer Profile / Credit Limit Change",
      "Other (specify)"
    ],
    "General Ledger": [
      "Journal Entry Approval",
      "Allocation Rule Approval",
      "Ledger/CoA Value Create/Change Approval",
      "Other (specify)"
    ],
    "Fixed Assets": [
      "Asset Add / Transfer / Retire Approval",
      "Asset Impairment Approval",
      "Other (specify)"
    ],
    "Cash Management": [
      "Bank Account Transfer Approval",
      "Bank Statement Rule Change Approval",
      "Other (specify)"
    ],
    "Intercompany": [
      "Intercompany Transaction Approval",
      "Intercompany Balance Settlement Approval",
      "Other (specify)"
    ],
    "Tax": [
      "Tax Override / Exception Approval",
      "Tax Rule/Rate Change Approval",
      "Other (specify)"
    ],
    "Collections": [
      "Collection Strategy / Dunning Change",
      "Write-off Threshold DoA Change",
      "Other (specify)"
    ],
    "Revenue Management": [
      "Revenue Recognition Rule Change",
      "Contract / Performance Obligation Change",
      "Other (specify)"
    ]
  }
};

// --- DOM -------------------------------------------------------------------
const offeringEl   = document.getElementById("offering");
const moduleEl     = document.getElementById("module");
const workflowEl   = document.getElementById("workflow");
const otherWrap    = document.getElementById("otherWrapper");
const otherEl      = document.getElementById("other_workflow");

const requestedFor = document.getElementById("requested_for");
const contactEl    = document.getElementById("contact_number");
const locationEl   = document.getElementById("location");
const titleEl      = document.getElementById("request_title");
const justEl       = document.getElementById("business_justification");
const descEl       = document.getElementById("change_description");

const attachEl     = document.getElementById("attachments");
const attachList   = document.getElementById("attachmentList");
const submitBtn    = document.getElementById("submitBtn");
const out          = document.getElementById("submission_output");

// wire description links if present
["issue_link","enhancement_link","reporting_link"].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === "issue_link") el.href = URLS.issue;
  if (id === "enhancement_link") el.href = URLS.enhancement;
  if (id === "reporting_link") el.href = URLS.reporting;
});

// --- helpers ---------------------------------------------------------------
function clearSelect(sel, placeholder) {
  sel.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholder;
  ph.disabled = true; ph.selected = true;
  sel.appendChild(ph);
}
function populateSelect(sel, arr) {
  clearSelect(sel, "-- Select --");
  arr.forEach(v => {
    const o = document.createElement("option");
    o.value = v; o.textContent = v;
    sel.appendChild(o);
  });
  sel.disabled = false;
}
function setError(input, flag) {
  const field = input.closest(".sn-field");
  if (field) field.classList.toggle("error", !!flag);
}
function requiredOK(input) {
  const v = (input.type === "file")
    ? (input.files && input.files.length > 0)
    : !!String(input.value || "").trim();
  setError(input, !v);
  return v;
}

// --- offering → module -----------------------------------------------------
offeringEl.addEventListener("change", () => {
  const domain = OFFERING_TO_DOMAIN[offeringEl.value] || null;

  clearSelect(moduleEl, domain ? "-- Select Module --" : "-- Select Offering first --");
  moduleEl.disabled = !domain;

  clearSelect(workflowEl, "-- Select Module first --");
  workflowEl.disabled = true;

  otherWrap.classList.add("hidden");
  otherEl.value = "";

  if (!domain) return;
  const modules = Object.keys(MAP[domain] || {});
  populateSelect(moduleEl, modules);
});

// --- module → workflow -----------------------------------------------------
moduleEl.addEventListener("change", () => {
  const domain = OFFERING_TO_DOMAIN[offeringEl.value] || null;
  const mod    = moduleEl.value || null;

  clearSelect(workflowEl, mod ? "-- Select Workflow / DoA --" : "-- Select Module first --");
  workflowEl.disabled = !mod;

  otherWrap.classList.add("hidden");
  otherEl.value = "";

  if (!domain || !mod) return;
  const list = (MAP[domain] && MAP[domain][mod]) ? MAP[domain][mod] : [];
  populateSelect(workflowEl, list);
});

// --- workflow → other(specify) --------------------------------------------
workflowEl.addEventListener("change", () => {
  const showOther = workflowEl.value === "Other (specify)";
  otherWrap.classList.toggle("hidden", !showOther);
  if (!showOther) otherEl.value = "";
});

// --- attachments UX (optional) --------------------------------------------
attachEl?.addEventListener("change", () => {
  const files = Array.from(attachEl.files || []);
  attachList.textContent = files.length ? ("Selected files: " + files.map(f => f.name).join(", ")) : "";
});

// --- submit (mock) ---------------------------------------------------------
submitBtn?.addEventListener("click", (e) => {
  e.preventDefault();

  let valid = true;
  [
    offeringEl, moduleEl, workflowEl,
    requestedFor, contactEl, locationEl,
    titleEl, justEl, descEl
  ].forEach(el => { valid = requiredOK(el) && valid; });

  if (workflowEl.value === "Other (specify)") {
    valid = requiredOK(otherEl) && valid;
  } else {
    setError(otherEl, false);
  }

  if (!valid) {
    const firstErr = document.querySelector(".sn-field.error .sn-input, .sn-field.error .sn-select, .sn-field.error .sn-textarea, .sn-field.error .sn-file");
    firstErr?.focus();
    return;
  }

  const payload = {
    requested_for: requestedFor.value.trim(),
    contact: contactEl.value.trim(),
    location: locationEl.value.trim(),
    offering: offeringEl.value,
    module: moduleEl.value,
    workflow_or_doa: workflowEl.value,
    other_workflow: workflowEl.value === "Other (specify)" ? otherEl.value.trim() : null,
    business_justification: justEl.value.trim(),
    request_title: titleEl.value.trim(),
    change_description: descEl.value.trim(),
    attachments: attachEl?.files ? [...attachEl.files].map(f => f.name) : [],
    submitted_at: new Date().toISOString()
  };

  out.classList.remove("hidden");
  out.innerHTML = "<strong>Mock submission payload</strong>";
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(payload, null, 2);
  out.appendChild(pre);
  out.scrollIntoView({ behavior: "smooth", block: "start" });
});