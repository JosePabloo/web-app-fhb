// FILE: src/features/onboarding/components/OnboardingGate.tsx
// PURPOSE: Listens for NEW users post-hydration and triggers the global modal host to show the onboarding dialog once per session.
// NOTES: Non-visual component; relies on ModalHostProvider to render the dialog.

import { useEffect } from 'react';
import { useAuth } from '../../../core/auth/useAuth';
import { useModalHost } from '../../../core/ui/ModalHostProvider';
import OnboardingDialog from './OnboardingDialog';
import { completeHydration } from '../../auth/services/userService';

export default function OnboardingGate() {
  const { profile, isAuthenticated } = useAuth();
  const { showModal, closeModal } = useModalHost();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (profile?.status !== 'REGISTRATION_REVIEW_REQUIRED') return;

    showModal({
      id: 'onboarding',
      component: OnboardingDialog,
      props: {
        open: true,
        onClose: () => closeModal('onboarding'),
        defaultValues: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber ?? '',
        },
        onComplete: async (data) => {
          await completeHydration(
            {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              photoFile: data.photoFile,
            }
          );
          closeModal('onboarding');
        },
      },
      oncePerSession: true,
    });
  }, [
    closeModal,
    isAuthenticated,
    profile?.firstName,
    profile?.lastName,
    profile?.phoneNumber,
    profile?.status,
    showModal,
  ]);

  return null;
}
