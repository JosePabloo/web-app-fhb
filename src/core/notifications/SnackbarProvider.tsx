// FILE: src/core/notifications/SnackbarProvider.tsx
// PURPOSE: Supplies snackbar error notification context and renders MUI Snackbar/Alert UI layer.
// NOTES: Provides showError to consumers; mounted at app root so errors from any feature surface globally.

import React, { useCallback, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarContext } from './SnackbarContext';

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const showError = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ showError }), [showError]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert severity="error" onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
