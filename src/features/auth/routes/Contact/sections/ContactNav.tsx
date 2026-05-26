// FILE: src/features/auth/routes/Contact/sections/ContactNav.tsx
// PURPOSE: Contact-page top navigation and structural divider for public route consistency.
// NOTES: Reuses centralized nav data and typography tokens to keep chrome aligned with landing.

import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { contactCopy, navItems } from '../contact.data';
import { navLinkSx, space, typography } from '../contact.theme';

export default function ContactNav() {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontFamily: typography.body, color: '#312f2b', fontWeight: 600 }}>
          {contactCopy.brand}
        </Typography>
        <Stack direction="row" spacing={space.nav.gap}>
          {navItems.map((item) => (
            <Button key={item.label} component={RouterLink} to={item.to} sx={navLinkSx}>
              {item.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Box
        aria-hidden
        sx={{
          height: '1px',
          width: '100%',
          backgroundColor: 'rgba(35, 32, 28, 0.2)',
          mt: space.nav.dividerMt,
          mb: space.nav.dividerMb,
        }}
      />
    </>
  );
}
