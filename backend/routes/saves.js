import { Router } from "express";
import { createSave, getSave, listSaves } from "../db.js";

export const savesRouter = Router();

// GET /api/saves
savesRouter.get("/", (_req, res) => {
  res.json(listSaves());
});

// POST /api/saves
// body: { name?: string, start_year?: number }
savesRouter.post("/", (req, res) => {
  const body = req.body || {};
  const save = createSave({
    name: body.name ?? "New Save",
    start_year: body.start_year ?? 2026
  });
  res.status(201).json(save);
});

// GET /api/saves/:id
savesRouter.get("/:id", (req, res) => {
  const save = getSave(req.params.id);
  if (!save) return res.status(404).json({ error: "save not found" });
  res.json(save);
});
