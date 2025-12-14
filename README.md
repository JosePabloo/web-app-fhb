# Casa Norte Vite + React Starter Shell

A production-minded starter template for building a modular React web application with Vite, React Router v7, Firebase Authentication (email/password, OTP, WebAuthn), Material UI (MUI v7), and an Axios HTTP layer that transparently injects Firebase ID tokens.

Focus: Fast local DX, clear feature-first architecture, explicit global providers, and predictable scaling patterns.

---
## 1. Tech Stack
- React 19 + React Router v7 (data-aware & lazy routes)
- Vite 7 (dev + build)
- TypeScript 5.8
- MUI v7 (theming via `app/theme.ts`)
- Firebase JS SDK v11 (Auth + ID token management)
- Axios (wrapped in `shared/services/apiClient.ts`)
- WebAuthn flows via `@passwordless-id/webauthn`
- JWT parsing (`jwt-decode`)

---
## 2. Project Structure (Actual)
```txt
src/
  main.tsx                 # App bootstrap (env validation + AppProvider)
  app/                     # Shell: router config, layouts, providers, theme
    router/ (index.tsx, routes.tsx)
    layouts/ (AuthLayout, PublicLayout, PageWrapper)
    providers/ (AppProvider)
    theme.ts
  core/                    # Global contexts (auth, loading, snackbar)
    auth/ (AuthProvider, useAuth, WebAuthn + OTP orchestration)
    loading/ (LoadingProvider, useLoading)
    notifications/ (SnackbarProvider, useSnackbar)
  shared/                  # Cross-feature reusable code (layout components, env, apiClient, types, utils)
  features/                # Domain features (auth, dashboard, settings, etc.)
    auth/routes/*          # Login, VerifyOTP, WebAuthn, Unauthorized landing
    dashboard/routes/*     # Example protected dashboard
    settings/routes/*      # Account settings example
  firebase/                # Firebase app & auth instance
  types/                   # Ambient declarations / legacy re-exports
```
Add new domain areas only under `features/`; promote code to `shared/` after proven reuse.

---
## 3. Scripts (package.json)
- `npm run dev` – Start Vite dev server
- `npm run build` – Type-check + production build
- `npm run preview` – Preview built assets
- `npm run lint` – Lint TypeScript/React sources
- `npm run typecheck` – Strict type checking (no emit)
- `npm run format` – Format with Prettier

---
## 4. Environment Variables
Create `.env.local` (never commit secrets):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_BACKEND_API_URL=https://api.example.com
```
`shared/config/env.ts` validates required vars at startup; app fails fast if misconfigured.

---
## 5. Authentication Flows
Implemented in `core/auth`:
- Email/password login
- WebAuthn registration & authentication (`webauthnClient.ts`)
- OTP verification route (`VerifyOTP`)
- User/profile hydration & token handling
Axios requests automatically attach current user Firebase ID token.

Extend:
- Add claims parsing in `AuthProvider`
- Add role-based layouts or guarded route branches in `routes.tsx`

---
## 6. Routing Pattern
Declarative route tree lives in `app/router/routes.tsx` (lazy imported screens from `features/*/routes`). Layouts (`AuthLayout`, `PublicLayout`) wrap specific branches. Avoid ad-hoc PrivateRoute components; express auth boundaries via layout composition and conditional elements if needed.

To add a screen:
1. Create folder: `features/<feature>/routes/<ScreenName>/index.tsx`
2. Export component named `<Feature><Screen>Page` (e.g., `SettingsAccountPage`).
3. Add lazy import + route entry in `routes.tsx`.

---
## 7. Feature Module Standard
Each feature may include:
```
features/<feature>/
  routes/      # Screens only
  components/  # Reusable UI internal to feature
  hooks/       # Feature-specific state/query hooks
  services/    # Orchestration / domain logic
  api/         # Typed endpoint clients using shared apiClient
  types/       # Domain types
```
Keep business logic out of shared UI; start local then promote.

---
## 8. Shared Layer
`shared/` contains only truly cross-cutting pieces:
- `components/layout` (Navbar, Sidebar, LoadingOverlay)
- `services/apiClient.ts` (Axios instance with ID token injection)
- `config/env.ts` (runtime validation)
- `types/common.ts` (DTOs) & `utils/*` (generic helpers)

---
## 9. Global Providers
Composed in `app/providers/AppProvider.tsx`:
1. ThemeProvider
2. Router
3. AuthProvider
4. LoadingProvider
5. SnackbarProvider
6. Side-effect UI (LoadingOverlay)

Add new global providers only for universal concerns (e.g., Feature Flags). Implement under `core/<domain>`.

---
## 10. Code Conventions (Summary)
- 3-line header required at top of every `.ts/.tsx`:
  ```
  // FILE: <relative path>
  // PURPOSE: <role>
  // NOTES: <architectural context>
  ```
- Components: PascalCase; colocate child-only helpers in same folder.
- Hooks: `useX` naming; throw if called outside provider where applicable.
- Paths: Kebab-case for URL segments.
- Promote to `shared/` only after reuse across ≥2 features.
- Avoid `any`; prefer discriminated unions for variants.

---
## 11. Styling
MUI theme central in `app/theme.ts`. Extend palette, typography, spacing there. Keep custom styled components aligned with theme tokens. Limit mixing of styling methodologies.

---
## 12. Testing
- Tooling: Vitest + React Testing Library (`npm run test`), setup in `vitest.config.ts` with `test/setup.ts` adding jest-dom matchers.
- Placement: co-locate tests as `*.test.ts(x)` next to the subject (e.g., `ModalHostProvider.test.tsx`, `date.test.ts`). Keep fixtures inside the owning feature/shared folder.
- Focus: global providers (Auth, ModalHost, Loading), routing guards, shared utilities/components. Mock network calls (axios) and auth/fetch as needed; avoid hitting real Firebase.

---
## 13. Theming
- Default: light theme with blue primary (see `app/theme.ts`). A dark palette is exported as `darkPalette` for consumers to toggle; template stays light by default.
- Extend palette/typography in `app/theme.ts`; prefer using theme tokens in custom components.

---
## 14. Extensibility Ideas
- Add TanStack Query for server state (`core/query`)
- Introduce role-based route gating (claims mapping)
- Add telemetry/logging provider
- Add error boundary component for critical routes
- Expand API client (retry, circuit breaker, typed errors)

---
## 15. Getting Started
```bash
git clone <repo-url>
cd <repo-folder>
npm install
cp .env.local.example .env.local  # create + fill values
npm run dev
```
Visit: http://localhost:5173

Build & preview:
```bash
npm run build
npm run preview
```

---
## 16. Contribution Workflow
1. Create feature branch.
2. Implement feature under `features/` following structure.
3. Add/adjust routes in `routes.tsx`.
4. Ensure env validation passes, lint/typecheck succeed.
5. Update README or guidelines if introducing new patterns.

---
## 17. License / Usage
Intended as an internal starter template. Add license details as needed.

---
For deeper standards see `src/PROJECT_GUIDELINES.md`.
