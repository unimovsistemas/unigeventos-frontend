import { useState, useCallback } from 'react';

export function useTurnstile() {
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileError, setTurnstileError] = useState<boolean>(false);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setTurnstileError(true);
  }, []);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken('');
    setTurnstileError(false);
  }, []);

  return {
    turnstileToken,
    turnstileError,
    handleTurnstileSuccess,
    handleTurnstileError,
    resetTurnstile,
    isTurnstileValid: !!turnstileToken && !turnstileError
  };
}