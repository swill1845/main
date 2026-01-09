import { Router } from "express";
import { getProgram, listPrograms, updateProgram } from "../db.js";

export const programsRouter = Router();

// GET /api/programs?saveId=...&sport=track_field&gender=M&schoolId=UF
programsRouter.get("/", (req, res) => {
  const saveId = String(req.query.saveId || "");
  const sport_key = req.query.sport ? String(req.query.sport) : undefined;
  const gender = req.query.gender ? String(req.query.gender).toUpperCase() : undefined;
  const school_id = req.query.schoolId ? String(req.query.schoolId).toUpperCase() : undefined;

  if (!saveId) return res.status(400).json({ error: "saveId is required" });
  if (gender && !["M", "F"].includes(gender)) return res.status(400).json({ error: "gender must be M or F" });

  try {
    const rows = listPrograms({ saveId, sport_key, gender, school_id });
    res.json(rows);
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

// GET /api/programs/:id
programsRouter.get("/:id", (req, res) => {
  const row = getProgram(req.params.id);
  if (!row) return res.status(404).json({ error: "program not found" });
  res.json(row);
});

// PATCH /api/programs/:id
// body can include: is_active, recruiting_budget, scholarship_limit, roster_target
programsRouter.patch("/:id", (req, res) => {
  const updated = updateProgram(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: "program not found" });
  res.json(updated);
});
