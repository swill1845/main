import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "ad_sim.sqlite");
export const db = new Database(DB_PATH);

// SQLite consistency
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS saves (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_year INTEGER NOT NULL DEFAULT 2026,
      current_year INTEGER NOT NULL DEFAULT 2026,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      conference TEXT NOT NULL,
      prestige INTEGER NOT NULL DEFAULT 50
    );

    CREATE TABLE IF NOT EXISTS sport_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      save_id TEXT NOT NULL,
      school_id TEXT NOT NULL,

      sport_key TEXT NOT NULL,     -- e.g. track_field
      sport_name TEXT NOT NULL,    -- e.g. Track & Field
      gender TEXT NOT NULL CHECK (gender IN ('M','F')),

      is_active INTEGER NOT NULL DEFAULT 1,

      recruiting_budget INTEGER NOT NULL DEFAULT 0,
      scholarship_limit INTEGER NOT NULL DEFAULT 0,
      roster_target INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),

      FOREIGN KEY (save_id) REFERENCES saves(id) ON DELETE CASCADE,
      FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,

      UNIQUE (save_id, school_id, sport_key, gender)
    );

    CREATE INDEX IF NOT EXISTS idx_programs_save_sport_gender
      ON sport_programs(save_id, sport_key, gender);

    CREATE INDEX IF NOT EXISTS idx_programs_save_school
      ON sport_programs(save_id, school_id);
  `);

  seedSchoolsIfEmpty();
}

function seedSchoolsIfEmpty() {
  const n = db.prepare(`SELECT COUNT(*) AS n FROM schools`).get().n;
  if (n > 0) return;

  const seed = [
    { id: "UF", name: "Florida", conference: "SEC", prestige: 78 },
    { id: "FSU", name: "Florida State", conference: "ACC", prestige: 76 },
    { id: "UCF", name: "UCF", conference: "Big 12", prestige: 70 },
    { id: "USF", name: "USF", conference: "AAC", prestige: 62 },
    { id: "MIAMI", name: "Miami", conference: "ACC", prestige: 74 }
  ];

  const ins = db.prepare(`
    INSERT INTO schools (id, name, conference, prestige)
    VALUES (@id, @name, @conference, @prestige)
  `);

  db.transaction(() => seed.forEach(r => ins.run(r)))();
}

/**
 * Creates a new save (universe) and seeds sport_programs for Track & Field (Men/Women).
 * Men and women are treated equally: same default limits/budgets unless user changes them later.
 */
export function createSave({ name = "New Save", start_year = 2026 } = {}) {
  const saveId = cryptoId();

  const payload = {
    id: saveId,
    name: String(name),
    start_year: Number(start_year),
    current_year: Number(start_year)
  };

  db.prepare(`
    INSERT INTO saves (id, name, start_year, current_year)
    VALUES (@id, @name, @start_year, @current_year)
  `).run(payload);

  seedProgramsForSave(saveId);

  return db.prepare(`SELECT * FROM saves WHERE id = ?`).get(saveId);
}

export function seedProgramsForSave(saveId) {
  const schools = db.prepare(`SELECT id, prestige FROM schools ORDER BY id`).all();

  // Track & Field defaults (first sport vertical slice)
  const sport = {
    sport_key: "track_field",
    sport_name: "Track & Field",
    scholarship_limit: 12,   // placeholder; can be tuned later per NCAA rules or gameplay
    roster_target: 40        // placeholder target size
  };

  // Mild prestige/budget scaling to preserve parity:
  // - everyone is close
  // - higher prestige gets a slight edge (later we tie this to actual budget inputs)
  const baseRecruiting = 350_000;

  const ins = db.prepare(`
    INSERT OR IGNORE INTO sport_programs (
      save_id, school_id, sport_key, sport_name, gender,
      is_active, recruiting_budget, scholarship_limit, roster_target, updated_at
    ) VALUES (
      @save_id, @school_id, @sport_key, @sport_name, @gender,
      1, @recruiting_budget, @scholarship_limit, @roster_target, datetime('now')
    )
  `);

  db.transaction(() => {
    for (const s of schools) {
      // Slight variance: +/- up to ~10% around base, and a small prestige nudge
      const prestigeNudge = Math.round((Number(s.prestige || 50) - 50) * 1500); // small effect
      const recruitingBudget = clampInt(baseRecruiting + prestigeNudge, 250_000, 500_000);

      for (const gender of ["M", "F"]) {
        ins.run({
          save_id: saveId,
          school_id: s.id,
          sport_key: sport.sport_key,
          sport_name: sport.sport_name,
          gender,
          recruiting_budget: recruitingBudget,
          scholarship_limit: sport.scholarship_limit,
          roster_target: sport.roster_target
        });
      }
    }
  })();
}

export function listSaves() {
  return db.prepare(`SELECT * FROM saves ORDER BY created_at DESC`).all();
}

export function getSave(saveId) {
  return db.prepare(`SELECT * FROM saves WHERE id = ?`).get(saveId);
}

export function listPrograms({ saveId, sport_key, gender, school_id } = {}) {
  if (!saveId) throw new Error("saveId is required");

  const clauses = [`save_id = @saveId`];
  const params = { saveId };

  if (sport_key) { clauses.push(`sport_key = @sport_key`); params.sport_key = sport_key; }
  if (gender) { clauses.push(`gender = @gender`); params.gender = gender; }
  if (school_id) { clauses.push(`school_id = @school_id`); params.school_id = school_id; }

  const where = clauses.join(" AND ");
  return db.prepare(`
    SELECT * FROM sport_programs
    WHERE ${where}
    ORDER BY school_id, sport_key, gender
  `).all(params);
}

export function getProgram(programId) {
  return db.prepare(`SELECT * FROM sport_programs WHERE id = ?`).get(Number(programId));
}

export function updateProgram(programId, patch = {}) {
  const existing = getProgram(programId);
  if (!existing) return null;

  const merged = { ...existing, ...patch };

  // Normalize
  if (merged.gender) merged.gender = String(merged.gender).toUpperCase();
  if (merged.sport_key) merged.sport_key = String(merged.sport_key).toLowerCase();
  if (merged.school_id) merged.school_id = String(merged.school_id).toUpperCase();

  // Only allow specific fields for now
  const allowed = {
    is_active: merged.is_active ? 1 : 0,
    recruiting_budget: clampInt(Number(merged.recruiting_budget), 0, 50_000_000),
    scholarship_limit: clampInt(Number(merged.scholarship_limit), 0, 200),
    roster_target: clampInt(Number(merged.roster_target), 0, 500)
  };

  db.prepare(`
    UPDATE sport_programs SET
      is_active=@is_active,
      recruiting_budget=@recruiting_budget,
      scholarship_limit=@scholarship_limit,
      roster_target=@roster_target,
      updated_at=datetime('now')
    WHERE id=@id
  `).run({ id: Number(programId), ...allowed });

  return getProgram(programId);
}

function clampInt(n, lo, hi) {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.trunc(n)));
}

function cryptoId() {
  // Good enough for save IDs; avoids adding uuid dependency
  const a = Math.random().toString(16).slice(2);
  const b = Date.now().toString(16);
  return `${b}-${a}`.slice(0, 24);
}
