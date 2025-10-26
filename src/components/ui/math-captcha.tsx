import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { useMathCaptcha } from '@/hooks/useMathCaptcha';
import { useEffect } from 'react';

interface MathCaptchaProps {
  onValidationChange: (isValid: boolean) => void;
  error?: string;
}

export function MathCaptcha({ onValidationChange, error }: MathCaptchaProps) {
  const { 
    captcha, 
    userAnswer, 
    isValid, 
    handleAnswerChange, 
    reset 
  } = useMathCaptcha();

  // Monitora mudanças na validação e notifica o componente pai
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  const handleAnswerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleAnswerChange(value);
  };

  const handleRefresh = () => {
    reset();
    onValidationChange(false);
  };

  return (
    <div className="space-y-3">
      {/* Captcha Display */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="text-lg font-mono font-bold text-gray-800 bg-white px-3 py-2 rounded border">
            {captcha}
          </div>
          {isValid && (
            <div className="text-green-600 text-sm font-medium">
              ✓ Correto
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="text-gray-600 hover:text-gray-800"
          title="Gerar nova pergunta"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Answer Input */}
      <FormField
        label="Verificação de Segurança"
        placeholder="Digite a resposta"
        value={userAnswer}
        onChange={handleAnswerInput}
        error={error}
        required
        helperText="Resolva a operação matemática acima para continuar"
        className={isValid ? "border-green-300 focus:border-green-500" : ""}
      />
    </div>
  );
}