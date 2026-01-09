import { store } from "../../../state/store.js";

export function renderSportModule(sportName) {
  const venue = store.venueData[store.currentSchool]?.[sportName] || "Not set";

  return `
    <div class="card">
      <h3>${escapeHtml(sportName)} — Module</h3>
      <div class="muted">
        Venue: <b>${escapeHtml(venue)}</b>
      </div>
      <div class="divider"></div>
      <div class="muted">
        This is the sport-specific folder boundary.<br/>
        Next: add sub-pages inside this sport folder:
        <ul>
          <li>Roster</li>
          <li>Schedule</li>
          <li>Recruiting</li>
          <li>Sim Day</li>
          <li>Leaders/Rankings</li>
        </ul>
      </div>
    </div>
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
