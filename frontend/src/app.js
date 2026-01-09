import { initStore, store, setStatus } from "./state/store.js";
import { getRoute, onRouteChange, navigate } from "./router/router.js";
import {
  shellHtml,
  bindShellEvents,
  renderNav,
  setActiveTab,
  setTitle,
  setStatusLine,
  setContentHtml,
  normalizeSportKey
} from "./ui/shell.js";

import { renderDashboard } from "./modules/athletics/dashboard.js";
import { renderBudgets, bindBudgetsEvents } from "./modules/athletics/budgets.js";
import { renderFacilities, bindFacilitiesEvents } from "./modules/athletics/facilities.js";
import { renderInfrastructure, bindInfrastructureEvents } from "./modules/athletics/infrastructure.js";


import { renderSportsHome } from "./modules/sports/sports_home.js";
import { sportsRegistry } from "./modules/sports/sports_registry.js";

function boot() {
  initStore();

  const app = document.getElementById("app");
  app.innerHTML = shellHtml();

  bindShellEvents({
    onSchoolChange: (schoolId) => {
      store.currentSchool = schoolId;
      setStatus(`Switched to ${schoolId}`);
      render();
    },
    onTabChange: (tab) => {
      store.activeTab = tab;
      if (tab === "ad") navigate("#/ad/dashboard");
      else navigate("#/sports/men");
    },
    onNavClick: (hash) => navigate(hash),
    onExport: () => setStatus("Export not wired yet (next step)."),
    onImport: () => setStatus("Import not wired yet (next step).")
  });

  onRouteChange(render);
  if (!window.location.hash) navigate("#/ad/dashboard");
  render();
}

function render() {
  const route = getRoute();
  store.activeRoute = route;

  // Tabs
  const tab = route.startsWith("#/sports") ? "sports" : "ad";
  store.activeTab = tab;
  setActiveTab(tab);

  // Sidebar nav
  if (tab === "ad") {
    renderNav([
      { label: "Dashboard", hash: "#/ad/dashboard" },
      { label: "Budgets", hash: "#/ad/budgets" },
      { label: "Facilities", hash: "#/ad/facilities" },
      { label: "Infrastructure", hash: "#/ad/infrastructure" }
    ], route);
  } else {
    renderNav([
      { label: "Men's Sports", hash: "#/sports/men" },
      { label: "Women's Sports", hash: "#/sports/women" }
    ], route);
  }

  // Page content
  let html = "";
  let title = "";

  if (route === "#/ad/dashboard") {
    title = `Dashboard — ${store.currentSchool}`;
    html = renderDashboard();
  } else if (route === "#/ad/budgets") {
    title = `Budgets — ${store.currentSchool}`;
    html = renderBudgets();
  } else if (route === "#/ad/facilities") {
    title = `Facilities — ${store.currentSchool}`;
    html = renderFacilities();
  } else if (route === "#/ad/infrastructure") {
    title = `Infrastructure — ${store.currentSchool}`;
    html = renderInfrastructure();
  } else if (route === "#/sports/men") {
    title = `Men's Sports — ${store.currentSchool}`;
    html = renderSportsHome("Men");
  } else if (route === "#/sports/women") {
    title = `Women's Sports — ${store.currentSchool}`;
    html = renderSportsHome("Women");
  } else if (route.startsWith("#/sports/")) {
    const key = route.replace("#/sports/", "").trim();
    title = `Sport — ${store.currentSchool}`;
    html = renderSportRoute(key);
  } else {
    title = `Not Found — ${store.currentSchool}`;
    html = `<div class="card"><h3>Route not found</h3><div class="muted">${route}</div></div>`;
  }

  setTitle(title);
  setContentHtml(html);
  setStatusLine();

  // Bind page-specific events
  if (route === "#/ad/budgets") bindBudgetsEvents();
  if (route === "#/ad/facilities") bindFacilitiesEvents();
  if (route === "#/ad/infrastructure") bindInfrastructureEvents();

  // Make sport cards clickable from the sports home pages
  bindSportsHomeClicks();
}

function renderSportRoute(key) {
  const mod = sportsRegistry[key];
  if (!mod || typeof mod.render !== "function") {
    return `
      <div class="card">
        <h3>Sport module not found</h3>
        <div class="muted">No module registered for: <b>${key}</b></div>
        <div class="divider"></div>
        <div class="muted">
          Fix by creating: frontend/src/modules/sports/${key}/index.js
          and registering it in sports_registry.js
        </div>
      </div>
    `;
  }
  return mod.render();
}

function bindSportsHomeClicks() {
  // Make the sport cards navigate
  document.querySelectorAll(".card h3").forEach(h3 => {
    const name = h3.textContent || "";
    const key = normalizeSportKey(name);
    // Only bind for known sport labels
    if (!isKnownSportName(name)) return;

    h3.style.cursor = "pointer";
    h3.addEventListener("click", () => navigate(`#/sports/${key}`));
  });
}

function isKnownSportName(name) {
  const all = new Set([...store.sportsRoster.Men, ...store.sportsRoster.Women]);
  return all.has(name);
}

boot();
