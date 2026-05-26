// FILE: src/features/auth/routes/LandingUnauthorized/sections/TopNav.tsx
// PURPOSE: Landing-page top navigation for in-page anchors within the hero section.
// NOTES: Uses shared typography and focus recipes from landing theme to keep nav styling consistent.

import { Button, Stack } from '@mui/material';
import { navItems } from '../landing.data';
import { navFocusRing, space, typography } from '../landing.theme';

export default function TopNav() {
  return (
    <Stack
      direction="row"
      sx={{
        mx: 'auto',
        width: 'fit-content',
        gap: space.nav.gap,
      }}
    >
      {navItems.map((item) => (
        <Button
          key={item.label}
          component="a"
          href={item.href}
          sx={{
            px: 0,
            py: space.nav.itemY,
            minWidth: 0,
            textTransform: 'none',
            fontFamily: typography.body,
            fontSize: { xs: '0.9rem', md: '0.94rem' },
            fontWeight: 400,
            letterSpacing: 0.28,
            color: 'rgba(244, 242, 239, 0.78)',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'rgba(244, 242, 239, 0.98)',
            },
            ...navFocusRing,
          }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
}
