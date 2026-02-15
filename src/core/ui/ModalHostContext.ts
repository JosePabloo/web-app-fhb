// FILE: src/core/ui/ModalHostContext.ts
// PURPOSE: Type definitions and context for modal management.

import { createContext } from 'react';

export interface ModalDescriptor<TProps = Record<string, unknown>> {
  id: string;
  component: React.ComponentType<TProps>;
  props?: TProps;
  oncePerSession?: boolean;
}

export interface ModalHostContextValue {
  showModal: <TProps>(descriptor: ModalDescriptor<TProps>) => void;
  closeModal: (id?: string) => void;
  activeModalId: string | null;
  resetSession: () => void;
}

export const ModalHostContext = createContext<ModalHostContextValue | undefined>(undefined);
