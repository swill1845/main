import { store } from "../../state/store.js";

export function renderDashboard() {
  const s = store.schools.find(x => x.id === store.currentSchool);
  return `
    <div class="grid">
      <div class="card span6">
        <h3>${escapeHtml(s.name)} — Overview</h3>
        <div class="muted">High-level AD dashboard. Budgets, facilities, and sport modules.</div>
        <div class="divider"></div>
        <div class="muted">
          Conference: <b>${escapeHtml(s.conference)}</b><br/>
          Prestige: <b>${escapeHtml(String(s.prestige))}</b>
        </div>
      </div>

      <div class="card span6">
        <h3>Next Steps</h3>
        <div class="muted">
          1) Set venues (Infrastructure)<br/>
          2) Set budgets (Budgets)<br/>
          3) Add sport modules (Sports)
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll("\"","&quot;")
    .replaceAll("'","&#039;");
}
