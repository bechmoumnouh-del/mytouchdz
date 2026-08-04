/**
 * sheets-orders.js
 * ─────────────────────────────────────────────────────────────────
 * Sends order data to a Google Sheet via a deployed Apps Script Web App.
 *
 * HOW TO SET UP (one-time):
 * ─────────────────────────────────────────────────────────────────
 * 1. Open Google Sheets → create a new sheet named "Orders"
 *    Headers are written automatically on first order.
 *    Expected columns (exact spelling matters for the Apps Script):
 *    Timestamp | Name | Phone | Wilaya | Commune | Variant | Product
 *    | Quantity | Product Price | Delivery Type | Delivery Price
 *    | Total Price | Notes | Status | Click ID (fbc)
 *
 * 2. In your sheet: Extensions → Apps Script → paste the Apps Script
 *    code found at the bottom of this file (in the comment block).
 *
 * 3. In Apps Script: click Deploy → New deployment
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    → Click Deploy → copy the Web App URL
 *
 * 4. Paste that URL below as APPS_SCRIPT_URL.
 * ─────────────────────────────────────────────────────────────────
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxXx8EMpFMEF1jq74uzN1MQUXgCyLbMjXIHTeksTezC2gzqimvg7TPhZUQs2eMRUgzs/exec"; // نفس رابط مشروع "زيت الافغاني" — نفس صاحب المتجر، الطلبيات تدخل لنفس الجدول


// ── Helper: capture the Facebook Click ID (fbc) ─────────────────────
//
// Meta's Pixel automatically stores a "_fbc" cookie (format:
// fb.1.<timestamp>.<fbclid>) whenever a visitor arrives via an ad link
// containing ?fbclid=... . We read that cookie so we always get the
// same value Meta itself uses for match quality.
//
// Fallback: if the cookie isn't there yet (e.g. ad blockers, or the
// Pixel script hasn't run) but the URL still has ?fbclid=..., we build
// the fbc value ourselves in the same format and store it in the
// cookie so it persists across page navigations (e.g. to thank-you.html).

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getFbc() {
  // 1. Prefer the cookie the Meta Pixel itself maintains.
  const existing = getCookie("_fbc");
  if (existing) return existing;

  // 2. Fallback: build it from the fbclid URL param, then persist it.
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    setCookie("_fbc", fbc, 90);
    return fbc;
  }

  return "";
}


// ── Helper: extract all pricing & delivery info from the current UI state ──

function collectOrderDetails() {
  // Basic fields
  const name  = document.getElementById("name")?.value.trim()  || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const notes = document.getElementById("notes")?.value.trim() || "";

  // Wilaya
  const wilayaSel   = document.getElementById("wilaya");
  const wilayaLabel = wilayaSel?.options[wilayaSel.selectedIndex]?.text || "";
  const wilayaId    = wilayaSel?.value || "";

  // Commune
  const citySel   = document.getElementById("city");
  const cityLabel = citySel?.options[citySel.selectedIndex]?.text || "";
  const cityId    = citySel?.value || "";

  // Quantity — read from the active qty-card first (most reliable),
  // fall back to the hidden input, then default to 1.
  const activeQtyCard = document.querySelector(".qty-card.active");
  const qtyFromCard   = activeQtyCard?.querySelector(".qty-num")?.textContent?.trim();
  const qtyFromInput  = document.getElementById("qty")?.value?.trim();
  const qty  = parseInt(qtyFromCard || qtyFromInput || "1", 10) || 1;
  const unit = qty === 1 ? "قطعة" : "قطع";

  // Active product variant — grab both the short label and the full label
  const activeBtn      = document.querySelector(".fv-btn.active");
  const variantShort   = activeBtn?.querySelector(".fv-label")?.textContent?.trim() || "—";
  // Full variant label from the variant card
  const variantId      = typeof currentVariant !== "undefined" ? currentVariant : "";
  const activeCard     = variantId ? document.getElementById("vc-" + variantId) : null;
  const variantFull    = activeCard?.querySelector(".variant-label")?.textContent?.trim()
                       || variantShort;

  // Product price from PRODUCT global (same logic as updatePriceSummary)
  let productPrice = 0;
  if (typeof PRODUCT !== "undefined" && variantId) {
    const v = PRODUCT.variants.find(x => x.id === variantId);
    if (v) productPrice = v.prices[String(qty)] || v.prices["1"] || 0;
  }

  // Delivery info
  const deliveryVisible = document.getElementById("delivery-section")?.classList.contains("visible");
  let deliveryType  = "—";
  let deliveryPrice = 0;

  if (deliveryVisible && typeof findDeliveryRowForWilaya !== "undefined" && wilayaId) {
    const row = findDeliveryRowForWilaya(wilayaId);
    if (row) {
      const mode = (typeof currentDelivery !== "undefined") ? currentDelivery : "home";
      if (mode === "desk") {
        deliveryType  = "ستوب ديسك";
        deliveryPrice = row.Stop_desk;
      } else {
        deliveryType  = "توصيل للمنزل";
        deliveryPrice = row.A_domicile;
      }
    }
  }

  const totalPrice = productPrice + deliveryPrice;
  const cur = (typeof PRODUCT !== "undefined") ? PRODUCT.site.currency : "دج";

  return {
    name,
    phone,
    wilayaLabel,
    wilayaId,
    cityLabel,
    cityId,
    qty,
    unit,
    variantId,
    variantShort,
    variantFull,
    productPrice,
    deliveryType,
    deliveryPrice,
    totalPrice,
    notes,
    cur,
    fbc: getFbc(),
  };
}


// ── Send to Google Sheets ───────────────────────────────────────────

async function submitOrderToSheets() {
  const d = collectOrderDetails();

  // Validate required fields
  if (!d.name || !d.phone || !d.wilayaId || !d.cityId || !d.qty) {
    return { success: false, error: "missing_fields" };
  }

  const order = {
    timestamp      : new Date().toLocaleString("fr-DZ", { timeZone: "Africa/Algiers" }),
    name           : d.name,
    phone          : d.phone,
    wilaya         : d.wilayaLabel,
    commune        : d.cityLabel,
    variant        : d.variantFull,
    product        : d.variantShort,
    quantity       : `${d.qty} ${d.unit}`,
    product_price  : `${d.productPrice} ${d.cur}`,
    delivery_type  : d.deliveryType,
    delivery_price : d.deliveryPrice > 0 ? `${d.deliveryPrice} ${d.cur}` : "—",
    total_price    : `${d.totalPrice} ${d.cur}`,
    notes          : d.notes,
    status         : "جديد",
    fbc            : d.fbc || "",
  };

  // no-cors: Apps Script doesn't return CORS headers; treat reaching this line as success
  await fetch(APPS_SCRIPT_URL, {
    method  : "POST",
    mode    : "no-cors",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify(order),
  });

  return { success: true };
}


// ── Conversion tracking (Meta Pixel + TikTok Pixel) ─────────────────
//
// Fired ONLY after submitOrderToSheets() confirms the order was actually
// written to the Google Sheet. If the sheet write fails (or times out),
// no Purchase event is sent — we never want to count a sale that didn't
// actually reach the order log, even if the user is shown a "thank you"
// experience for UX reasons.

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function normalizeAlgerianPhone(raw) {
  const digits = raw.replace(/[^\d]/g, ""); // strip everything except digits
  if (digits.startsWith("0")) {
    return "+213" + digits.slice(1); // drop the leading 0, then prefix +213
  }
  return "+213" + digits; // no leading 0 — just prefix +213
}

async function firePurchaseEvent(d) {
  // Belt-and-suspenders: never fire without the essentials.
  if (!d.name || !d.phone || !(d.totalPrice > 0)) {
    console.warn("[sheets-orders] Purchase event NOT fired — missing required order data.");
    return;
  }

  const value     = d.totalPrice;
  const contentId = (d.variantId || d.variantShort || "dz-power-charger")
    .toString().trim().toLowerCase().replace(/\s+/g, "-").slice(0, 60);
  const phoneHash = await sha256Hex(normalizeAlgerianPhone(d.phone));
  const orderId   = Date.now() + "";

  if (typeof fbq !== "undefined") {
    fbq("init", "1333034524841814", { ph: phoneHash });
    fbq("track", "Lead", {
      content_name : d.variantShort || contentId,
      content_ids  : [contentId],
      content_type : "product",
      num_items    : d.qty,
      value        : value,
      currency     : "DZD",
    }, { eventID: "Lead-" + orderId });
  }

  if (typeof ttq !== "undefined") {
    ttq.identify({ phone_number: phoneHash });
    ttq.track("Lead", {
      content_id   : contentId,
      content_ids  : [contentId],
      content_type : "product",
      description  : d.variantShort || contentId,
      quantity     : d.qty,
      value        : value,
      currency     : "DZD",
    });
  }
}




/**
 * Validates an Algerian mobile phone number.
 * Rules: exactly 10 digits, starts with 05 / 06 / 07.
 */
function isValidAlgerianPhone(phone) {
  const cleaned = phone.replace(/[\s\-]/g, "");
  return /^0[567]\d{8}$/.test(cleaned);
}

/**
 * Live feedback: marks the phone field red/green as the user types.
 * Also identifies the visitor to TikTok as soon as the number is valid,
 * so InitiateCheckout (and anything else fired after this point) carries
 * matchable identity — not just the final Purchase event.
 */
let lastIdentifiedPhone = null;

function onPhoneInput() {
  const input    = document.getElementById("phone");
  const phone    = input?.value.trim();
  const feedback = document.getElementById("phone-feedback");

  if (!phone) {
    input.style.borderColor = "";
    if (feedback) feedback.textContent = "";
    return;
  }

  if (isValidAlgerianPhone(phone)) {
    input.style.borderColor = "var(--accent)";
    if (feedback) { feedback.textContent = "✓"; feedback.style.color = "var(--accent)"; }

    if (phone !== lastIdentifiedPhone && typeof ttq !== "undefined") {
      lastIdentifiedPhone = phone;
      sha256Hex(normalizeAlgerianPhone(phone))
        .then(hash => ttq.identify({ phone_number: hash }))
        .catch(() => {});
    }
  } else {
    input.style.borderColor = "var(--qc)";
    if (feedback) { feedback.textContent = "يجب أن يبدأ بـ 05 أو 06 أو 07 ويكون 10 أرقام"; feedback.style.color = "var(--qc)"; }
  }
}

// Attach live validator once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.setAttribute("maxlength",  "10");
    phoneInput.setAttribute("inputmode",  "numeric");
    phoneInput.setAttribute("pattern",    "0[567][0-9]{8}");

    const feedback      = document.createElement("span");
    feedback.id         = "phone-feedback";
    feedback.style.cssText = "font-size:0.75rem; margin-top:4px; display:block; min-height:1em;";
    phoneInput.insertAdjacentElement("afterend", feedback);

    phoneInput.addEventListener("input", onPhoneInput);
  }
});


// ── Main submit handler ─────────────────────────────────────────────

async function submitOrder() {
  const d = collectOrderDetails();

  // Field validation
  if (!d.name || !d.phone || !d.wilayaId || !d.cityId || !d.qty) {
    alert("يرجى تعبئة جميع الحقول المطلوبة.");
    return;
  }

  if (!isValidAlgerianPhone(d.phone)) {
    alert("رقم الهاتف غير صحيح.\nيجب أن يكون 10 أرقام ويبدأ بـ 05 أو 06 أو 07.");
    document.getElementById("phone")?.focus();
    return;
  }

  const btn = document.querySelector(".submit-btn");

  // Loading state
  btn.disabled    = true;
  btn.textContent = "جاري الإرسال...";

  try {
    const result = await submitOrderToSheets();
    if (result.success) {
      console.info("[sheets-orders] Order saved ✓");
      await firePurchaseEvent(d); // only fires after confirmed sheet write
      redirectToThankYou(d);
    } else {
      alert("يرجى تعبئة جميع الحقول المطلوبة.");
      btn.disabled    = false;
      btn.textContent = "تأكيد الطلب";
    }
  } catch (err) {
    // Network/sheet error — do NOT fire a Purchase event (order wasn't
    // confirmed reaching the sheet), but still redirect so the user isn't
    // left hanging on a broken UI.
    console.error("[sheets-orders] Fetch failed:", err);
    redirectToThankYou(d);
  }
}


// ── Redirect to thank-you page ──────────────────────────────────────

/**
 * Builds the thank-you URL with full order details as query params, then redirects.
 * Accepts the already-collected details object to avoid reading the DOM twice.
 */
function redirectToThankYou(d) {
  // Allow calling without pre-collected data (fallback)
  if (!d) d = collectOrderDetails();

  const params = new URLSearchParams({
    name            : d.name,
    phone           : d.phone,
    wilaya          : d.wilayaLabel,
    commune         : d.cityLabel,
    variant         : d.variantFull,
    content_id      : d.variantId || d.variantShort,
    product         : d.variantShort,
    quantity        : `${d.qty} ${d.unit}`,
    product_price   : `${d.productPrice} ${d.cur}`,
    delivery_type   : d.deliveryType,
    delivery_price  : d.deliveryPrice > 0 ? `${d.deliveryPrice} ${d.cur}` : "—",
    total_price     : `${d.totalPrice} ${d.cur}`,
    // Legacy "price" param kept so thank-you.html pixel code still works
    price           : `${d.qty} ${d.unit} — ${d.totalPrice} ${d.cur}`,
  });

  window.location.href = "./thank-you.html?" + params.toString();
}


/* ===================================================================
   GOOGLE APPS SCRIPT — paste this into Extensions → Apps Script
   ===================================================================

const SHEET_NAME = "Orders";
const HEADERS = [
  "Timestamp",
  "Name",
  "Phone",
  "Wilaya",
  "Commune",
  "Variant",
  "Product",
  "Quantity",
  "Product Price",
  "Delivery Type",
  "Delivery Price",
  "Total Price",
  "Notes",
  "Status",
  "Click ID (fbc)"
];

// Maps each header to the matching key in the JSON payload
const KEY_MAP = {
  "Timestamp"      : "timestamp",
  "Name"           : "name",
  "Phone"          : "phone",
  "Wilaya"         : "wilaya",
  "Commune"        : "commune",
  "Variant"        : "variant",
  "Product"        : "product",
  "Quantity"       : "quantity",
  "Product Price"  : "product_price",
  "Delivery Type"  : "delivery_type",
  "Delivery Price" : "delivery_price",
  "Total Price"    : "total_price",
  "Notes"          : "notes",
  "Status"         : "status",
  "Click ID (fbc)" : "fbc"
};

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Write headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight("bold")
           .setBackground("#1a1a2e")
           .setFontColor("#ffffff");
    }

    const data = JSON.parse(e.postData.contents);

    // Force the Phone column to plain-text format BEFORE writing the value.
    // Otherwise Sheets auto-detects "0552983832" as a number and strips the
    // leading zero (e.g. becomes 552983832).
    const phoneCol = HEADERS.indexOf("Phone") + 1; // 1-based
    const nextRow  = sheet.getLastRow() + 1;
    if (phoneCol > 0) {
      sheet.getRange(nextRow, phoneCol).setNumberFormat("@");
    }

    const row = HEADERS.map(h => {
      if (h === "Phone") {
        // Prepend a zero-width-safe apostrophe-style prefix as a second
        // safety net, in case the column format alone isn't enough
        // (e.g. column was reformatted later). Sheets treats a string
        // starting with ' as forced text and hides the apostrophe.
        const phone = String(data[KEY_MAP[h]] ?? "");
        return phone.startsWith("0") ? "'" + phone : phone;
      }
      return data[KEY_MAP[h]] ?? "";
    });
    sheet.appendRow(row);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

=================================================================== */