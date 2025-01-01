import { Alert, Snackbar } from '@mui/material';

interface SnackbarNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export function SnackbarNotification({
  open,
  onClose,
  message,
  severity,
}: SnackbarNotificationProps) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
