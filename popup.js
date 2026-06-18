let allCookieRows = [];
let currentDomain = "";
let currentFilter = "all";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  document.getElementById("download-csv").addEventListener("click", handleDownloadCsv);
  document.getElementById("delete-high-risk").addEventListener("click", handleDeleteHighRisk);
  document.getElementById("cookie-list").addEventListener("click", handleListClick);
  document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", handleFilterClick));
  document.getElementById("search").addEventListener("input", handleSearchInput);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      showStatus("No active tab found.", true);
      return;
    }

    let url;
    try {
      url = new URL(tab.url);
    } catch {
      showStatus("Couldn't read this page's URL.", true);
      return;
    }

    if (!/^https?:$/.test(url.protocol)) {
      showStatus(`Cookies can't be inspected on ${url.protocol} pages.`, true);
      return;
    }

    currentDomain = url.hostname;
    document.getElementById("site-name").textContent = currentDomain;

    const cookies = await chrome.cookies.getAll({ url: tab.url });
    allCookieRows = cookies.map(buildCookieRow).sort((a, b) => b.riskScore - a.riskScore);

    if (allCookieRows.length === 0) {
      showStatus(`No cookies found for ${currentDomain}.`);
    } else {
      hideStatus();
      reveal();
    }
    renderScore();
    applyFiltersAndRender();
  } catch (err) {
    showStatus("Something went wrong while scanning cookies.", true);
    console.error(err);
  }
}

function reveal() {
  document.getElementById("score-section").hidden = false;
  document.getElementById("controls").hidden = false;
  document.getElementById("actions").hidden = false;
}

function showStatus(message, isError = false) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.hidden = false;
  status.className = "status" + (isError ? " status-error" : "");
}

function hideStatus() {
  document.getElementById("status").hidden = true;
}

// ---------- Risk assessment ----------

function buildCookieRow(cookie) {
  const info = lookupCookieInfo(cookie.name);
  const { score, level, reasons } = assessRisk(cookie, info);
  return { cookie, info, riskScore: score, riskLevel: level, reasons };
}

function daysUntilExpiry(cookie) {
  if (cookie.session || !cookie.expirationDate) return null;
  return (cookie.expirationDate * 1000 - Date.now()) / 86400000;
}

function formatExpiry(cookie) {
  if (cookie.session) return "Session (cleared when browser closes)";
  const days = daysUntilExpiry(cookie);
  const date = new Date(cookie.expirationDate * 1000);
  const dateStr = date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  if (days === null) return dateStr;
  if (days > 365) return `Expires ${dateStr} (~${Math.round(days / 365)} year${Math.round(days / 365) === 1 ? "" : "s"})`;
  if (days >= 1) return `Expires ${dateStr} (~${Math.round(days)} days)`;
  return `Expires ${dateStr} (<1 day)`;
}

function formatSameSite(value) {
  switch (value) {
    case "no_restriction": return "None";
    case "lax": return "Lax";
    case "strict": return "Strict";
    default: return "Not set";
  }
}

const CATEGORY_RISK = { Advertising: 25, Analytics: 15, Social: 15, Functional: 5, Necessary: 0, Unknown: 8 };

function assessRisk(cookie, info) {
  let score = 0;
  const reasons = [];

  if (!cookie.secure) {
    score += 25;
    reasons.push({ type: "warn", text: "Missing Secure flag — can be sent over unencrypted HTTP." });
  } else {
    reasons.push({ type: "ok", text: "Secure flag set — only sent over HTTPS." });
  }

  if (!cookie.httpOnly) {
    score += 10;
    reasons.push({ type: "warn", text: "Not HttpOnly — readable by page JavaScript (exposed if the site has an XSS bug)." });
  } else {
    reasons.push({ type: "ok", text: "HttpOnly — hidden from page JavaScript." });
  }

  if (cookie.sameSite === "no_restriction") {
    score += 20;
    reasons.push({ type: "warn", text: "SameSite=None — sent on cross-site requests." });
  } else if (cookie.sameSite === "unspecified") {
    score += 15;
    reasons.push({ type: "warn", text: "No SameSite policy set." });
  } else if (cookie.sameSite === "lax") {
    score += 5;
    reasons.push({ type: "info", text: "SameSite=Lax — limited cross-site protection." });
  } else if (cookie.sameSite === "strict") {
    reasons.push({ type: "ok", text: "SameSite=Strict — blocked on cross-site requests." });
  }

  if (cookie.session) {
    reasons.push({ type: "ok", text: "Session cookie — cleared when the browser closes." });
  } else {
    const days = daysUntilExpiry(cookie);
    if (days > 365) {
      score += 15;
      reasons.push({ type: "warn", text: `Long-lived — ${formatExpiry(cookie)}.` });
    } else if (days > 30) {
      score += 10;
      reasons.push({ type: "info", text: formatExpiry(cookie) + "." });
    } else if (days > 1) {
      score += 5;
      reasons.push({ type: "info", text: formatExpiry(cookie) + "." });
    } else {
      score += 2;
    }
  }

  if (cookie.hostOnly === false) {
    score += 5;
    reasons.push({ type: "info", text: `Shared across all subdomains of ${cookie.domain.replace(/^\./, "")}.` });
  }

  score += CATEGORY_RISK[info.category] ?? 8;
  if (info.category === "Advertising" || info.category === "Social") {
    reasons.push({ type: "warn", text: `Known ${info.category.toLowerCase()} cookie${info.provider ? ` (${info.provider})` : ""} — used to build a profile of your activity.` });
  } else if (info.category === "Analytics") {
    reasons.push({ type: "info", text: `Known analytics cookie${info.provider ? ` (${info.provider})` : ""}.` });
  }

  score = Math.max(0, Math.min(100, score));
  const level = score >= 60 ? "High" : score >= 30 ? "Medium" : "Low";
  return { score, level, reasons };
}

// ---------- Rendering ----------

function renderScore() {
  const total = allCookieRows.length;
  const high = allCookieRows.filter(r => r.riskLevel === "High").length;
  const medium = allCookieRows.filter(r => r.riskLevel === "Medium").length;
  const low = total - high - medium;
  const avgRisk = total ? allCookieRows.reduce((s, r) => s + r.riskScore, 0) / total : 0;
  const score = total ? Math.max(0, Math.round(100 - avgRisk)) : 100;

  document.getElementById("score-value").textContent = total ? score : "—";
  const circle = document.getElementById("score-circle");
  circle.className = "score-circle " + (score < 50 ? "score-bad" : score < 80 ? "score-mid" : "score-good");
  document.getElementById("score-summary").textContent = total
    ? `${total} cookie${total === 1 ? "" : "s"} found — ${high} high, ${medium} medium, ${low} low risk.`
    : "No cookies found for this site.";
}

function applyFiltersAndRender() {
  let rows = allCookieRows;
  if (currentFilter !== "all") rows = rows.filter(r => r.riskLevel === currentFilter);
  if (currentSearch) rows = rows.filter(r => r.cookie.name.toLowerCase().includes(currentSearch));
  renderList(rows);
}

function renderList(rows) {
  const list = document.getElementById("cookie-list");
  list.textContent = "";

  if (rows.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-message";
    empty.textContent = allCookieRows.length === 0 ? "No cookies on this site." : "No cookies match this filter.";
    list.appendChild(empty);
    return;
  }

  for (const row of rows) {
    list.appendChild(createCookieCard(row));
  }
}

function addKvRow(table, key, value) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.textContent = key;
  const td = document.createElement("td");
  td.textContent = value;
  tr.append(th, td);
  table.appendChild(tr);
}

function createCookieCard(row) {
  const { cookie, info, riskLevel, reasons } = row;
  const categoryMeta = cookieCategories[info.category] || cookieCategories.Unknown;

  const card = document.createElement("div");
  card.className = `cookie-card risk-${riskLevel.toLowerCase()}`;

  const header = document.createElement("button");
  header.type = "button";
  header.className = "card-header";
  header.setAttribute("aria-expanded", "false");

  const nameEl = document.createElement("span");
  nameEl.className = "cookie-name";
  nameEl.textContent = cookie.name;
  nameEl.title = cookie.name;

  const catBadge = document.createElement("span");
  catBadge.className = "badge category-badge";
  catBadge.style.backgroundColor = categoryMeta.color;
  catBadge.textContent = info.category;

  const riskBadge = document.createElement("span");
  riskBadge.className = `badge risk-badge risk-${riskLevel.toLowerCase()}`;
  riskBadge.textContent = riskLevel;

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.textContent = "▾";

  header.append(nameEl, catBadge, riskBadge, chevron);

  const summary = document.createElement("div");
  summary.className = "card-summary";
  summary.textContent = info.description + (info.provider ? ` Provider: ${info.provider}.` : "");

  const details = document.createElement("div");
  details.className = "card-details";
  details.hidden = true;

  const kv = document.createElement("table");
  kv.className = "kv-table";
  addKvRow(kv, "Stored at", cookie.domain + (cookie.hostOnly ? " (this host only)" : " (and subdomains)"));
  addKvRow(kv, "Path", cookie.path);
  addKvRow(kv, "Storage", cookie.session ? "Session — cleared on browser close" : formatExpiry(cookie));
  addKvRow(kv, "Secure", cookie.secure ? "Yes — HTTPS only" : "No — sent over HTTP too");
  addKvRow(kv, "HttpOnly", cookie.httpOnly ? "Yes — hidden from page scripts" : "No — readable by page scripts");
  addKvRow(kv, "SameSite", formatSameSite(cookie.sameSite));

  const reasonList = document.createElement("ul");
  reasonList.className = "reasons";
  reasons.forEach(r => {
    const li = document.createElement("li");
    li.className = `reason-${r.type}`;
    li.textContent = r.text;
    reasonList.appendChild(li);
  });

  const valueRow = document.createElement("div");
  valueRow.className = "value-row";
  const valueToggle = document.createElement("button");
  valueToggle.type = "button";
  valueToggle.className = "btn ghost value-toggle";
  valueToggle.textContent = "Show value";
  const valueText = document.createElement("code");
  valueText.className = "cookie-value";
  valueText.textContent = cookie.value;
  valueText.hidden = true;
  valueToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    valueText.hidden = !valueText.hidden;
    valueToggle.textContent = valueText.hidden ? "Show value" : "Hide value";
  });
  valueRow.append(valueToggle, valueText);

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn danger delete-btn";
  deleteBtn.textContent = "Delete cookie";
  actions.appendChild(deleteBtn);

  details.append(kv, reasonList, valueRow, actions);
  card.append(header, summary, details);

  // Stash a reference so the delegated click handler can find the cookie
  // without re-deriving it from (possibly ambiguous) data-* attributes.
  deleteBtn._cookieRef = cookie;
  header._detailsRef = details;

  return card;
}

// ---------- Event handlers (delegated, so dynamically-added cards work) ----------

function handleListClick(e) {
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn && deleteBtn._cookieRef) {
    deleteCookie(deleteBtn._cookieRef);
    return;
  }

  const header = e.target.closest(".card-header");
  if (header && header._detailsRef) {
    const details = header._detailsRef;
    const isHidden = details.hidden;
    details.hidden = !isHidden;
    header.setAttribute("aria-expanded", String(isHidden));
  }
}

function handleFilterClick(e) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  e.currentTarget.classList.add("active");
  currentFilter = e.currentTarget.dataset.filter;
  applyFiltersAndRender();
}

function handleSearchInput(e) {
  currentSearch = e.target.value.trim().toLowerCase();
  applyFiltersAndRender();
}

async function handleDeleteHighRisk() {
  const targets = allCookieRows.filter(r => r.riskLevel === "High").map(r => r.cookie);
  if (targets.length === 0) return;
  if (!confirm(`Delete ${targets.length} high-risk cookie(s)? This may log you out of some site features.`)) return;
  for (const cookie of targets) {
    await deleteCookie(cookie);
  }
}

function cookieUrl(cookie) {
  const domain = cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain;
  return `https://${domain}${cookie.path}`;
}

function deleteCookie(cookie) {
  return new Promise(resolve => {
    chrome.cookies.remove({ url: cookieUrl(cookie), name: cookie.name, storeId: cookie.storeId }, (details) => {
      if (details) {
        allCookieRows = allCookieRows.filter(r =>
          !(r.cookie.name === cookie.name && r.cookie.domain === cookie.domain && r.cookie.path === cookie.path)
        );
        renderScore();
        applyFiltersAndRender();
      } else {
        console.error("Failed to delete cookie", cookie.name, chrome.runtime.lastError);
      }
      resolve(details);
    });
  });
}

// ---------- CSV export ----------

function csvEscape(value) {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function handleDownloadCsv() {
  const header = ["Name", "Domain", "Path", "Category", "Provider", "Risk Level", "Risk Score", "Secure", "HttpOnly", "SameSite", "Storage", "Description"];
  const lines = [header.map(csvEscape).join(",")];

  for (const { cookie, info, riskLevel, riskScore } of allCookieRows) {
    const fields = [
      cookie.name, cookie.domain, cookie.path, info.category, info.provider || "",
      riskLevel, riskScore, cookie.secure, cookie.httpOnly, formatSameSite(cookie.sameSite),
      cookie.session ? "Session" : formatExpiry(cookie), info.description
    ];
    lines.push(fields.map(csvEscape).join(","));
  }

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cookie-report-${currentDomain || "site"}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
