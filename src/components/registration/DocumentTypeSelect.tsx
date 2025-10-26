import { ChevronDown, FileText, CreditCard } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface DocumentTypeOption {
  value: 'CPF' | 'RG';
  label: string;
  icon: ReactNode;
  description: string;
  format: string;
}

interface DocumentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const documentTypeOptions: DocumentTypeOption[] = [
  { 
    value: 'CPF', 
    label: 'CPF', 
    icon: <CreditCard className="h-4 w-4" />, 
    description: 'Cadastro de Pessoa Física',
    format: '000.000.000-00'
  },
  { 
    value: 'RG', 
    label: 'RG', 
    icon: <FileText className="h-4 w-4" />, 
    description: 'Registro Geral (Carteira de Identidade)',
    format: '00.000.000-0'
  }
];

export function DocumentTypeSelect({ value, onChange, error, disabled }: DocumentTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = documentTypeOptions.find(option => option.value === value);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Tipo de Documento <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-between ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 focus:outline-none focus:ring-2'}`}
        >
          <div className="flex items-center space-x-2">
            {selectedOption ? (
              <>
                <span className="text-orange-600">{selectedOption.icon}</span>
                <span className="text-gray-900 font-medium">{selectedOption.label}</span>
                <span className="text-gray-500 text-sm">- {selectedOption.description}</span>
              </>
            ) : (
              <span className="text-gray-500">Selecione o tipo de documento</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {documentTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full p-3 text-left hover:bg-orange-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? 'bg-orange-50 text-orange-700' : 'text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className={`mt-1 ${value === option.value ? 'text-orange-600' : 'text-gray-600'}`}>
                    {option.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{option.format}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {selectedOption && (
        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          📋 Formato esperado: {selectedOption.format}
        </p>
      )}
    </div>
  );
}