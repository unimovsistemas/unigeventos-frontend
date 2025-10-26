import { ChevronDown, Music } from 'lucide-react';
import { useState } from 'react';

interface VoiceTypeOption {
  value: 'SOPRANO' | 'CONTRALTO' | 'TENOR' | 'BASS' | 'NOT_INFORMED';
  label: string;
  icon: string;
  description: string;
  range: string;
}

interface VoiceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const voiceTypeOptions: VoiceTypeOption[] = [
  { 
    value: 'SOPRANO', 
    label: 'Soprano', 
    icon: '🎵', 
    description: 'Voz feminina mais aguda',
    range: 'C4 - C6'
  },
  { 
    value: 'CONTRALTO', 
    label: 'Contralto', 
    icon: '🎶', 
    description: 'Voz feminina mais grave',
    range: 'E3 - E5'
  },
  { 
    value: 'TENOR', 
    label: 'Tenor', 
    icon: '🎤', 
    description: 'Voz masculina mais aguda',
    range: 'C3 - C5'
  },
  { 
    value: 'BASS', 
    label: 'Baixo', 
    icon: '🎼', 
    description: 'Voz masculina mais grave',
    range: 'E2 - E4'
  },
  { 
    value: 'NOT_INFORMED', 
    label: 'Não sei/Prefiro não informar', 
    icon: '❓', 
    description: 'Ainda não sei meu tipo de voz',
    range: 'A definir'
  }
];

export function VoiceTypeSelect({ value, onChange, error, disabled }: VoiceTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = voiceTypeOptions.find(option => option.value === value);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center space-x-2">
          <Music className="h-4 w-4" />
          <span>Tipo de Voz (Coral)</span>
        </div>
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
              <span className="text-gray-500">Selecione seu tipo de voz</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {voiceTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full p-3 text-left hover:bg-orange-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? 'bg-orange-50 text-orange-700' : 'text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5">{option.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{option.range}</span>
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
      
      <p className="text-xs text-gray-500">
        💡 Se não souber seu tipo de voz, nossa equipe pode te ajudar durante os ensaios
      </p>
    </div>
  );
}