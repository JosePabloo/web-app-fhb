# Landing Page Maintenance Skills

This document explains how the public landing page is structured and how to update it safely.

## Architecture

Landing route files live in:

- `src/features/auth/routes/LandingUnauthorized/index.tsx`
- `src/features/auth/routes/LandingUnauthorized/landing.theme.ts`
- `src/features/auth/routes/LandingUnauthorized/landing.data.ts`
- `src/features/auth/routes/LandingUnauthorized/sections/TopNav.tsx`
- `src/features/auth/routes/LandingUnauthorized/sections/HeroSection.tsx`
- `src/features/auth/routes/LandingUnauthorized/sections/ProjectGrid.tsx`
- `src/features/auth/routes/LandingUnauthorized/sections/AboutSection.tsx`

Pattern:

1. `index.tsx` is composition only.
2. `landing.theme.ts` owns palette, typography, spacing scale, and reusable `sx` recipes.
3. `landing.data.ts` owns content and media references.
4. `sections/*` render UI from theme + data.

The Contact route follows the same pattern:

- `src/features/auth/routes/Contact/index.tsx`
- `src/features/auth/routes/Contact/contact.theme.ts`
- `src/features/auth/routes/Contact/contact.data.ts`
- `src/features/auth/routes/Contact/sections/*`

## Update Workflow

1. Update copy and links in `landing.data.ts`.
2. Update visual rules in `landing.theme.ts`.
3. Update section composition only when structure changes.
4. Keep `index.tsx` thin. Do not move large style objects or content arrays back into `index.tsx`.

## Image and Asset Rules

1. Import images from `src/assets/*` in `landing.data.ts`.
2. Pass background/media as explicit props where possible.
3. Do not hard-code `/public/...` URL strings inside section components.

## Spacing and Rhythm Rules

1. Use `s(n)` and `space.*` tokens from `landing.theme.ts`.
2. Avoid ad-hoc decimals in section files.
3. Add new spacing values to the `space` object first, then consume them in sections.

## Component Recipe Rules

Reuse theme recipes instead of redefining styles:

- CTA buttons: `primaryCtaSx`, `secondaryCtaSx`
- Cards: `projectCardSx`, `projectCardMediaSx`
- Focus styles: `focusRingOnDark`, `navFocusRing`
- Containers: `sectionContainer`

## Common Changes

### Swap hero image

1. Import the new asset in `landing.data.ts`.
2. Update `heroBackgroundImage` export.
3. Keep `HeroSection` unchanged if prop shape is unchanged.

### Add a project card

1. Add an item to `projects` in `landing.data.ts`.
2. Ensure `title`, `category`, `body`, `image`, and `alt` are present.

### Adjust section spacing

1. Edit `space.projects` or `space.about` in `landing.theme.ts`.
2. Do not set one-off margin/padding values directly in section components.

## Validation Checklist

Run before merging:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`

If lint fails globally from unrelated baseline issues, run scoped lint on touched files and note it in the PR.
