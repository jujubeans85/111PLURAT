# CrateJuice Frontend — Vintage Skin + t=slug links

Adds deep-linking for postcards: `https://cratejuice.org/?t=<slug>`.

- Each track gets a slug (from title).
- Copy Link button copies the postcard URL with `?t=slug`.
- Add Track modal auto-creates slug; saved to localStorage.
- Netlify proxy for `/api/*` → `https://api.cratejuice.org` remains.

## Deploy
Drop to Netlify. Done. QR codes can point to the `?t=slug` URLs.
