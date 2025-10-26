import { useEffect, useRef, useState } from 'react';

interface CloudflareTurnstileProps {
  onSuccess: (token: string) => void;
  onError: () => void;
  siteKey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function CloudflareTurnstile({ 
  onSuccess, 
  onError, 
  siteKey,
  theme = 'light',
  size = 'normal'
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carregar o script do Turnstile se ainda não foi carregado
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else if (window.turnstile) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && window.turnstile && containerRef.current) {
      // Renderizar o widget Turnstile
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onSuccess,
        'error-callback': onError,
        theme,
        size,
      });
      setWidgetId(id);
    }

    // Cleanup function
    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [isLoaded, siteKey, onSuccess, onError, theme, size]);

  const reset = () => {
    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  };

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
    </div>
  );
}