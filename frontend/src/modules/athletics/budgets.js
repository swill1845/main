import { store, uniqueSports, setStatus } from "../../state/store.js";

export function renderBudgets() {
  const sports = uniqueSports();
  const cats = store.budgetCategories;

  let html = `
    <div class="card">
      <h3>Budgets</h3>
      <div class="muted">Annual budgets by sport and category.</div>
    </div>
  `;

  for (const sp of sports) {
    html += `
      <div class="card">
        <h3>${escapeHtml(sp)}</h3>
        <div class="divider"></div>
        ${cats.map(cat => {
          const v = store.sportBudgets[store.currentSchool][sp][cat] ?? 0;
          return `
            <div style="margin-bottom:10px">
              <div class="small" style="margin-bottom:6px">${escapeHtml(cat)}</div>
              <input type="number" min="0" step="1000" data-budget-sport="${escapeAttr(sp)}" data-budget-cat="${escapeAttr(cat)}" value="${v}" />
            </div>
          `;
        }).join("")}
        <div class="divider"></div>
        <button class="btn" data-save-budget="${escapeAttr(sp)}">Save ${escapeHtml(sp)}</button>
      </div>
    `;
  }

  return html;
}

export function bindBudgetsEvents() {
  document.querySelectorAll("[data-save-budget]").forEach(btn => {
    btn.addEventListener("click", () => {
      const sport = btn.getAttribute("data-save-budget");

      document.querySelectorAll(`input[data-budget-sport="${cssEscape(sport)}"]`).forEach(input => {
        const cat = input.getAttribute("data-budget-cat");
        store.sportBudgets[store.currentSchool][sport][cat] = Number(input.value || 0);
      });

      setStatus(`Saved budgets for ${sport}`);
    });
  });
}

function cssEscape(s){ return String(s).replaceAll('"','\\"'); }
function escapeHtml(s){ return String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#039;"); }
function escapeAttr(s){ return escapeHtml(s); }
