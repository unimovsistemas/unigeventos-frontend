import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Shield } from 'lucide-react';

interface PanelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPanel: (panel: 'admin' | 'user') => void;
}

export const PanelSelectionModal: React.FC<PanelSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectPanel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Selecionar Painel
            </h2>
            <p className="text-gray-600">
              Você possui acesso aos dois painéis. Escolha qual deseja acessar:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Painel Administrativo */}
            <Card 
              className="border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-all"
              onClick={() => onSelectPanel('admin')}
            >
              <CardHeader className="text-center pb-3">
                <div className="mx-auto mb-2 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Painel Administrativo</CardTitle>
                <CardDescription>
                  Gerencie eventos, usuários e configurações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPanel('admin');
                  }}
                >
                  Acessar Painel Admin
                </Button>
              </CardContent>
            </Card>

            {/* Painel do Usuário */}
            <Card 
              className="border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-all"
              onClick={() => onSelectPanel('user')}
            >
              <CardHeader className="text-center pb-3">
                <div className="mx-auto mb-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Painel do Usuário</CardTitle>
                <CardDescription>
                  Acesse suas inscrições, pagamentos e perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPanel('user');
                  }}
                >
                  Acessar Painel do Usuário
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Decidir depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};