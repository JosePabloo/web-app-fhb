// FILE: src/core/invites/InviteProvider.tsx
// PURPOSE: Provides global invite context for storing the current invite during creation/display flows.

import { useState } from 'react';
import { InviteContext, type InviteContextType } from './InviteContext';
import type { InviteResponse } from '../../features/invites/types';

export const InviteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentInvite, setCurrentInvite] = useState<InviteResponse | null>(null);

  const value: InviteContextType = {
    currentInvite,
    setCurrentInvite,
  };

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
};
