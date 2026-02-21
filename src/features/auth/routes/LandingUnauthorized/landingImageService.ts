// FILE: src/features/auth/routes/LandingUnauthorized/landingImageService.ts
// PURPOSE: Fetches landing-page image assets from the API so visuals can be state-driven instead of hard-coded.
// NOTES: Returns partial payloads; callers should always merge with local fallback images.

import { spreadSyncApi } from '../../../../shared/services/apiClient';
import type { LandingImagePayload, ProjectId } from './landing.data';

type LandingImageApiResponse = {
  heroBackgroundImage?: string;
  projectImages?: Partial<Record<ProjectId, string>>;
  projects?: Array<{
    id: ProjectId;
    image: string;
  }>;
};

const LANDING_IMAGE_ENDPOINT = '/public/landing/images';

export async function fetchLandingImages(signal?: AbortSignal): Promise<LandingImagePayload> {
  const { data } = await spreadSyncApi.get<LandingImageApiResponse>(LANDING_IMAGE_ENDPOINT, {
    signal,
  });

  if (!data) {
    return {};
  }

  const mappedProjectImages: Partial<Record<ProjectId, string>> =
    data.projects?.reduce<Partial<Record<ProjectId, string>>>((acc, project) => {
      acc[project.id] = project.image;
      return acc;
    }, {}) ?? {};

  return {
    heroBackgroundImage: data.heroBackgroundImage,
    projectImages: {
      ...mappedProjectImages,
      ...data.projectImages,
    },
  };
}
