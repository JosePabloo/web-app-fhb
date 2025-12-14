// FILE: src/core/ui/ModalHostProvider.test.tsx
// PURPOSE: Ensure the modal host renders/clears modals, respects once-per-session, and resets state when requested.
// NOTES: Drives the host API directly to avoid double-render quirks.

import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { ModalHostProvider, useModalHost } from './ModalHostProvider';

function TestModal({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <div>
      <p>{label}</p>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

function Capture({ onReady }: { onReady: (controls: ReturnType<typeof useModalHost>) => void }) {
  const controls = useModalHost();
  useEffect(() => {
    onReady(controls);
  }, [controls, onReady]);
  return null;
}

const renderWithHost = (cb: (controls: ReturnType<typeof useModalHost>) => void) =>
  render(
    <ModalHostProvider>
      <Capture onReady={cb} />
    </ModalHostProvider>
  );

describe('ModalHostProvider', () => {
  it('renders and closes a modal', () => {
    let controls: ReturnType<typeof useModalHost> | undefined;
    renderWithHost((c) => {
      controls = c;
    });
    if (!controls) throw new Error('controls not set');

    act(() => {
      controls!.showModal({
        id: 'test-modal',
        component: TestModal,
        props: { label: 'Test Modal', onClose: () => controls!.closeModal('test-modal') },
      });
    });
    expect(screen.getByText(/Test Modal/)).toBeInTheDocument();

    act(() => {
      controls!.closeModal('test-modal');
    });
    expect(screen.queryByText(/Test Modal/)).not.toBeInTheDocument();
  });

  it('blocks once-per-session modal after dismissal', () => {
    let controls: ReturnType<typeof useModalHost> | undefined;
    renderWithHost((c) => {
      controls = c;
    });
    if (!controls) throw new Error('controls not set');

    act(() => {
      controls!.showModal({
        id: 'test-modal',
        component: TestModal,
        props: { label: 'Test Modal', onClose: () => controls!.closeModal('test-modal') },
        oncePerSession: true,
      });
    });
    expect(screen.getByText(/Test Modal/)).toBeInTheDocument();

    act(() => controls!.closeModal('test-modal'));
    expect(screen.queryByText(/Test Modal/)).not.toBeInTheDocument();

    act(() => {
      controls!.showModal({
        id: 'test-modal',
        component: TestModal,
        props: { label: 'Test Modal', onClose: () => controls!.closeModal('test-modal') },
        oncePerSession: true,
      });
    });
    expect(screen.queryByText(/Test Modal/)).not.toBeInTheDocument();
  });

  it('allows resetSession to re-show a once-per-session modal', () => {
    let controls: ReturnType<typeof useModalHost> | undefined;
    renderWithHost((c) => {
      controls = c;
    });
    if (!controls) throw new Error('controls not set');

    act(() => {
      controls!.showModal({
        id: 'test-modal',
        component: TestModal,
        props: { label: 'Test Modal', onClose: () => controls!.closeModal('test-modal') },
        oncePerSession: true,
      });
    });
    expect(screen.getByText(/Test Modal/)).toBeInTheDocument();

    act(() => controls!.closeModal('test-modal'));
    expect(screen.queryByText(/Test Modal/)).not.toBeInTheDocument();

    act(() => {
      controls!.showModal({
        id: 'test-modal',
        component: TestModal,
        props: { label: 'Test Modal', onClose: () => controls!.closeModal('test-modal') },
        oncePerSession: true,
      });
    });
    expect(screen.queryByText(/Test Modal/)).not.toBeInTheDocument();

    act(() => controls!.resetSession());
    act(() => {
      controls!.showModal({
        id: 'test-modal',
        component: TestModal,
        props: { label: 'Test Modal', onClose: () => controls!.closeModal('test-modal') },
        oncePerSession: true,
      });
    });
    expect(screen.getByText(/Test Modal/)).toBeInTheDocument();
  });
});
