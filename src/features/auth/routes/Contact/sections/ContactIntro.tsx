// FILE: src/features/auth/routes/Contact/sections/ContactIntro.tsx
// PURPOSE: Left-column consultation heading and supporting copy for the contact split layout.
// NOTES: Keeps copy isolated from form logic to simplify tone and messaging updates.

import { Box, Typography } from '@mui/material';
import { contactCopy } from '../contact.data';
import { space, typography } from '../contact.theme';

export default function ContactIntro() {
  return (
    <Box>
      <Typography
        component="h1"
        sx={{
          fontFamily: typography.display,
          color: '#16130f',
          fontWeight: 600,
          fontSize: { xs: '2.45rem', md: '3.85rem' },
          lineHeight: 0.95,
        }}
      >
        {contactCopy.heading}
      </Typography>
      <Typography
        sx={{
          mt: space.intro.bodyMt,
          fontFamily: typography.body,
          color: 'rgba(79, 77, 73, 0.82)',
          lineHeight: 1.82,
          maxWidth: space.intro.bodyMax,
        }}
      >
        {contactCopy.subtext}
      </Typography>
    </Box>
  );
}
