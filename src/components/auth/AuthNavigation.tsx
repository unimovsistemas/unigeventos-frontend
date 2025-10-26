import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthNavigationProps {
  currentPage: 'login' | 'register' | 'forgot-password';
  onBack?: () => void;
  showHomeLink?: boolean;
}

export function AuthNavigation({ currentPage, onBack, showHomeLink = true }: AuthNavigationProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'login':
        return 'Login';
      case 'register':
        return 'Cadastro';
      case 'forgot-password':
        return 'Recuperar Senha';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        {showHomeLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/events'}
            className="text-gray-600 hover:text-gray-900"
          >
            <Home className="h-4 w-4 mr-1" />
            Eventos
          </Button>
        )}
        
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        {getPageTitle()}
      </div>
    </div>
  );
}