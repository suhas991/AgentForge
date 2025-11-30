// src/hooks/useNotification.js
import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    onConfirm: null,
  });

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback((message, title = '', type = 'info') => {
    return new Promise((resolve) => {
      setNotification({
        isOpen: true,
        title,
        message,
        type,
        confirmText: 'OK',
        showCancel: false,
        onConfirm: () => resolve(true),
      });
    });
  }, []);

  const showConfirm = useCallback((message, title = 'Confirm', options = {}) => {
    return new Promise((resolve) => {
      setNotification({
        isOpen: true,
        title,
        message,
        type: options.type || 'confirm',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        showCancel: true,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    return showAlert(message, title, 'success');
  }, [showAlert]);

  const showWarning = useCallback((message, title = 'Warning') => {
    return showAlert(message, title, 'warning');
  }, [showAlert]);

  const showError = useCallback((message, title = 'Error') => {
    return showAlert(message, title, 'error');
  }, [showAlert]);

  const showInfo = useCallback((message, title = 'Information') => {
    return showAlert(message, title, 'info');
  }, [showAlert]);

  return {
    notification,
    closeNotification,
    showAlert,
    showConfirm,
    showSuccess,
    showWarning,
    showError,
    showInfo,
  };
};
