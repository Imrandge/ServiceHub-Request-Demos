// ADERP Advisory Enquiry — Demo

// ---- Replace these with your real links ----
const URLS = {
  issue:      "https://example.com/incident",          // issue/incident form
  enhancement:"https://example.com/enhancement",       // modification/enhancement item
  reporting:  "https://example.com/reporting",         // reports/data analytics item
  workflow:   "https://example.com/approval-workflow", // modify workflow/DoA item
  knowledge:  "https://example.com/knowledge?q="       // base search for knowledge by topic
};

// Deduplicated Topic mapping from your list
const TOPICS_BY_OFFERING = {
  "Human Resources (ADERP - Fusion)": [
    "Absence Management",
    "Benefits",
    "Compensation",
    "Duty Travel",
    "Employee Data Administration",
    "HCM 101 - Fundamentals and Navigation",
    "Learning",
    "Manage Communications",
    "Onboarding",
    "Organization Relationships",
    "Payroll",
    "Separation",
    "Talent Acquisition",
    "Talent Management",
    "Time & Labor (OTL)"
  ],
  "Finance (ADERP - Fusion)": [
    "Cash Management",
    "Collections",
    "Fixed Assets",
    "Finance 101- Fundamentals and Navigation",
    "Order to Cash (Accounts Receivable)",
    "Procure to Pay (Accounts Payable)",
    "Project to Close",
    "Record to Report",
    "Revenue Management"
  ],
  "Procurement (ADERP - Fusion)": [
    "Manage Inventory Operations​",
    "MDM​ Master Data Management",
    "Procurement 101 - Fundamentals and Navigation",
    "Purchasing",
    "Requisition & Order Management",
    "Sourcing Preparation and Execution​",
    "Supplier Performance and Relationship Management​",
    "Manage Procurement Contracts​"
  ],
  "Enterprise Performance Management (ADERP - Fusion)": [
    "ADEXE",
    "ADPCS",
    "Budget",
    "Manpower"
  ]
};

// ---------- helpers ----------
const qs = (s, el = document) => el.querySelector(s);
const show = el => el && el.classList.remove("hidden");
const hide = el => el && el.classList.add("hidden");

function setError(wrap, hasError, msgEl){
  if(!wrap) return;
  wrap.classList.toggle("error", !!hasError);
  if (msgEl) msgEl.style.display = hasError ? "block" : "none";
}
function validateRequiredField(input){
  const wrap = input.closest(".sn-field");
  const val = input.type === "checkbox" ? input.checked : !!input.value?.trim();
  setError(wrap, !val, qs(".sn-error", wrap));
  return val;
}
function slugify(s){ return encodeURIComponent((s||"").toLowerCase().trim()); }

// ---------- main ----------
document.addEventListener("DOMContentLoaded", () => {
  // wire external links
  qs("#issue_link").href       = URLS.issue;
  qs("#enhancement_link").href = URLS.enhancement;
  qs("#reporting_link").href   = URLS.reporting;
  qs("#workflow_link").href    = URLS.workflow;

  const offeringSel   = qs("#offering");
  const topicSel      = qs("#topic");
  const knowledgeBlk  = qs("#knowledgeBlock");
  const knowledgeLink = qs("#knowledge_link");
  const confirmChk    = qs("#confirm_reviewed");
  const confirmErr    = qs("#confirm_reviewed_error");
  const titleWrap     = qs("#titleWrap");
  const descWrap      = qs("#descWrap");
  const submitBtn     = qs("#submitBtn");
  const printBtn      = qs("#printBtn");
  const out           = qs("#submission_output");

  // populate topics when offering changes
  function populateTopics(offering){
    topicSel.innerHTML = "";
    const ph = document.createElement("option");
    ph.value = ""; ph.textContent = offering ? "-- Select Topic --" : "-- Select Offering first --";
    ph.disabled = true; ph.selected = true;
    topicSel.appendChild(ph);

    (TOPICS_BY_OFFERING[offering] || []).forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      topicSel.appendChild(opt);
    });
  }
  offeringSel.addEventListener("change", () => {
    populateTopics(offeringSel.value);
    // reset downstream until a topic is chosen
    hide(knowledgeBlk); hide(titleWrap); hide(descWrap);
    confirmChk.checked = false;
  });
  populateTopics(""); // initial

  // after topic chosen → show knowledge + confirmation + title/description
  function handleTopicChange(){
    if (!topicSel.value) {
      hide(knowledgeBlk); hide(titleWrap); hide(descWrap);
      return;
    }
    const link = URLS.knowledge + slugify(topicSel.value);
    knowledgeLink.href = link;
    show(knowledgeBlk); show(titleWrap); show(descWrap);
  }
  topicSel.addEventListener("change", handleTopicChange);

  // print
  printBtn?.addEventListener("click", () => window.print());

  // submit (mock)
  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    // validate requireds
    const requiredIds = ["requested_by","requested_for","contact","offering","topic","request_title","request_description"];
    let valid = true;
    requiredIds.forEach(id => { const el = qs("#" + id); if (el) valid = validateRequiredField(el) && valid; });

    // confirm knowledge review
    const confirmWrap = confirmChk.closest(".sn-field");
    const okConfirm = confirmChk.checked;
    setError(confirmWrap, !okConfirm, confirmErr);
    valid = valid && okConfirm;

    if(!valid){
      const firstErr = document.querySelector(".sn-field.error .sn-input, .sn-field.error .sn-select, .sn-field.error .sn-textarea, .sn-field.error input[type='checkbox']");
      firstErr?.focus();
      return;
    }

    // build mock payload
    const payload = {
      requested_by: qs("#requested_by").value.trim(),
      requested_for: qs("#requested_for").value.trim(),
      contact: qs("#contact").value.trim(),
      entity: qs("#entity").value.trim(),
      location: qs("#location").value.trim(),
      offering: offeringSel.value,
      topic: topicSel.value,
      knowledge_url: knowledgeLink.href,
      confirm_reviewed: confirmChk.checked,
      request_title: qs("#request_title").value.trim(),
      request_description: qs("#request_description").value.trim(),
      submitted_at: new Date().toISOString()
    };

    // render payload
    out.classList.remove("hidden");
    out.innerHTML = "<strong>Mock submission payload</strong>";
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(payload, null, 2);
    out.appendChild(pre);
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});