// FILE: src/features/auth/routes/LandingUnauthorized/index.tsx
// PURPOSE: Thin route composition for the public landing page sections.
// NOTES: Delegates design tokens, data, and section implementations to dedicated landing modules.

import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { fetchLandingImages } from './landingImageService';
import { heroBackgroundImage, projects, type ProjectId } from './landing.data';
import { layout } from './landing.theme';
import HeroSection from './sections/HeroSection';
import ProjectGrid from './sections/ProjectGrid';
import AboutSection from './sections/AboutSection';

type ImageLoadState = 'loading' | 'loaded' | 'error';

export default function LandingUnauthorized() {
  const [currentHeroBackgroundImage, setCurrentHeroBackgroundImage] = useState(heroBackgroundImage);
  const [projectImageOverrides, setProjectImageOverrides] = useState<Partial<Record<ProjectId, string>>>({});
  const [imageLoadState, setImageLoadState] = useState<ImageLoadState>('loading');

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadLandingImages = async () => {
      try {
        setImageLoadState('loading');
        const imagePayload = await fetchLandingImages(controller.signal);
        if (!isMounted) {
          return;
        }

        if (imagePayload.heroBackgroundImage) {
          setCurrentHeroBackgroundImage(imagePayload.heroBackgroundImage);
        }

        if (imagePayload.projectImages) {
          setProjectImageOverrides(imagePayload.projectImages);
        }

        setImageLoadState('loaded');
      } catch {
        if (!isMounted || controller.signal.aborted) {
          return;
        }
        setImageLoadState('error');
      }
    };

    void loadLandingImages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const resolvedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        image: projectImageOverrides[project.id] ?? project.image,
      })),
    [projectImageOverrides]
  );

  return (
    <Box sx={layout.page}>
      <HeroSection backgroundImage={currentHeroBackgroundImage} imageLoadState={imageLoadState} />
      <ProjectGrid projects={resolvedProjects} imageLoadState={imageLoadState} />
      <AboutSection />
    </Box>
  );
}
