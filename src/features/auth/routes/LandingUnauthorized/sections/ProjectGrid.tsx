// FILE: src/features/auth/routes/LandingUnauthorized/sections/ProjectGrid.tsx
// PURPOSE: Recent-work portfolio grid presenting featured project categories and summaries.
// NOTES: Uses shared card recipes and spacing tokens for consistent visual rhythm.

import { Box, Container, Skeleton, Stack, Typography } from '@mui/material';
import type { LandingProject } from '../landing.data';
import {
  palette,
  projectCardMediaSx,
  projectCardSx,
  sectionContainer,
  space,
  typography,
} from '../landing.theme';

type ProjectGridProps = {
  projects: LandingProject[];
  imageLoadState: 'loading' | 'loaded' | 'error';
};

export default function ProjectGrid({ projects, imageLoadState }: ProjectGridProps) {
  const isImageLoading = imageLoadState === 'loading';

  return (
    <Box
      id="recent-work"
      component="section"
      sx={{
        pt: space.projects.pt,
        pb: space.projects.pb,
        backgroundColor: palette.warmGray,
      }}
    >
      <Container maxWidth={false} sx={sectionContainer}>
        <Typography
          sx={{
            fontFamily: typography.display,
            color: palette.warmOffBlack,
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '3.15rem' },
            lineHeight: 1,
            letterSpacing: '-0.015em',
          }}
        >
          Recent Work
        </Typography>
        <Box
          aria-hidden
          sx={{
            mt: space.projects.titleToRule,
            width: '100%',
            maxWidth: space.projects.ruleMax,
            height: '1px',
            backgroundColor: 'rgba(35, 32, 28, 0.22)',
          }}
        />
        <Typography
          sx={{
            mt: space.projects.ruleToBody,
            color: palette.mutedSlate,
            fontFamily: typography.body,
            maxWidth: space.projects.bodyMax,
            lineHeight: 1.7,
          }}
        >
          Built for generations with precision in every layer, from structural planning to finish detail.
        </Typography>
        {imageLoadState === 'error' && (
          <Typography
            sx={{
              mt: space.projects.statusToBody,
              color: '#6d675f',
              fontFamily: typography.body,
              fontSize: '0.86rem',
              letterSpacing: 0.2,
            }}
          >
            Showing fallback project imagery while the feed reconnects.
          </Typography>
        )}

        <Box
          sx={{
            mt: space.projects.bodyToGrid,
            display: 'grid',
            gap: space.projects.gridGap,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {projects.map((project) => (
            <Box key={project.title} sx={projectCardSx}>
              {isImageLoading ? (
                <Skeleton
                  data-testid="landing-project-image-skeleton"
                  variant="rectangular"
                  animation="wave"
                  sx={{
                    ...projectCardMediaSx,
                    transform: 'none',
                    backgroundColor: 'rgba(79, 77, 73, 0.14)',
                  }}
                />
              ) : (
                <Box component="img" src={project.image} alt={project.alt} sx={projectCardMediaSx} />
              )}
              <Box sx={{ p: space.projects.textPadding }}>
                {isImageLoading ? (
                  <Stack spacing={space.projects.titleToBody}>
                    <Skeleton variant="text" animation="wave" width="42%" height={16} />
                    <Skeleton variant="text" animation="wave" width="84%" height={34} />
                    <Skeleton variant="text" animation="wave" width="96%" />
                    <Skeleton variant="text" animation="wave" width="88%" />
                  </Stack>
                ) : (
                  <>
                    <Typography
                      sx={{
                        color: '#4b433b',
                        fontFamily: typography.body,
                        fontSize: '0.74rem',
                        textTransform: 'uppercase',
                        letterSpacing: 2.2,
                        fontWeight: 700,
                        fontVariantCaps: 'all-small-caps',
                      }}
                    >
                      {project.category}
                    </Typography>
                    <Typography
                      sx={{
                        mt: space.projects.labelToTitle,
                        color: palette.warmOffBlack,
                        fontFamily: typography.display,
                        fontWeight: 600,
                        fontSize: '1.5rem',
                        lineHeight: 1.08,
                      }}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: space.projects.titleToBody,
                        color: palette.mutedSlate,
                        fontFamily: typography.body,
                        lineHeight: 1.68,
                      }}
                    >
                      {project.body}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
