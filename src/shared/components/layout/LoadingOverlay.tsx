// FILE: src/shared/components/layout/LoadingOverlay.tsx
// PURPOSE: Global backdrop spinner reflecting isLoading from LoadingContext to signal in-flight operations.
// NOTES: Mounted once in AppProvider outside routing; visibility controlled by LoadingProvider state.
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoading } from '../../../core/loading/useLoading';

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
