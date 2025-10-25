import { ChevronDown, Car, Bus, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TransportationType } from '@/services/registrationService';

interface TransportationOption {
  value: TransportationType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface TransportationSelectProps {
  value: TransportationType;
  onChange: (value: TransportationType) => void;
  error?: string;
  disabled?: boolean;
}

const transportationOptions: TransportationOption[] = [
  { 
    value: 'PERSONAL', 
    label: 'Transporte Próprio', 
    icon: Car,
    description: 'Vou com meu próprio veículo ou carona'
  },
  { 
    value: 'EVENT_TRANSPORT', 
    label: 'Transporte do Evento', 
    icon: Bus,
    description: 'Utilizarei o transporte oferecido pelo evento'
  },
  { 
    value: 'NOT_APPLICABLE', 
    label: 'Não se Aplica', 
    icon: X,
    description: 'Evento online ou não preciso de transporte'
  }
];

export function TransportationSelect({ value, onChange, error, disabled }: TransportationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = transportationOptions.find(option => option.value === value);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (optionValue: TransportationType) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Como você irá ao evento? <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="relative" ref={dropdownRef}>
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
          <div className="flex items-center space-x-3">
            {selectedOption ? (
              <>
                <selectedOption.icon className="h-4 w-4 text-orange-600" />
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">{selectedOption.label}</span>
                  <span className="text-xs text-gray-500">{selectedOption.description}</span>
                </div>
              </>
            ) : (
              <span className="text-gray-500">Selecione o tipo de transporte</span>
            )}
          </div>
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
              {transportationOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-3 text-left hover:bg-orange-50 transition-colors duration-150 flex items-center space-x-3 ${
                    value === option.value ? 'bg-orange-50 text-orange-700' : 'text-gray-900'
                  } ${
                    index !== transportationOptions.length - 1 
                      ? 'border-b border-gray-100' 
                      : ''
                  } ${
                    index === 0 ? 'rounded-t-lg' : ''
                  } ${
                    index === transportationOptions.length - 1 ? 'rounded-b-lg' : ''
                  }`}
                >
                  <option.icon className={`h-4 w-4 ${
                    value === option.value ? 'text-orange-600' : 'text-gray-500'
                  }`} />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-gray-500">{option.description}</span>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}