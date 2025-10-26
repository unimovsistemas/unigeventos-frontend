import { useState, useCallback } from 'react';

interface UseAuthStateReturn {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
  handleAsyncAction: <T>(action: () => Promise<T>) => Promise<T | null>;
}

export function useAuthState(): UseAuthStateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorMessage = useCallback((error: string | null) => {
    setError(error);
    if (error) {
      setSuccess(null); // Clear success when showing error
    }
  }, []);

  const setSuccessMessage = useCallback((success: string | null) => {
    setSuccess(success);
    if (success) {
      setError(null); // Clear error when showing success
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleAsyncAction = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    clearMessages();
    
    try {
      const result = await action();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro inesperado';
      setErrorMessage(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages, setErrorMessage]);

  return {
    isLoading,
    error,
    success,
    setLoading,
    setError: setErrorMessage,
    setSuccess: setSuccessMessage,
    clearMessages,
    handleAsyncAction
  };
}