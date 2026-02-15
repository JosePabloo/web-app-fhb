// FILE: src/core/ui/useModalHost.ts
// PURPOSE: Hook to consume ModalHostContext.

import { useContext } from 'react';
import { ModalHostContext, type ModalHostContextValue } from './ModalHostContext';

export function useModalHost(): ModalHostContextValue {
  const ctx = useContext(ModalHostContext);
  if (!ctx) throw new Error('useModalHost must be used within ModalHostProvider');
  return ctx;
}
