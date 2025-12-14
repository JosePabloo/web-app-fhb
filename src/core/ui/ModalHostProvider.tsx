// FILE: src/core/ui/ModalHostProvider.tsx
// PURPOSE: Global modal host that ensures a single dialog is rendered at a time and supports once-per-session modals.
// NOTES: Consumers call useModalHost().showModal(...) with a component; the host injects onClose and prevents repeats when requested.

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export interface ModalDescriptor<TProps = Record<string, unknown>> {
  id: string;
  component: React.ComponentType<TProps>;
  props?: TProps;
  oncePerSession?: boolean;
}

interface ModalHostContextValue {
  showModal: <TProps>(descriptor: ModalDescriptor<TProps>) => void;
  closeModal: (id?: string) => void;
  activeModalId: string | null;
  resetSession: () => void;
}

const ModalHostContext = createContext<ModalHostContextValue | undefined>(undefined);

export function ModalHostProvider({ children }: { children: React.ReactNode }) {
  const dismissedIds = useRef<Set<string>>(new Set());
  const [activeModal, setActiveModal] = useState<ModalDescriptor | null>(null);

  const closeModal = useCallback((id?: string) => {
    setActiveModal((current) => {
      if (!current) return null;
      const isTarget = id ? current.id === id : true;
      if (!isTarget) return current;
      if (current.oncePerSession) {
        dismissedIds.current.add(current.id);
      }
      return null;
    });
  }, []);

  const showModal = useCallback(
    <TProps,>(descriptor: ModalDescriptor<TProps>) => {
      if (descriptor.oncePerSession && dismissedIds.current.has(descriptor.id)) {
        return;
      }
      setActiveModal(descriptor as ModalDescriptor);
    },
    []
  );

  const resetSession = useCallback(() => {
    dismissedIds.current.clear();
    setActiveModal(null);
  }, []);

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
      activeModalId: activeModal?.id ?? null,
      resetSession,
    }),
    [activeModal?.id, closeModal, resetSession, showModal]
  );

  const ActiveComponent = activeModal?.component as React.ComponentType<Record<string, unknown>> | undefined;
  const injectedProps =
    activeModal && ActiveComponent
      ? {
          ...(activeModal.props ?? {}),
          onClose: () => closeModal(activeModal.id),
        }
      : null;

  return (
    <ModalHostContext.Provider value={value}>
      {children}
      {ActiveComponent && injectedProps ? <ActiveComponent {...injectedProps} /> : null}
    </ModalHostContext.Provider>
  );
}

export function useModalHost(): ModalHostContextValue {
  const ctx = useContext(ModalHostContext);
  if (!ctx) throw new Error('useModalHost must be used within ModalHostProvider');
  return ctx;
}
