# Upgrading Downstream Apps from the Template

This checklist helps sync downstream apps (e.g., web-app-dannys-route) with recent template changes.

## 1) Dark Mode + Background
- Ensure downstream `src/index.css` does **not** set a fixed background color on `html, body, #root`; let MUI theme control it.
- Adopt `ThemeModeContext` and theme toggle wiring:
  - `AppProvider` should wrap children with `ThemeModeProvider` and build the theme from `lightPalette`/`darkPalette` in `app/theme.ts`.
  - `Sidebar` uses `useThemeMode()` to render a toggle item; pass `items` prop as needed.

## 2) Sidebar Extensibility
- Replace hard-coded nav items with `items` prop (or use `defaultNavItems` export). Downstream features can add their own nav entries without editing the shell.

## 3) Root Route Guard
- Add `features/app/routes/Root` and wire `/` in `routes.tsx` to redirect authenticated users to `/dashboard` and show public landing otherwise.

## 4) Onboarding Modal Flow
- Add `core/ui/ModalHostProvider`, wrap `AppProvider` with it, and reset modal session on logout.
- Add `features/onboarding/components/OnboardingGate` + `OnboardingDialog` and mount the gate in `AppProvider`.
- Extend `userService` with `completeHydration` (supports optional photo upload via FormData).

## 5) Testing Baseline
- Keep Vitest + React Testing Library setup (`npm run test`). Tests to mirror: ModalHostProvider, RootRoute guard, Sidebar toggle, date util. Ensure `test/setup.ts` includes jest-dom.

## 6) Theming
- Template stays light by default; `darkPalette` is exported for downstream toggles. Avoid hard-coding colors in CSS; use theme tokens.

## Upgrade Steps Summary
1. Merge/rebase latest template changes or bump dependency version if packaged.
2. Remove fixed body background in downstream `index.css`.
3. Update `AppProvider` to include ThemeModeProvider + theme toggling; ensure Sidebar uses `useThemeMode` and configurable `items`.
4. Add/verify Root route guard wiring.
5. Add onboarding modal host + gate + completeHydration changes.
6. Run `npm run test` to confirm baseline.
