import express from "express";
import cors from "cors";

import { migrate } from "./db.js";
import { savesRouter } from "./routes/saves.js";
import { programsRouter } from "./routes/programs.js";

migrate();

const app = express();

// In production, set CORS_ORIGIN to your site domain.
// Example: CORS_ORIGIN=https://fprl.org
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "ad-sim-backend" });
});

app.use("/api/saves", savesRouter);
app.use("/api/programs", programsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
