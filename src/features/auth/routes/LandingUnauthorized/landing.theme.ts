// FILE: src/features/auth/routes/LandingUnauthorized/landing.theme.ts
// PURPOSE: Central design tokens and shared style recipes for the public landing page modules.
// NOTES: Exposes spacing helper, palette/typography, shared container rules, focus styles, and component SX recipes.

export const s = (n: number) => `${n * 8}px`;

export const palette = {
  charcoal: '#1A1A1A',
  warmOffBlack: '#23201c',
  warmGray: '#E8E6E3',
  mutedStone: '#CFCAC4',
  mutedSlate: '#5f6268',
  textOnDark: '#F4F2EF',
} as const;

export const typography = {
  display: '"Cormorant Garamond", "Times New Roman", serif',
  body: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
} as const;

export const layout = {
  page: {
    minHeight: '100vh',
    backgroundColor: palette.warmGray,
    overflowX: 'clip',
  },
} as const;

export const sectionContainer = {
  maxWidth: { xs: '100%', md: s(165) },
  px: { xs: s(3), md: s(6) },
} as const;

export const space = {
  nav: {
    gap: { xs: s(3), md: s(4) },
    itemY: s(0.5),
  },
  hero: {
    pt: { xs: s(5), md: s(6) },
    pb: { xs: s(11), md: s(14) },
    contentMax: { xs: '100%', md: s(90) },
    eyebrowToHeadline: s(1.5),
    headlineToBody: s(2.75),
    bodyMax: s(75),
    bodyToCta: s(4.25),
    ctaToStatus: s(1.5),
    locationDot: s(0.5),
  },
  projects: {
    pt: { xs: s(12), md: s(17) },
    pb: { xs: s(11), md: s(15) },
    titleToRule: { xs: s(2.25), md: s(2.75) },
    ruleToBody: { xs: s(2.25), md: s(2.75) },
    statusToBody: s(1.5),
    bodyToGrid: { xs: s(5), md: s(7.25) },
    gridGap: { xs: s(3), md: s(4) },
    textPadding: s(2.75),
    labelToTitle: s(1.125),
    titleToBody: s(1),
    ruleMax: s(122.5),
    bodyMax: s(95),
  },
  about: {
    py: { xs: s(12), md: s(16.5) },
    ruleToContent: { xs: s(5), md: s(7.5) },
    columnGap: { xs: s(4.25), md: s(8.5) },
    bodyMax: { xs: '100%', md: s(85) },
  },
} as const;

export const focusRingOnDark = {
  '&:focus-visible': {
    outline: '2px solid rgba(244, 242, 239, 0.8)',
    outlineOffset: 3,
  },
} as const;

export const navFocusRing = {
  '&:focus-visible': {
    outline: '2px solid rgba(244, 242, 239, 0.8)',
    outlineOffset: 4,
  },
} as const;

export const primaryCtaSx = {
  px: s(3.875),
  py: s(1.525),
  borderRadius: '7px',
  textTransform: 'none',
  fontFamily: typography.body,
  fontWeight: 700,
  letterSpacing: 0.3,
  color: '#ffffff',
  backgroundColor: palette.charcoal,
  boxShadow: '0 10px 22px rgba(0, 0, 0, 0.28)',
  '&:hover': {
    backgroundColor: '#111111',
  },
  ...focusRingOnDark,
} as const;

export const secondaryCtaSx = {
  px: s(3.75),
  py: s(1.475),
  borderRadius: '7px',
  textTransform: 'none',
  fontFamily: typography.body,
  fontWeight: 600,
  color: palette.textOnDark,
  border: '1px solid rgba(244, 242, 239, 0.52)',
  backgroundColor: 'rgba(26, 26, 26, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(26, 26, 26, 0.36)',
    borderColor: 'rgba(244, 242, 239, 0.7)',
  },
  ...focusRingOnDark,
} as const;

export const projectCardSx = {
  backgroundColor: '#f8f6f2',
  border: '1px solid rgba(35, 32, 28, 0.2)',
  borderRadius: '8px',
  overflow: 'hidden',
} as const;

export const projectCardMediaSx = {
  width: '100%',
  height: 220,
  objectFit: 'cover',
  display: 'block',
} as const;
