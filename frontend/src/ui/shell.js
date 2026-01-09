import { store } from "../state/store.js";
import { navigate } from "../router/router.js";

export function shellHtml() {
  return `
    <div class="app">
      <aside class="sidebar">
        <div class="brand">
          <div class="logo">AD</div>
          <div>
            <h1>AD SIM</h1>
            <div class="sub">Athletic Director Command Center</div>
          </div>
        </div>

        <div class="panel">
          <div class="small" style="margin-bottom:6px">School</div>
          <select id="schoolSelect"></select>
        </div>

        <div class="panel">
          <div class="tabs">
            <div class="tab" id="tabAd">AD</div>
            <div class="tab" id="tabSports">Sports</div>
          </div>
        </div>

        <div class="panel">
          <div class="small" style="margin-bottom:8px">Navigation</div>
          <div class="nav" id="sidebarNav"></div>
        </div>

        <div class="spacer"></div>

        <div class="panel">
          <div class="small">Status</div>
          <div class="muted" id="statusLine"></div>
        </div>
      </aside>

      <main class="main">
        <div class="topbar">
          <h2 id="pageTitle">Loading…</h2>
          <div class="spacer"></div>
          <button class="btn secondary" id="btnExport">Export</button>
          <button class="btn" id="btnImport">Import</button>
        </div>

        <div class="content" id="content"></div>
      </main>
    </div>
  `;
}

export function bindShellEvents({ onSchoolChange, onTabChange, onNavClick, onExport, onImport }) {
  // School select
  const sel = document.getElementById("schoolSelect");
  sel.innerHTML = store.schools
    .map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.conference)})</option>`)
    .join("");
  sel.value = store.currentSchool;

  sel.addEventListener("change", () => {
    onSchoolChange(sel.value);
  });

  // Tabs
  document.getElementById("tabAd").addEventListener("click", () => onTabChange("ad"));
  document.getElementById("tabSports").addEventListener("click", () => onTabChange("sports"));

  // Topbar
  document.getElementById("btnExport").addEventListener("click", onExport);
  document.getElementById("btnImport").addEventListener("click", onImport);

  // Nav is rendered dynamically; delegate click
  document.getElementById("sidebarNav").addEventListener("click", (e) => {
    const item = e.target.closest("[data-hash]");
    if (!item) return;
    onNavClick(item.getAttribute("data-hash"));
  });
}

export function renderNav(items, activeHash) {
  const nav = document.getElementById("sidebarNav");
  nav.innerHTML = items.map(i => {
    const active = i.hash === activeHash ? "active" : "";
    return `<div class="nav-item ${active}" data-hash="${i.hash}">${escapeHtml(i.label)}</div>`;
  }).join("");
}

export function setActiveTab(tab) {
  document.getElementById("tabAd").classList.toggle("active", tab === "ad");
  document.getElementById("tabSports").classList.toggle("active", tab === "sports");
}

export function setTitle(title) {
  document.getElementById("pageTitle").textContent = title;
}

export function setStatusLine() {
  document.getElementById("statusLine").textContent = store.statusLine;
}

export function setContentHtml(html) {
  document.getElementById("content").innerHTML = html;
}

export function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll("\"","&quot;")
    .replaceAll("'","&#039;");
}

export function normalizeSportKey(name) {
  return String(name)
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function gotoSport(sportName) {
  navigate(`#/sports/${normalizeSportKey(sportName)}`);
}
