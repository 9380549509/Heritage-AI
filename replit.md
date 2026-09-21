# Heritage AI

Heritage AI helps people identify Karnataka monuments from photographs and understand the history and architecture around what they are seeing.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `GEMINI_API_KEY` — server-only Gemini API key for image analysis

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/heritage-ai/src/App.tsx` — the responsive upload, results, and architecture-explanation experience
- `artifacts/heritage-ai/src/index.css` — Heritage AI visual tokens and global styles
- `artifacts/api-server/src/routes/heritage.ts` — server-side Gemini vision requests and validation
- `lib/api-spec/openapi.yaml` — source of truth for heritage API contracts
- `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/` — generated API hooks and schemas

## Architecture decisions

- Image bytes are converted to base64 in the browser for the short hackathon flow; the server forwards them to Gemini and never exposes the API key to the client.
- The app is intentionally stateless: the selected image and last result persist in browser session storage, while analysis remains on demand.
- The Gemini prompt requires strict JSON and explicitly returns `Unknown` when the image is unclear or not a supported Karnataka heritage site.

## Product

- Upload or select a monument photograph, preview it, and ask Gemini to identify it.
- View confidence, location, historical context, architecture, facts, travel timing, and nearby attractions.
- Ask for a focused explanation of visible architectural features.
- Switch explanations between English, Kannada, and Hindi.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do not move `GEMINI_API_KEY` into frontend code or expose it through browser environment variables.
- The API accepts JSON with base64 image data and is configured for a 12 MB request body; client-side uploads are limited to JPG, PNG, and WEBP.
- Run API codegen after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
