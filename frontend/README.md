# Frontend (React + Tailwind)

## Run

1) Install dependencies

```bash
cd frontend
npm install
```

2) Start dev server

```bash
npm run dev
```

Then open the URL shown by Vite (default: http://localhost:5173).

## API Gateway

Frontend calls only the API Gateway:
- `VITE_API_GATEWAY` (optional) defaults to `http://localhost:8080`

## Service-down UX

If a specific microservice is down, the related page shows:
- “Sorry, this page is busy, try again later.”
- a random motivational quote

The availability check runs periodically (every 5s) with a short timeout.

