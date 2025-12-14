# Template Backport Details (from web-app-dannys-route)

## 1) Global Modal Host (core/ui)
**What & why**: Renders a single active modal component, injects `onClose`, supports `oncePerSession` by tracking dismissed IDs in-memory. No external deps beyond React. This central host prevents every app/feature from reinventing portal logic and avoids overlapping dialogs. Export hook for consumers; wrap `AppProvider` children with `<ModalHostProvider>` just inside `<BrowserRouter>`. Ensure `resetSession()` is called when auth signs out so once-per-session modals reappear after user change.
**Source files**: `web-app-dannys-route/src/core/ui/ModalHostProvider.tsx`.
**Target location**: `cn-shell-vite-react/src/core/ui/ModalHostProvider.tsx` (new folder). Update `src/app/providers/AppProvider.tsx` to wrap router with provider.
**Example use**:
```tsx
const { showModal, closeModal } = useModalHost();
showModal({ id: 'example', component: ExampleDialog, props: { onClose: () => closeModal('example') }, oncePerSession: true });
```

## 2) Onboarding Gate + Dialog (features/onboarding)
**What & why**: Listens for freshly authenticated users and surfaces a guided onboarding dialog only when `profile.status === 'REGISTRATION_REVIEW_REQUIRED'`. Keeps required data capture out of ad-hoc pages and leverages the modal host for once-per-session behavior.
**Source files**: `web-app-dannys-route/src/features/onboarding/components/OnboardingGate.tsx`, `OnboardingDialog.tsx`.
**Target location**: `cn-shell-vite-react/src/features/onboarding/components/...` (new feature). Mount `<OnboardingGate />` next to `<AppRouter />` in `AppProvider`.
**Key behavior**: Gate calls `showModal({ id: 'onboarding', component: OnboardingDialog, props: { defaultValues, onComplete }, oncePerSession: true })`; dialog runs 3-step MUI flow, handles file preview, calls `completeHydration(...)` then closes.

## 3) AuthProvider reset hook-in
**What & why**: Without resetting the modal host, once-per-session modals never reappear after logout/login. Import `useModalHost` and call `resetSession()` when Firebase user becomes null or on logout.
**Source files**: `web-app-dannys-route/src/core/auth/AuthProvider.tsx` diff vs template.
**Target changes**: Same file in template; add `useModalHost` and invoke `resetSession` in the logout path and when auth state clears.

## 4) AuthLayout overflow fix
**What & why**: Downstream layout uses full-height flex with `minWidth: 0` and `overflowY: auto` to avoid double scrollbars and clipped content (seen on Clients screens). This should be standard for template shells.
**Source file**: `web-app-dannys-route/src/app/layouts/AuthLayout.tsx`.
**Target change**: Replace template `src/app/layouts/AuthLayout.tsx` body with downstream structure while keeping Sidebar usage.

## 5) Sidebar extensibility
**What & why**: Downstream added Clients links; editing shell for each app does not scale. Sidebar should accept a nav config prop or expose an items constant for apps to extend.
**Source file**: `web-app-dannys-route/src/shared/components/layout/Sidebar.tsx` (shows extra items and `PeopleIcon`).
**Target change**: Update template `Sidebar` to accept `items` prop with sensible defaults (Dashboard/Settings). Optionally export defaultItems constant.

## 6) Root route guard
**What & why**: Redirect authenticated users hitting `/` to `/dashboard`; otherwise render public landing. Prevents logged-in users from seeing public marketing page.
**Source files**: `web-app-dannys-route/src/features/app/routes/Root/index.tsx`, route wiring in `src/app/router/routes.tsx`.
**Target changes**: Add Root route to template features and wire `/` under `PublicLayout` to it.

## 7) Shared UI/utilities
**What & why**: Components already reused downstream; upstreaming avoids duplication and keeps styling consistent.
- `StatusPill` (`src/shared/components/ui/StatusPill.tsx`): semantic badge mapping variant -> theme colors.
- `formatIsoDate` (`src/shared/utils/date.ts`): safe date formatter returning `—` for empty/invalid input.
**Source files**: same paths in downstream.
**Target location**: mirror in template `shared` folder; document usage.

## 8) Theme options
**What & why**: Downstream uses warm palette (`primary: #2B1A0E`, beige backgrounds) and heading fonts (`'Inter Tight', 'Plus Jakarta Sans'`). Decide: adopt upstream, expose tokens for easy override, or keep neutral. If adopting, ensure font loading (Google Fonts or self-host).
**Source file**: `web-app-dannys-route/src/app/theme.ts`.
**Target action**: choose strategy; if keeping neutral, document how apps can extend theme without editing template core.

## 9) Suggested implementation order
1) Modal host + AuthProvider reset (unblocks all modal-based flows).
2) AuthLayout overflow fix + root route guard (prevent UX regressions now).
3) Shared `StatusPill` + `formatIsoDate` (dedupe utilities/UI).
4) Sidebar extensibility (support new features cleanly).
5) Onboarding gate/dialog (behind flag if needed; leverages modal host).
6) Theme decision (brand vs neutral tokens, fonts).

## Casa Norte R&D Logo
```
  _____               _              _   _           _            
 / ____|             | |            | \ | |         | |           
| |     __ _ ___  ___| | __ _ _ __  |  \| | ___   __| | ___ _ __  
| |    / _` / __|/ _ \ |/ _` | '__| | . ` |/ _ \ / _` |/ _ \ '_ \ 
| |___| (_| \__ \  __/ | (_| | |    | |\  | (_) | (_| |  __/ | | |
 \_____\__,_|___/\___|_|\__,_|_|    |_| \_|\___/ \__,_|\___|_| |_|
                       C a s a   N o r t e                       
           Software | AI | Hardware | Research & Development     
```

## Additional Context for Backport Success
- Integration order: Theme -> Snackbar -> Router -> ModalHost -> Auth -> Loading -> AppRouter/LoadingOverlay/OnboardingGate.
- Env readiness: onboarding uses `completeHydration` with existing API base envs; no new keys expected. Confirm backend accepts optional photo upload as used in dialog.
- UX guardrails: keep `once-per-session` for onboarding; call `resetSession` on logout and auth failure paths so new users see required modals.
- Sidebar API: default items Dashboard/Settings; allow extending with additional links (e.g., Clients) without shell edits.
- Testing: add RTL/Vitest coverage for modal host state transitions, Root route redirect when authenticated, AuthLayout overflow with long content, and onboarding gate trigger when profile status matches.
- Migration: when backporting, update downstream imports to use shared `StatusPill`/`formatIsoDate` and new Sidebar API; ensure route wiring matches Root guard.
