// Reports, Data Management & Analytics (ADERP) – Demo logic

// If you have a real catalog of existing reports, put the URL here.
const REPORTS_CATALOG_URL = "https://example.com/reports-and-dashboards"; // TODO: replace

function qs(sel, el = document) { return el.querySelector(sel); }
function qsa(sel, el = document) { return [...el.querySelectorAll(sel)]; }

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function setError(fieldEl, hasError, msgEl) {
  fieldEl.classList.toggle("error", !!hasError);
  if (msgEl) msgEl.style.display = hasError ? "block" : "none";
}

function validateRequiredInput(fieldWrap, inputEl) {
  const isFile = inputEl.type === "file";
  const val = isFile ? (inputEl.files && inputEl.files.length > 0) : !!inputEl.value?.trim();
  const err = qs(".sn-error", fieldWrap);
  setError(fieldWrap, !val, err);
  return !!val;
}

document.addEventListener("DOMContentLoaded", () => {
  // Hook up links / buttons
  const form = qs(".sn-form");
  const printBtn = qs("#printBtn");
  const submitBtn = qs("#submitBtn");
  const out = qs("#submission_output");

  // Contextual guidance for "new" request
  const requestType = qs("#request_type");
  const guidanceBlock = qs("#newReportGuidance");
  const confirmReviewed = qs("#confirm_reviewed");
  const confirmReviewedError = qs("#confirm_reviewed_error");
  const reportsLink = qs("#reports_link");
  if (reportsLink) reportsLink.href = REPORTS_CATALOG_URL;

  function isNewSelection(selectEl) {
  const val = (selectEl.value || "").trim().toLowerCase();
  if (val === "new") return true;
  // Fallback: check visible text in case value attributes got changed/removed
  const txt = selectEl.options[selectEl.selectedIndex]?.text?.toLowerCase() || "";
  return txt.startsWith("request a new report");
}

  function handleRequestTypeChange() {
    if (isNewSelection(requestType)) {
      show(guidanceBlock);
      confirmReviewed.dataset.required = "true"; // mark as required
    } else {
      hide(guidanceBlock);
      confirmReviewed.checked = false;
      delete confirmReviewed.dataset.required;
      setError(guidanceBlock, false, confirmReviewedError);
    }
  }
  requestType.addEventListener("change", handleRequestTypeChange);
  handleRequestTypeChange(); // run once at load

  // ... inside your submit handler, replace the "new" check with:
  if (isNewSelection(requestType) && confirmReviewed.dataset.required === "true") {
    const ok = confirmReviewed.checked === true;
    setError(guidanceBlock, !ok, confirmReviewedError);
    valid = valid && ok;
  }


  requestType.addEventListener("change", handleRequestTypeChange);
  handleRequestTypeChange();

  // Print
  printBtn?.addEventListener("click", () => window.print());

  // Submit (mock)
  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    // Validate common required fields
    const requiredSelectors = [
      "#requested_by", "#requested_for", "#contact",
      "#offering", "#request_type",
      "#business_justification",
      "#reference_screenshot",
      "#request_title", "#request_description"
    ];

    let valid = true;

    requiredSelectors.forEach(sel => {
      const inputEl = qs(sel);
      const fieldWrap = inputEl?.closest(".sn-field");
      if (inputEl && fieldWrap) {
        const ok = validateRequiredInput(fieldWrap, inputEl);
        valid = valid && ok;
      }
    });

    // Additional rule: if "new", checkbox must be ticked
    if (requestType.value === "new" && confirmReviewed.dataset.required === "true") {
      const ok = confirmReviewed.checked === true;
      setError(guidanceBlock, !ok, confirmReviewedError);
      valid = valid && ok;
    }

    if (!valid) {
      // Focus first errored field
      const firstError = qs(".sn-field.error .sn-input, .sn-field.error .sn-select, .sn-field.error .sn-textarea, .sn-field.error .sn-file");
      firstError?.focus();
      return;
    }

    // Build mock payload
    const payload = {
      requested_by: qs("#requested_by").value.trim(),
      requested_for: qs("#requested_for").value.trim(),
      contact: qs("#contact").value.trim(),
      entity: qs("#entity").value.trim(),
      location: qs("#location").value.trim(),
      offering: qs("#offering").value,
      request_type: qs("#request_type").value,
      confirm_reviewed: requestType.value === "new" ? !!confirmReviewed.checked : null,
      business_justification: qs("#business_justification").value.trim(),
      request_title: qs("#request_title").value.trim(),
      request_description: qs("#request_description").value.trim(),
      reference_screenshot: (qs("#reference_screenshot").files[0]?.name || null),
      submitted_at: new Date().toISOString()
    };

    // Display payload
    out.classList.remove("hidden");
    out.innerHTML = "<strong>Mock submission payload</strong>";
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(payload, null, 2);
    out.appendChild(pre);

    // Scroll to it for visibility
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});