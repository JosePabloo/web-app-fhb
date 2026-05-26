// FILE: src/features/auth/routes/LandingUnauthorized/sections/AboutSection.tsx
// PURPOSE: Closing brand section emphasizing durability and long-horizon building values.
// NOTES: Maintains high whitespace with split-layout hierarchy and restrained structural divider.

import { Box, Container, Typography } from '@mui/material';
import { palette, sectionContainer, space, typography } from '../landing.theme';

export default function AboutSection() {
  return (
    <Box
      id="about"
      component="section"
      sx={{
        pt: space.about.py,
        pb: space.about.py,
        backgroundColor: '#e5dfd6',
      }}
    >
      <Container maxWidth={false} sx={sectionContainer}>
        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(35, 32, 28, 0.2)',
            mb: space.about.ruleToContent,
          }}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.82fr 1.18fr' },
            gap: space.about.columnGap,
            alignItems: 'start',
          }}
        >
          <Typography
            sx={{
              fontFamily: typography.display,
              fontWeight: 600,
              color: palette.warmOffBlack,
              fontSize: { xs: '2.1rem', md: '3.05rem' },
              lineHeight: 1,
              letterSpacing: '-0.012em',
            }}
          >
            Built for Generations.
          </Typography>
          <Typography
            sx={{
              color: '#4f4d49',
              fontFamily: typography.body,
              maxWidth: space.about.bodyMax,
              fontSize: { xs: '1rem', md: '1.08rem' },
              lineHeight: 1.86,
            }}
          >
            In Minnesota&apos;s harshest seasons, our team builds with structure, discipline, and architectural clarity so
            each project performs for decades, not just for opening day.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
