// FILE: src/core/invites/InviteContext.ts
// PURPOSE: Type definitions and context for managing the current invite state.

import { createContext } from 'react';
import type { InviteResponse } from '../../features/invites/types';

export interface InviteContextType {
  currentInvite: InviteResponse | null;
  setCurrentInvite: (invite: InviteResponse | null) => void;
}

export const InviteContext = createContext<InviteContextType | undefined>(undefined);
