import { store, setStatus } from "../../state/store.js";

export function renderFacilities() {
  const d = store.facilityData[store.currentSchool];

  const rows = (d.items || []).map((it, idx) => `
    <div class="card">
      <h3>${escapeHtml(it.name || "")}</h3>
      <div class="muted">Type: ${escapeHtml(it.type || "")} | Cost: $${Number(it.cost||0).toLocaleString()} | Status: ${escapeHtml(it.status || "Planned")}</div>
      <div class="divider"></div>
      <button class="btn secondary" data-remove-fac="${idx}">Remove</button>
    </div>
  `).join("");

  return `
    <div class="card">
      <h3>Core Facilities</h3>
      <div class="divider"></div>

      <div class="small" style="margin-bottom:6px">Football Stadium</div>
      <input id="fac_stadium" value="${escapeAttr(d.stadium)}" />

      <div class="small" style="margin:10px 0 6px">Basketball Arena</div>
      <input id="fac_arena" value="${escapeAttr(d.arena)}" />

      <div class="small" style="margin:10px 0 6px">Athletics Complex</div>
      <input id="fac_complex" value="${escapeAttr(d.complex)}" />

      <div class="small" style="margin:10px 0 6px">Notes</div>
      <input id="fac_notes" value="${escapeAttr(d.notes)}" />

      <div class="divider"></div>
      <button class="btn" id="saveFacilities">Save Facilities</button>
    </div>

    <div class="card">
      <h3>Add Facility Project</h3>
      <div class="divider"></div>

      <div class="small" style="margin-bottom:6px">Project Name</div>
      <input id="proj_name" placeholder="e.g., New Weight Room" />

      <div class="small" style="margin:10px 0 6px">Type</div>
      <input id="proj_type" placeholder="e.g., Performance" />

      <div class="small" style="margin:10px 0 6px">Cost</div>
      <input id="proj_cost" type="number" min="0" step="5000" />

      <div class="small" style="margin:10px 0 6px">Status</div>
      <input id="proj_status" placeholder="Planned / Active / Complete" />

      <div class="divider"></div>
      <button class="btn secondary" id="addProject">Add Project</button>
    </div>

    ${rows || `<div class="card"><div class="muted">No projects yet.</div></div>`}
  `;
}

export function bindFacilitiesEvents() {
  document.getElementById("saveFacilities").addEventListener("click", () => {
    const d = store.facilityData[store.currentSchool];
    d.stadium = document.getElementById("fac_stadium").value || "";
    d.arena = document.getElementById("fac_arena").value || "";
    d.complex = document.getElementById("fac_complex").value || "";
    d.notes = document.getElementById("fac_notes").value || "";
    setStatus("Saved facilities.");
  });

  document.getElementById("addProject").addEventListener("click", () => {
    const name = document.getElementById("proj_name").value || "";
    if (!name.trim()) { setStatus("Project name is required."); return; }

    const d = store.facilityData[store.currentSchool];
    d.items = d.items || [];
    d.items.push({
      name,
      type: document.getElementById("proj_type").value || "",
      cost: Number(document.getElementById("proj_cost").value || 0),
      status: document.getElementById("proj_status").value || "Planned"
    });

    setStatus("Added facility project.");
  });

  document.querySelectorAll("[data-remove-fac]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-remove-fac"));
      const d = store.facilityData[store.currentSchool];
      d.items.splice(idx, 1);
      setStatus("Removed project.");
    });
  });
}

function escapeHtml(s){ return String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#039;"); }
function escapeAttr(s){ return escapeHtml(s); }
