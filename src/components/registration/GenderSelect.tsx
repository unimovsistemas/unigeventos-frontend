import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface GenderOption {
  value: 'MALE' | 'FEMALE';
  label: string;
  icon: string;
}

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const genderOptions: GenderOption[] = [
  { value: 'MALE', label: 'Masculino', icon: '👨' },
  { value: 'FEMALE', label: 'Feminino', icon: '👩' }
];

export function GenderSelect({ value, onChange, error, disabled }: GenderSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = genderOptions.find(option => option.value === value);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Gênero <span className="text-red-500 ml-1">*</span>
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
                <span className="text-lg">{selectedOption.icon}</span>
                <span className="text-gray-900">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-500">Selecione seu gênero</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-3 text-left hover:bg-orange-50 flex items-center space-x-2 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? 'bg-orange-50 text-orange-700' : 'text-gray-900'
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span>{option.label}</span>
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
    </div>
  );
}