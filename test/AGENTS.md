# Testing Guidelines (Template)

- Tooling: Vitest + React Testing Library with jest-dom matchers (configured in `vitest.config.ts` and `test/setup.ts`). Run via `npm run test`.
- Placement: co-locate tests beside code (`*.test.ts(x)`) under `src/...` or `test/` for global helpers. Keep fixtures/mocks in the owning feature or shared folder.
- Scope: cover global providers (Auth, ModalHost, Loading), routing guards, shared utilities/components, and critical flows (auth hydration, once-per-session modals).
- Patterns: mock network/auth services; prefer user-event for interaction; assert accessibility-friendly selectors when possible. Avoid real Firebase/API calls.
- Performance: keep tests fast and isolated; no snapshots for large trees. Use jest-dom matchers for clarity (`toBeInTheDocument`, `toHaveAttribute`, etc.).
