# AD Sim — Fresh Start

Folders:
- `frontend/` — browser UI (static HTML/JS/CSS).
- `backend/`  — optional API/server (not required to view the UI).

## Run the FRONTEND (Windows)
1) Install Python 3 (if not installed).
2) Double-click `frontend/serve.cmd`.
3) Open the URL (usually http://localhost:8000).
4) Click **Advance Day** to verify it works.

> Do **not** open index.html directly with file:// — use the server above.

## Run the BACKEND (optional)
1) `cd backend`
2) `npm install`
3) `npm run dev`
4) Visit http://localhost:3000/api/health → `{ "ok": true }`

You can later call backend routes from the frontend with `fetch('/api/...')`.