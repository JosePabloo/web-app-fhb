// FILE: src/features/auth/routes/LandingUnauthorized/sections/HeroSection.tsx
// PURPOSE: Hero section presenting premium positioning, primary CTAs, and top-level brand/location context.
// NOTES: Background image and copy are deliberately restrained; styling is sourced from shared landing theme tokens.

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Button, Container, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  palette,
  primaryCtaSx,
  secondaryCtaSx,
  sectionContainer,
  space,
  s,
  typography,
} from '../landing.theme';
import TopNav from './TopNav';

type HeroSectionProps = {
  backgroundImage: string;
  imageLoadState: 'loading' | 'loaded' | 'error';
};

export default function HeroSection({ backgroundImage, imageLoadState }: HeroSectionProps) {
  const isImageLoading = imageLoadState === 'loading';

  return (
    <Box
      id="top"
      component="section"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: isImageLoading ? 'none' : `url(${backgroundImage})`,
        backgroundColor: '#12171d',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      {isImageLoading && (
        <Skeleton
          data-testid="landing-hero-image-skeleton"
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            transform: 'none',
            backgroundColor: 'rgba(244, 242, 239, 0.08)',
          }}
        />
      )}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(13, 16, 20, 0.36) 0%, rgba(15, 18, 22, 0.5) 44%, rgba(16, 18, 22, 0.78) 100%)',
          boxShadow: 'inset 0 0 220px rgba(0, 0, 0, 0.34)',
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          ...sectionContainer,
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          pt: space.hero.pt,
          pb: space.hero.pb,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <TopNav />

        <Box sx={{ maxWidth: space.hero.contentMax }}>
          <Typography
            sx={{
              fontFamily: typography.body,
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: 'rgba(244, 242, 239, 0.86)',
              fontWeight: 600,
              fontSize: '0.74rem',
            }}
          >
            Frost Haven Builders
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: space.hero.eyebrowToHeadline,
              fontFamily: typography.display,
              color: palette.textOnDark,
              fontWeight: 600,
              fontSize: { xs: '2.15rem', sm: '2.9rem', md: '4rem' },
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Crafting Modern Homes That Endure.
          </Typography>
          <Typography
            sx={{
              mt: space.hero.headlineToBody,
              fontFamily: typography.body,
              color: 'rgba(244, 242, 239, 0.88)',
              maxWidth: space.hero.bodyMax,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.76,
            }}
          >
            Custom residential builds designed for longevity and legacy.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: space.hero.bodyToCta, gap: s(1.5) }}>
            <Button component={RouterLink} to="/contact" variant="contained" sx={primaryCtaSx}>
              Start Your Project
            </Button>
            <Button component="a" href="#recent-work" sx={secondaryCtaSx}>
              View Portfolio
            </Button>
          </Stack>
          {isImageLoading && (
            <Skeleton
              variant="text"
              animation="wave"
              width={s(28)}
              sx={{
                mt: space.hero.ctaToStatus,
                fontSize: '0.9rem',
                backgroundColor: 'rgba(244, 242, 239, 0.18)',
              }}
            />
          )}
          {imageLoadState === 'error' && (
            <Typography
              sx={{
                mt: space.hero.ctaToStatus,
                fontFamily: typography.body,
                fontSize: '0.84rem',
                color: 'rgba(244, 242, 239, 0.7)',
                letterSpacing: 0.2,
              }}
            >
              Using fallback imagery while project visuals reconnect.
            </Typography>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={space.hero.locationDot}
          alignItems="center"
          sx={{ color: 'rgba(244, 242, 239, 0.82)' }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontFamily: typography.body, fontSize: '0.92rem' }}>Minneapolis, MN</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
