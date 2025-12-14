# Repository Guidelines

## Project Structure & Module Organization
- Feature-first layout: `src/app` (router, layouts, theme, providers), `src/core` (auth/loading/notifications), `src/shared` (layout+UI, config, utils, services), `src/features/<feature>` (routes/components/hooks/services/types), `src/firebase` (SDK init), `src/types` (ambient typings).
- Add domains only under `src/features`; promote to `shared` after reuse in 2+ places. Keep global concerns inside `src/app/providers/AppProvider.tsx` and thin layouts in `src/app/layouts`.

## Build, Test, and Development Commands
- `npm run dev` – Vite dev server.  `npm run build` – TS project refs + production bundle.  `npm run preview` – Serve built assets.
- `npm run lint` – ESLint over `src`.  `npm run typecheck` – Strict TS no-emit.  `npm run format` – Prettier. Wire `npm run test` once Vitest/RTL is added.

## Coding Style & Naming Conventions
- Every `.ts/.tsx` starts with the 3-line header (`FILE/PURPOSE/NOTES`) described in `src/PROJECT_GUIDELINES.md`.
- Components/screens: PascalCase; hooks: `useX`; route folders: `features/<feature>/routes/<Screen>/index.tsx`. Keep domain UI local; move to `shared/components/ui` or `shared/utils` only when generic. Avoid `any`; prefer typed DTOs/discriminated unions.

## Testing Guidelines
- Co-locate tests as `ComponentName.test.tsx` or `*.test.ts` beside the subject. Cover auth flows, hydration, API clients, and critical UI states. Use React Testing Library + Vitest; mock network with MSW/axios-mock-adapter; store fixtures in the owning feature.

## Commit & Pull Request Guidelines
- Commits: short imperative subjects (e.g., "Add modal host") with logical slices. Mention tickets/env changes in body.
- PRs: include summary, test notes (`lint`, `typecheck`, unit tests), screenshots/recordings for UI, and call out route/provider changes explicitly.

## Template Backport Needs (from web-app-dannys-route)
- Introduce `core/ui/ModalHostProvider` + `useModalHost`; wrap `AppProvider` and reset modal session on logout.
- Add onboarding gate/dialog pattern that triggers when `profile.status === 'REGISTRATION_REVIEW_REQUIRED'` and calls `completeHydration` on finish.
- Adopt improved `AuthLayout` shell (full-height flex column, scroll-safe overflow) and consider the warmer palette now in `app/theme.ts`.
- Promote reusable bits to `shared`: `components/ui/StatusPill`, `utils/date.formatIsoDate`, and a root route guard redirecting authenticated users to `/dashboard`.
- Make sidebar/nav items data-driven so downstream apps can inject feature links (e.g., clients) without editing shell code.

## Security & Configuration Tips
- `.env.local` provides required keys; `shared/config/env.ts` fails fast if missing. Never commit secrets; keep API origins in env vars and avoid hardcoded URLs in services.
