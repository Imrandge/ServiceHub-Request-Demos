// Request a Modification or Enhancement (ADERP) – Demo logic (General Enquiry look, updated mapping)

// ---- Replace with real URLs (optional) ----
const INCIDENT_FORM_URL      = "https://example.com/incident";      // issue form
const REPORTING_REQUEST_URL  = "https://example.com/reporting";     // reporting catalog item
const GENERAL_ENQUIRY_URL    = "https://example.com/general-enquiry";
const WORKFLOW_DOA_URL       = "https://example.com/workflow-doa";
const ACCESS_REQUEST_URL     = "https://example.com/access";

// ---- Offering → Module mapping (exactly as provided; deduplicated) ----
const MODULES_BY_OFFERING = {
  "Finance (ADERP - Fusion)": [
    "Cash Management",
    "Project to Close",
    "Fixed Assets",
    "Record to Report",
    "Procure to Pay (Accounts Payable)",
    "Order to Cash (Accounts Receivable)",
    "Payroll"
  ],
  "Human Resources (ADERP - Fusion)": [
    "Talent Management",
    "Talent Acquisition",
    "Learning",
    "Payroll",
    "Compensation",
    "Benefits",
    "Absence Management",
    "Employee Data Administration",
    "Organization Relationships",
    "Onboarding",
    "Separation",
    "Duty Travel",
    "Manage Communications",
    "Time & Labor"
  ],
  "Procurement (ADERP - Fusion)": [
    "Requisition & Order Management",
    "Manage Inventory Operations​",
    "Supplier Performance and Relationship Management​",
    "Manage Procurement Contracts​",
    "Sourcing Preparation and Execution​",
    "MDM​ Master Data Management",
    "Purchasing"
  ]
};

// ---------- utilities ----------
const qs  = (s, el=document) => el.querySelector(s);
const show = el => el && el.classList.remove("hidden");
const hide = el => el && el.classList.add("hidden");

function setError(fieldWrap, hasError, msgEl){
  if(!fieldWrap) return;
  fieldWrap.classList.toggle("error", !!hasError);
  if (msgEl) msgEl.style.display = hasError ? "block" : "none";
}
function validateRequiredField(inputEl){
  const wrap = inputEl.closest(".sn-field");
  const isFile = inputEl.type === "file";
  const ok = isFile ? (inputEl.files && inputEl.files.length > 0)
                    : !!inputEl.value?.trim();
  setError(wrap, !ok, qs(".sn-error", wrap));
  return !!ok;
}
function isReportingSelection(selectEl){
  const val = (selectEl.value || "").toLowerCase();
  if (val === "reporting") return true;
  const txt = selectEl.options[selectEl.selectedIndex]?.text?.toLowerCase() || "";
  return txt.startsWith("create / modify report");
}
function populateModules(offeringVal){
  const moduleSel = qs("#module");
  moduleSel.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = offeringVal ? "-- Select Module --" : "-- Select Offering first --";
  placeholder.disabled = true; placeholder.selected = true;
  moduleSel.appendChild(placeholder);

  const list = MODULES_BY_OFFERING[offeringVal] || [];
  list.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m; opt.textContent = m;
    moduleSel.appendChild(opt);
  });
}

// ---------- main ----------
document.addEventListener("DOMContentLoaded", () => {
  // External links for description/redirects (if used)
  const issueLink       = qs("#issue_link");
  const enhancementLink = qs("#enhancement_link");
  const reportingLink   = qs("#reporting_link");
  const workflowLink    = qs("#workflow_link");
  const accessLink      = qs("#access_link");
  const reportingRedirect = qs("#reporting_redirect_link");

  if (issueLink)            issueLink.href            = INCIDENT_FORM_URL;
  if (enhancementLink)      enhancementLink.href      = GENERAL_ENQUIRY_URL;
  if (reportingLink)        reportingLink.href        = REPORTING_REQUEST_URL;
  if (workflowLink)         workflowLink.href         = WORKFLOW_DOA_URL;
  if (accessLink)           accessLink.href           = ACCESS_REQUEST_URL;
  if (reportingRedirect)    reportingRedirect.href    = REPORTING_REQUEST_URL;

  // Elements
  const offeringSel   = qs("#offering");
  const requestType   = qs("#request_type");
  const reportingNote = qs("#reportingRedirect");
  const mainFields    = qs("#mainFields");
  const submitBtn     = qs("#submitBtn");
  const printBtn      = qs("#printBtn");
  const out           = qs("#submission_output");

  // Populate modules when Offering changes
  offeringSel.addEventListener("change", () => populateModules(offeringSel.value));
  populateModules(""); // initial placeholder

  // Show/hide the downstream section based on Request type
  function updateVisibility(){
    if (isReportingSelection(requestType)) {
      show(reportingNote);
      hide(mainFields);
    } else {
      hide(reportingNote);
      show(mainFields);
    }
  }
  requestType.addEventListener("change", updateVisibility);
  requestType.addEventListener("input", updateVisibility);
  updateVisibility();

  // Print
  printBtn?.addEventListener("click", () => window.print());

  // Submit (mock)
  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    // Always required
    const alwaysReq = ["requested_by","requested_for","contact","offering","request_type"];

    // Required only when NOT reporting
    const notReportingReq = ["module","business_justification","component","attachments","request_title","request_description"];

    let valid = true;

    alwaysReq.forEach(id => {
      const el = qs("#" + id);
      if (el) valid = validateRequiredField(el) && valid;
    });

    if (!isReportingSelection(requestType)) {
      notReportingReq.forEach(id => {
        const el = qs("#" + id);
        if (el) valid = validateRequiredField(el) && valid;
      });
    }

    if (!valid) {
      const firstErr = document.querySelector(".sn-field.error .sn-input, .sn-field.error .sn-select, .sn-field.error .sn-textarea, .sn-field.error .sn-file");
      firstErr?.focus();
      return;
    }

    // Build mock payload
    const payload = {
      requested_by: qs("#requested_by").value.trim(),
      requested_for: qs("#requested_for").value.trim(),
      contact: qs("#contact").value.trim(),
      entity: qs("#entity").value.trim(),
      location: qs("#location").value.trim(),
      offering: offeringSel.value,
      request_type: requestType.value,

      // Only relevant when not reporting
      module: isReportingSelection(requestType) ? null : qs("#module").value,
      business_justification: isReportingSelection(requestType) ? null : qs("#business_justification").value.trim(),
      component: isReportingSelection(requestType) ? null : qs("#component").value.trim(),
      attachments: isReportingSelection(requestType)
        ? null
        : ([...qs("#attachments").files].map(f => f.name)),

      request_title: isReportingSelection(requestType) ? null : qs("#request_title").value.trim(),
      request_description: isReportingSelection(requestType) ? null : qs("#request_description").value.trim(),
      submitted_at: new Date().toISOString()
    };

    // Output
    out.classList.remove("hidden");
    out.innerHTML = "<strong>Mock submission payload</strong>";
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(payload, null, 2);
    out.appendChild(pre);
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});