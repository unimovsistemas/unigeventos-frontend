import { ReactNode } from 'react';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function AuthContainer({ 
  children, 
  title, 
  subtitle, 
  showProgress = false, 
  currentStep = 1, 
  totalSteps = 4 
}: AuthContainerProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
          
          {/* Progress Indicator */}
          {showProgress && (
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                return (
                  <div
                    key={stepNumber}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      stepNumber === currentStep
                        ? "bg-orange-600"
                        : stepNumber < currentStep
                        ? "bg-orange-300"
                        : "bg-gray-300"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}