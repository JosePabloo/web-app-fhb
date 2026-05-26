// FILE: src/features/auth/routes/Contact/contact.theme.ts
// PURPOSE: Central design tokens, spacing rhythm, and reusable style recipes for the contact route.
// NOTES: Mirrors the landing modular pattern so structure, typography, and interaction styles remain consistent.

export const s = (n: number) => `${n * 8}px`;

export const palette = {
  charcoal: '#1A1A1A',
  warmOffBlack: '#23201c',
  warmGray: '#E8E6E3',
  mutedSlate: '#5f6268',
} as const;

export const typography = {
  display: '"Cormorant Garamond", "Times New Roman", serif',
  body: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
} as const;

export const layout = {
  page: {
    minHeight: '100vh',
    backgroundColor: palette.warmGray,
  },
} as const;

export const sectionContainer = {
  maxWidth: { xs: '100%', md: s(165) },
  px: { xs: s(3), md: s(6) },
} as const;

export const space = {
  page: {
    pt: { xs: s(3), md: s(4) },
    pb: { xs: s(10), md: s(12) },
  },
  nav: {
    gap: s(3),
    dividerMt: { xs: s(1), md: s(1) },
    dividerMb: { xs: s(3), md: s(4) },
  },
  content: {
    gap: { xs: s(4), md: s(6) },
    columns: { xs: '1fr', md: '0.35fr 0.65fr' },
  },
  intro: {
    bodyMt: s(3),
    bodyMax: s(45),
  },
  form: {
    offsetY: { md: '-16px' },
    stackGap: s(3),
    rowGap: s(2),
    labelToInput: s(1),
    buttonMt: s(2),
    buttonMb: s(1),
    locationGap: s(0.5),
  },
} as const;

export const navLinkSx = {
  px: 0,
  minWidth: 0,
  textTransform: 'none',
  fontFamily: typography.body,
  fontSize: '0.92rem',
  fontWeight: 400,
  color: '#68645e',
  '&:hover': {
    backgroundColor: 'transparent',
    color: palette.warmOffBlack,
  },
  '&:focus-visible': {
    outline: `2px solid ${palette.warmOffBlack}`,
    outlineOffset: 4,
  },
} as const;

export const fieldLabelSx = {
  fontFamily: typography.body,
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#2f2b25',
  fontVariantCaps: 'all-small-caps',
} as const;

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    backgroundColor: 'rgba(248, 246, 242, 0.78)',
    transition: 'box-shadow 180ms ease',
    '& fieldset': {
      borderColor: 'rgba(35, 32, 28, 0.48)',
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(35, 32, 28, 0.62)',
    },
    '&.Mui-focused fieldset': {
      borderColor: palette.charcoal,
      borderWidth: '1.5px',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(26, 26, 26, 0.08)',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: typography.body,
    py: 1.5,
  },
  '& .MuiFormHelperText-root': {
    ml: 0,
    mt: 1,
    fontSize: '0.8rem',
  },
} as const;

export const primaryButtonSx = {
  px: s(3),
  py: s(1.5),
  borderRadius: '7px',
  textTransform: 'none',
  fontFamily: typography.body,
  letterSpacing: 0.45,
  fontWeight: 700,
  color: '#ffffff',
  backgroundColor: palette.charcoal,
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#111111',
  },
  '&:focus-visible': {
    outline: `2px solid ${palette.warmOffBlack}`,
    outlineOffset: 3,
  },
} as const;
