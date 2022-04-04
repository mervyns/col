import { Alert, Snackbar } from '@mui/material';

import React from 'react';
import { TransactionReceipt } from '../utils/types';

interface Props {
  alertType: TransactionReceipt;
  closeAlert: () => void;
  toastMessage: string;
}

const ToastAlert: React.VFC<Props> = (props: Props) => {
  const { alertType, closeAlert, toastMessage } = props;
  return (
    <Snackbar
      open={!!alertType}
      autoHideDuration={3000}
      onClose={closeAlert}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Alert
        onClose={closeAlert}
        severity={
          alertType === TransactionReceipt.SUCCESS ? 'success' : 'error'
        }
        sx={{ width: '100%' }}
      >
        {toastMessage}
      </Alert>
    </Snackbar>
  );
};

export default ToastAlert;
