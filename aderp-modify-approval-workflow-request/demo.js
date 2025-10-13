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

// --- Elements -------------------------------------------------------------
const offeringEl = document.getElementById('offering');
const moduleEl = document.getElementById('module');
const workflowEl = document.getElementById('workflow');
const otherWrapper = document.getElementById('otherWrapper');
const otherEl = document.getElementById('other_workflow');

const requestedForEl = document.getElementById('requested_for');
const contactEl = document.getElementById('contact_number');
const locationEl = document.getElementById('location');
const titleEl = document.getElementById('request_title');
const justEl = document.getElementById('business_justification');
const descEl = document.getElementById('change_description');

const attachEl = document.getElementById('attachments');
const attachList = document.getElementById('attachmentList');

// --- Helpers --------------------------------------------------------------
function clearSelect(select, placeholderText) {
  select.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = placeholderText || '-- Select --';
  select.appendChild(opt);
}

function populateSelect(select, values) {
  clearSelect(select, '-- Select --');
  values.forEach(v => {
    const o = document.createElement('option');
    o.textContent = v;
    o.value = v;
    select.appendChild(o);
  });
  select.disabled = false;
}

function setErrorFor(el, hasError) {
  const field = el.closest('.sn-field');
  if (!field) return;
  field.classList.toggle('error', hasError);
}

// --- Dependency wiring ----------------------------------------------------
offeringEl.addEventListener('change', () => {
  const domain = OFFERING_TO_DOMAIN[offeringEl.value] || null;

  // Reset module & workflow & other
  clearSelect(moduleEl, domain ? '-- Select --' : '-- Select Offering first --');
  moduleEl.disabled = !domain;
  clearSelect(workflowEl, '-- Select Module first --');
  workflowEl.disabled = true;
  otherWrapper.classList.add('hidden');
  otherEl.value = '';

  if (!domain) return;

  const modules = Object.keys(MAP[domain] || {});
  populateSelect(moduleEl, modules);
});

moduleEl.addEventListener('change', () => {
  const domain = OFFERING_TO_DOMAIN[offeringEl.value] || null;
  const mod = moduleEl.value || null;

  // Reset workflow & other
  clearSelect(workflowEl, mod ? '-- Select --' : '-- Select Module first --');
  workflowEl.disabled = !mod;
  otherWrapper.classList.add('hidden');
  otherEl.value = '';

  if (!domain || !mod) return;

  const workflows = (MAP[domain] && MAP[domain][mod]) ? MAP[domain][mod] : [];
  populateSelect(workflowEl, workflows);
});

workflowEl.addEventListener('change', () => {
  const isOther = workflowEl.value === 'Other (specify)';
  otherWrapper.classList.toggle('hidden', !isOther);
  if (!isOther) {
    otherEl.value = '';
  }
});

// --- Attachments UX (optional, front-end only) ----------------------------
attachEl?.addEventListener('change', () => {
  if (!attachList) return;
  const files = Array.from(attachEl.files || []);
  if (!files.length) { attachList.textContent = ''; return; }
  attachList.textContent = 'Selected files: ' + files.map(f => f.name).join(', ');
});

// --- Validation -----------------------------------------------------------
function validate() {
  let ok = true;

  // Required fields per requirements
  const checks = [
    offeringEl,
    moduleEl,
    workflowEl,
    titleEl,
    justEl,
    descEl,
    requestedForEl,
    contactEl,
    locationEl
  ];

  checks.forEach(el => {
    const empty = !el.value || !String(el.value).trim();
    setErrorFor(el, empty);
    if (empty) ok = false;
  });

  // Conditional "Other workflow or DOA"
  if (workflowEl.value === 'Other (specify)') {
    const emptyOther = !otherEl.value || !otherEl.value.trim();
    setErrorFor(otherEl, emptyOther);
    if (emptyOther) ok = false;
  } else {
    setErrorFor(otherEl, false);
  }

  return ok;
}

// --- Submit ---------------------------------------------------------------
document.getElementById('submitBtn').addEventListener('click', (e) => {
  e.preventDefault();
  if (validate()) {
    alert('All validations passed. (Demo only)');
  } else {
    const firstErr = document.querySelector('.sn-field.error .sn-input, .sn-field.error .sn-select, .sn-field.error .sn-textarea');
    if (firstErr) firstErr.focus();
  }
});