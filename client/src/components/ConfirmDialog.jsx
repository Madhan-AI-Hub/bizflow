import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {t('yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
