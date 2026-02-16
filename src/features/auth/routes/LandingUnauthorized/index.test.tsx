// FILE: src/features/auth/routes/LandingUnauthorized/index.test.tsx
// PURPOSE: Verifies landing image-state behavior for loading and API-failure scenarios.
// NOTES: Mocks landing image service to assert UI state messaging without real network calls.

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import LandingUnauthorized from './index';
import { fetchLandingImages } from './landingImageService';

vi.mock('./landingImageService', () => ({
  fetchLandingImages: vi.fn(),
}));

const mockedFetchLandingImages = vi.mocked(fetchLandingImages);

describe('LandingUnauthorized image state', () => {
  beforeEach(() => {
    mockedFetchLandingImages.mockReset();
  });

  it('shows loading imagery state while image API request is pending', async () => {
    mockedFetchLandingImages.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <LandingUnauthorized />
      </MemoryRouter>
    );

    expect(await screen.findByTestId('landing-hero-image-skeleton')).toBeInTheDocument();
    expect(await screen.findAllByTestId('landing-project-image-skeleton')).toHaveLength(3);
  });

  it('shows fallback imagery state when image API request fails', async () => {
    mockedFetchLandingImages.mockRejectedValue(new Error('failed'));

    render(
      <MemoryRouter>
        <LandingUnauthorized />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Using fallback imagery while project visuals reconnect/i)).toBeInTheDocument();
    expect(await screen.findByText(/Showing fallback project imagery while the feed reconnects/i)).toBeInTheDocument();
  });
});
