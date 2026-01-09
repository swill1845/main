import { store } from "../../state/store.js";
import { normalizeSportKey } from "../../ui/shell.js";

export function renderSportsHome(genderLabel) {
  const list = genderLabel === "Men" ? store.sportsRoster.Men : store.sportsRoster.Women;

  return `
    <div class="card">
      <h3>${escapeHtml(genderLabel)} Sports</h3>
      <div class="muted">Select a sport.</div>
    </div>

    ${list.map(sp => `
      <div class="card">
        <h3>${escapeHtml(sp)}</h3>
        <div class="muted">Open module: <b>#/sports/${normalizeSportKey(sp)}</b></div>
      </div>
    `).join("")}
  `;
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll("\"","&quot;")
    .replaceAll("'","&#039;");
}
