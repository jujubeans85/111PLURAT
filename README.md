# CrateJuice Backend (FastAPI)

Lean, ready-to-deploy backend for **cratejuice.org**.

## Endpoints

- `GET /` → sanity check
- `GET /healthz` → health probe (pings Mongo if configured)
- `POST /tracks/log` → save a track play
- `GET /tracks/recent` → list recent plays

## Quickstart (Local)

```bash
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Copy .env.example → .env and paste your MongoDB URI
uvicorn main:app --reload
```

Visit: http://127.0.0.1:8000/docs

## Deploy on Render

1. Push this folder to GitHub.
2. Create new **Web Service** on Render → connect repo.
3. Add env var `MONGO_URI` in the dashboard.
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Done. Backend live at `https://cratejuice-backend.onrender.com` (or your custom domain).

## Notes

- MongoDB Atlas is the recommended database (free tier works fine).
- You can point `api.cratejuice.org` to your Render service via a CNAME record.
