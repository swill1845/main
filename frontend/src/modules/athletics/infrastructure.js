import { store, uniqueSports, setStatus } from "../../state/store.js";

export function renderInfrastructure() {
  const sports = uniqueSports();
  const venues = store.venueData[store.currentSchool] || {};

  return `
    <div class="card">
      <h3>Infrastructure — Venues</h3>
      <div class="muted">Define a venue for each sport.</div>
      <div class="divider"></div>

      ${sports.map(sp => {
        const v = venues[sp] || "";
        return `
          <div style="margin-bottom:12px">
            <div class="small" style="margin-bottom:6px">${escapeHtml(sp)}</div>
            <input data-venue-sport="${escapeAttr(sp)}" value="${escapeAttr(v)}" placeholder="Venue name" />
          </div>
        `;
      }).join("")}

      <div class="divider"></div>
      <button class="btn" id="saveVenues">Save Venues</button>
    </div>
  `;
}

export function bindInfrastructureEvents() {
  document.getElementById("saveVenues").addEventListener("click", () => {
    store.venueData[store.currentSchool] = store.venueData[store.currentSchool] || {};
    document.querySelectorAll("[data-venue-sport]").forEach(input => {
      const sport = input.getAttribute("data-venue-sport");
      store.venueData[store.currentSchool][sport] = input.value || "";
    });
    setStatus("Saved venues.");
  });
}

function escapeHtml(s){ return String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#039;"); }
function escapeAttr(s){ return escapeHtml(s); }
