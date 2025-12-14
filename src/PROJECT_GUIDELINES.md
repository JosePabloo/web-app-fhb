# Vite + React Project Guidelines

> Applies to: `cn-shell-vite-react`
> Goal: Make the project scalable for multi-team, multi-feature development with a clear feature-first architecture.
> Also: Provide predictable LLM-readable metadata via standardized file header comments.

---

## A) Folder Structure Standards

### 1. Required Top-Level Folders

Under `src/` we use:

```txt
src/
  main.tsx              // entry point bootstrapping AppProvider
  index.css
  vite-env.d.ts

  app/                  // app shell: routing, layouts, providers, theme
  shared/               // cross-feature reusable UI, utils, services, config
  features/             // feature modules (auth, dashboard, settings, etc.)
  core/                 // global providers & contexts (auth, loading, snackbar)
  firebase/             // Firebase integration (config + auth instance)
  types/                // legacy + ambient typings (prefer shared/types or features/*/types)
```

(Tests folder may be added later.)

### 2. Naming Conventions

- Folders: `lowerCamelCase` (except domain clarity like `auth`, `dashboard`).
- React components & screens: **PascalCase**.
- Hooks: start with `use` (`useAuth`, `useSnackbar`).
- Files exporting a single component:
  - `ComponentName.tsx`, or
  - `index.tsx` inside a folder named `ComponentName`.
- All `.ts/.tsx` files must begin with the 3-line header (see Section K).

### 3. Feature-Based Module Guidelines

A **feature** is a domain area or capability: `auth`, `dashboard`, `settings`, etc.
Each feature owns its routes/screens, local UI components, hooks, services, API clients, and domain types.

Standard feature structure:

```txt
features/<featureName>/
  routes/
  components/
  hooks/
  services/
  api/
  types/
```

### 4. Where UI-Level vs Domain-Level Code Lives

- **UI-level (generic, visual, reusable)** belongs in `shared/components/ui/` or `shared/components/layout/`.
- **Feature-specific UI** stays under `features/<feature>/components/`.
- **Domain / orchestration logic** lives in `features/<feature>/services/` or `features/<feature>/api/`.
- Start local; promote to `shared/` only after 2+ feature reuse is proven.

### 5. Current App Shell Structure

```txt
app/
  router/
    index.tsx       // materializes route tree under Suspense
    routes.tsx      // declarative routeConfig (lazy imports + layouts)
  layouts/
    AuthLayout.tsx  // protected area shell w/ Sidebar
    PublicLayout.tsx// public/unauthenticated shell
    PageWrapper.tsx // generic page framing component (used inside routes)
  providers/
    AppProvider.tsx // composes theme + router + global providers
  theme.ts          // central MUI theme
```

(Additional layouts like `RootLayout` or `DashboardLayout` can be introduced later if cross-feature needs emerge.)

### 6. Core Providers & Global State

Current global contexts under `core/`:

- `auth/` – Firebase + WebAuthn + OTP + profile hydration (`AuthProvider`, `useAuth`).
- `loading/` – global overlay state (`LoadingProvider`, `useLoading`).
- `notifications/` – snackbar error messaging (`SnackbarProvider`, `useSnackbar`).

Add new global providers sparingly; prefer feature-local hooks unless truly cross-cutting.

### 7. Shared Module Snapshot

```txt
shared/
  components/
    layout/ (Navbar, Sidebar, LoadingOverlay)
  config/ (env.ts validation)
  services/ (apiClient.ts axios instances)
  types/ (common.ts shared DTOs)
  utils/ (phone.ts)
```

`env.ts` is imported first in `main.tsx` to fail fast if required variables are missing.

### 8. When Code Belongs in `shared/` vs `features/`

Put code in `features/` unless it is genuinely reused by multiple features and domain-agnostic. Promote only after verified reuse.

---

## B) Creating New Screens

### 1. Naming Conventions (Screens)

- Each screen lives in:

  ```txt
  features/<feature>/routes/<ScreenName>/index.tsx
  ```

- The main component should be named `<Feature><Screen>Page` for clarity:

  - `AuthLoginPage`, `DashboardHomePage`, `SettingsAccountPage`.

### 2. Where Screens Live

- All route components **must** live inside `features/*/routes`.
- No `screens/` folder at the root; routes are feature-owned.

### 3. Rules for Colocating Child Components & Layout

- Child components used only by one screen should be colocated with that screen:

  ```txt
  features/dashboard/routes/Dashboard/
    index.tsx
    DashboardHeader.tsx
    DashboardTable.tsx
  ```

- Components shared among several screens in the same feature go to `features/<feature>/components/`.

- Feature-wide layouts (e.g. `DashboardLayout`) belong in `features/<feature>/components/` or in `app/layouts` if truly cross-feature.

### 4. When to Extract UI into Reusable Components

- Extract into `shared/components/ui` when:
  - It has generic props (no domain wording).
  - It is used by more than one feature.
- Extract into `shared/components/layout` when:
  - It is part of the app shell (Navbar, Sidebar, global LoadingOverlay).

### 5. Example Screen Folder Template

```txt
features/settings/routes/AccountSettings/
  index.tsx
  AccountSettingsHeader.tsx
  AccountSettingsForm.tsx
  AccountSettings.test.tsx
  AccountSettings.module.css (if using CSS modules)
```

Minimal `index.tsx`:

```tsx
// ...existing imports...

export function SettingsAccountPage() {
  // const { user, updateUser } = useAccountSettings();

  return (
    <PageWrapper title="Account Settings">
      {/* ...content... */}
    </PageWrapper>
  );
}

export default SettingsAccountPage;
```

### 6. Required Checklist for New Screens

- [ ] Screen is under `features/<feature>/routes/<ScreenName>/index.tsx`.
- [ ] Component named `<Feature><Screen>Page`.
- [ ] Child components colocated if only used here.
- [ ] Styles applied using the project’s chosen styling system.
- [ ] Tests added for critical UI/flows.
- [ ] Accessibility: semantic structure, labels, focus handling.
- [ ] Route entry added or updated in `app/router/routes.tsx`.

---

## C) Creating New Components

### 1. Functional Stateless Component Conventions

- Prefer function components with hooks.
- Keep shared components **presentational**; no feature business logic.

Example:

```tsx
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  // ...existing render...
}
```

### 2. Folder Structure Rules

- Shared UI components:

  ```txt
  shared/components/ui/Button/
    index.tsx
    Button.module.css
    Button.test.tsx
  ```

- Shared layout components:

  ```txt
  shared/components/layout/Navbar/
    index.tsx
  shared/components/layout/Sidebar/
    index.tsx
  ```

- Feature-scoped components:

  ```txt
  features/dashboard/components/DashboardStats/
    index.tsx
    DashboardStats.test.tsx
  ```

### 3. Styling Guidelines

- Use one primary styling strategy across the project:
  - CSS Modules, Tailwind, or MUI’s styled API.
- If using MUI, keep styling consistent with the theme configuration in `app/theme`.
- Do not mix too many styling patterns arbitrarily.

### 4. Props Interface Conventions

- Define clear `Props` types:

  ```ts
  type AuthFormProps = {
    onSubmit: (data: AuthFormData) => void;
    isLoading?: boolean;
  };
  ```

- Avoid `any`; use discriminated unions for variants where necessary.
- Use named props; no positional parameter patterns.

### 5. Testing Requirements

- Shared components with logic: require unit/component tests.
- Tests colocated with component:

  ```txt
  shared/components/ui/Button/Button.test.tsx
  ```

- Feature components with domain logic: also require tests under the same folder.

### 6. Component Naming Rules

- Use domain-specific names: `LoginForm`, `DashboardStats`, not `FormComponent`.
- Do not suffix names with `Component`.

---

## D) Creating New Features

### 1. What Constitutes a Feature

Create a new feature when:

- You introduce a new domain like billing, notifications, or user management.
- The logic is non-trivial and uses dedicated endpoints and screens.

### 2. Standard Feature Structure

```txt
features/<FeatureName>/
  routes/
  components/
  hooks/
  services/
  api/
  types/
```

- `routes/` – route components (screens).
- `components/` – feature-specific UI components.
- `hooks/` – domain hooks (e.g., `useBillingOverview`).
- `services/` – domain orchestration logic.
- `api/` – typed endpoint clients.
- `types/` – domain-specific types.

### 3. Communication Patterns Between Features

- Features should not import components from each other directly.
- Communication happens via:
  - `shared/` UI components.
  - `core/` state (auth, notification).
  - shared hooks/utilities if truly cross-feature.

If two features need the same logic, move it into `shared/` or `core/`.

### 4. When to Lift Logic into `shared/`

- When multiple features duplicate similar logic (same API requests, same transforms).
- Move only the shared part to `shared/` and keep domain-specific parts in features.

### 5. Example Feature Folder Tree

```txt
features/billing/
  routes/
    BillingOverview/
      index.tsx
      BillingOverview.test.tsx
    InvoiceDetails/
      index.tsx
  components/
    InvoiceTable/
      index.tsx
      InvoiceTable.test.tsx
  hooks/
    useBillingOverview.ts
    useInvoice.ts
  services/
    billingService.ts
  api/
    billingClient.ts
  types/
    billing.ts
```

---

## E) Routing Guidelines

### 1. How to Define Routes

- All route definitions live in `app/router/routes.tsx`.
- Screens are imported from `features/*/routes`.

Example:

```tsx
const LoginPage = lazy(() => import('../../features/auth/routes/Login'));
const DashboardPage = lazy(() => import('../../features/dashboard/routes/Dashboard'));

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/login', element: <PublicLayout><LoginPage /></PublicLayout> },
      { path: '/dashboard', element: <AuthLayout><DashboardPage /></AuthLayout> },
    ],
  },
];
```

### 2. Naming Rules for Routes

- URL paths in kebab-case: `/account-settings`, `/verify-otp`.
- Align path segments with feature/domain names where possible.

### 3. Layout Hierarchy

- Layout components live in `app/layouts`.
- Typical hierarchy:

  ```txt
  RootLayout
    ├─ PublicLayout   // public routes like /login
    └─ AuthLayout     // authenticated routes like /dashboard
  ```

- Use layout composition in the route config instead of custom `PrivateRoute` wrappers.

### 4. Where Route-Level Loaders/Actions Live

- If using React Router data APIs, colocate loaders and actions with routes:

  ```txt
  features/dashboard/routes/Dashboard/loader.ts
  features/dashboard/routes/Dashboard/action.ts
  ```

- Imports into `routes.tsx` as needed.

### 5. Nested Routing Structure

- For nested resources:

  ```txt
  features/settings/routes/
    index.tsx              // /settings
    Account/
      index.tsx            // /settings/account
    Security/
      index.tsx            // /settings/security
  ```

---

## F) State Management Guidelines

### 1. Stack Choices

- **Global state & providers** in `core/`:
  - auth (current user, token)
  - loading
  - notifications/snackbar
- **Server state** (recommended): React Query (TanStack Query) in `core/query`.
- **Local UI state** with `useState`/`useReducer`.

### 2. Colocating State by Feature

- Feature-specific hooks:

  ```txt
  features/dashboard/hooks/useDashboardData.ts
  features/settings/hooks/useAccountSettings.ts
  ```

- These hooks encapsulate React Query calls or service calls.

### 3. Global vs Local State

- Local component state if only one component uses it.
- Feature-local state if multiple components in that feature need it.
- Global/core state only for:
  - Authentication
  - Global notifications
  - Global loading or feature flags.

### 4. Query Caching Conventions

- Use stable query keys, grouped by feature:

  ```ts
  export const dashboardQueryKeys = {
    metrics: () => ['dashboard', 'metrics'] as const,
  };
  ```

- Only invalidate queries that belong to the same feature’s domain.

---

## G) API & Services

### 1. Structuring API Calls

- Shared HTTP layer in `shared/services/apiClient.ts`.
- Feature-specific clients in `features/<feature>/api/`.

Example:

```ts
// shared/services/apiClient.ts
export const apiClient = {
  get: <T>(url: string, config?: RequestInit) => {/* ... */},
  post: <T>(url: string, body: unknown, config?: RequestInit) => {/* ... */},
};
```

```ts
// features/auth/api/authClient.ts
import { apiClient } from '../../../shared/services/apiClient';

export const authClient = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload),
};
```

### 2. Abstraction Layers

- Screens/components should never use `fetch`/`axios` directly.
- Use feature API clients and services.

### 3. Error Handling Patterns

- Centralize low-level error parsing in `apiClient`.
- Map backend errors to domain-level error types in `services`.
- Surface user-friendly messages through a snackbar or error boundary.

### 4. Helper Utilities

- Generic helpers in `shared/utils`.
- Domain-specific helpers in `features/<feature>/services`.

### 5. Location of API Clients

- Feature-owned API clients go in `features/<feature>/api`.
- Only truly global clients should live under `shared/api`.

---

## H) Testing Guidelines

### 1. Required Tests

- New screens:
  - Smoke test that ensures render and key flows.
- New shared components:
  - Component tests with React Testing Library.

### 2. Structure & Naming

- Tests colocated with code:

  ```txt
  features/auth/routes/Login/Login.test.tsx
  shared/components/ui/Button/Button.test.tsx
  ```

- File suffix `.test.ts` or `.test.tsx`.

### 3. Test Types

- Unit tests for services and utils.
- Component tests for screens and UI.

---

## I) Developer Experience & Code Style

### 1. ESLint & Prettier

- ESLint config: `eslint.config.js`.
- Prettier config file required (`.prettierrc` or similar).
- Code should pass lint and build before merging.

### 2. File Naming Conventions

- Components: `PascalCase`, either `ComponentName.tsx` or `ComponentName/index.tsx`.
- Non-component logic: `camelCase` (`authService.ts`, `authClient.ts`).
- Tests: `*.test.tsx` colocated.

### 3. Accessibility Requirements

- Use semantic HTML tags.
- Ensure keyboard navigation support and visible focus.
- Label all controls properly.

### 4. Performance Practices

- Lazy-load route components using `React.lazy` in `routes.tsx`.
- Only memoize (`useMemo`, `useCallback`, `React.memo`) to fix measured performance issues.
- Avoid excessive context usage for frequently changing data.

---

## J) Shared Types Pattern

- Cross-feature, reusable DTOs and common types live under `shared/types/`.
  - Example: `shared/types/common.ts` contains `HydrateResponseDTO`, `UserResponseDTO`, and related shared types.
- Feature-specific domain types live under `features/<feature>/types/`.
  - Example: `features/auth/types/auth.ts` for WebAuthn-related types.
- Root-level `src/types/*.ts` files only re-export shared or feature types for backward compatibility and ambient declarations (e.g., `global.d.ts`).
  - Avoid adding new domain types directly under `src/types`; prefer `shared/types` or `features/<feature>/types`.

---

## K) LLM File Header Standard

Every `.ts` and `.tsx` file must begin with a concise 3-line comment block:

```ts
// FILE: <relative path from project root>
// PURPOSE: <single sentence describing the file’s responsibility and why it exists>
// NOTES: <single sentence highlighting key architectural/contextual details>
```

Rules:
- PURPOSE describes role in broader architecture (not just restating mechanics).
- NOTES capture contextual boundaries (routing role, provider usage, lazy loading, global state, auth relevance, etc.).
- Keep lines short, consistent, and updated if file responsibilities change.
- Do not include additional preamble lines before these three.

Examples (taken from current codebase):

```ts
// FILE: src/app/providers/AppProvider.tsx
// PURPOSE: Root composition assembling theme, router, and global context providers for the entire app lifecycle.
// NOTES: Wraps AppRouter with ThemeProvider, BrowserRouter, Auth/Loading/Snackbar providers plus LoadingOverlay side-effect.
```

```ts
// FILE: src/features/auth/services/webauthnClient.ts
// PURPOSE: Orchestrates WebAuthn registration/authentication with backend to produce JWT for custom token sign-in.
// NOTES: Used by AuthProvider via registerCredential/authenticateCredential; depends on @passwordless-id/webauthn client and API.
```

---

## L) Adding New Global Providers

1. Implement provider in `core/<domain>/<Domain>Provider.tsx` + context + hook.
2. Integrate inside `AppProvider.tsx` (keep composition order logical: theme -> router -> auth -> other state -> side-effect components).
3. Expose a hook `use<Domain>()` that throws if not wrapped to enforce boundaries.
4. Document with header and update Section K examples if pattern differs.

---

## M) Conventions Recap

- Start feature-local, promote only when cross-feature.
- Always add/maintain 3-line header on every `.ts/.tsx` file.
- Use contexts for truly global concerns; prefer hooks/services for domain logic.
- Keep route definitions declarative in `routes.tsx`.
- Align new UI with theme tokens.
- Fail fast on env validation (do not bypass `shared/config/env.ts`).

---

(End of Guidelines)
