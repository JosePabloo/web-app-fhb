// FILE: src/core/invites/useInvite.ts
// PURPOSE: Hook to consume InviteContext giving components access to current invite state.

import { useContext } from 'react';
import { InviteContext, type InviteContextType } from './InviteContext';

export function useInvite(): InviteContextType {
  const context = useContext(InviteContext);
  if (context === undefined) {
    throw new Error('useInvite must be used within an InviteProvider');
  }
  return context;
}
