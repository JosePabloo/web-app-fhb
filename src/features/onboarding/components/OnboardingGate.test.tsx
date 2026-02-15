// FILE: src/features/onboarding/components/OnboardingGate.test.tsx
// PURPOSE: Ensure onboarding gate triggers modal when profile status requires registration review.
// NOTES: Mocks auth context and modal host to observe calls.

import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import OnboardingGate from './OnboardingGate';

const showModal = vi.fn();
const closeModal = vi.fn();

vi.mock('../../../core/ui/useModalHost', () => ({
  useModalHost: () => ({ showModal, closeModal, activeModalId: null, resetSession: vi.fn() }),
}));

vi.mock('../../../core/auth/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    profile: {
      status: 'REGISTRATION_REVIEW_REQUIRED',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '123',
    },
  }),
}));

vi.mock('../../auth/services/userService', () => ({
  completeHydration: vi.fn().mockResolvedValue(null),
}));

describe('OnboardingGate', () => {
  it('invokes showModal when profile needs onboarding', () => {
    render(<OnboardingGate />);

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'onboarding',
        oncePerSession: true,
      })
    );
  });
});
