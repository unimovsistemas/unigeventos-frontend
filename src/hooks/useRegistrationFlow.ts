import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUser } from '@/services/authService';
import { registerPerson } from '@/services/registerPersonService';
import { usePhoneMask, useEmailValidation, useDocumentMask } from './useFieldMasks';

interface ContactData {
  phoneNumber: string;
  email: string;
}

interface DocumentData {
  documentType: string;
  number: string;
}

interface RegistrationFormData {
  // Step 1
  username: string;
  password: string;
  
  // Step 2
  name: string;
  birthdateInput: string;
  gender: string;
  maritalStatus: string;
  
  // Step 3
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  isLeader: boolean;
  
  // Step 4
  contact: ContactData;
  document: DocumentData;
}

export function useRegistrationFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    password: '',
    name: '',
    birthdateInput: '',
    gender: '',
    maritalStatus: '',
    church: '',
    clothingSize: '',
    choralVoiceType: '',
    isLeader: false,
    contact: { phoneNumber: '', email: '' },
    document: { documentType: '', number: '' }
  });
  
  const { validatePhone } = usePhoneMask();
  const { validateEmail } = useEmailValidation();
  const { validateDocument } = useDocumentMask();
  
  const updateFormData = useCallback((updates: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);
  
  const nextStep = useCallback(() => {
    setStep(prev => prev + 1);
    setError('');
  }, []);
  
  const prevStep = useCallback(() => {
    setStep(prev => prev - 1);
    setError('');
  }, []);
  
  const validateCurrentStep = useCallback((): boolean => {
    switch (step) {
      case 1:
        if (!formData.username || !formData.password) {
          setError('Por favor, preencha todos os campos obrigatórios.');
          return false;
        }
        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          return false;
        }
        break;
        
      case 2:
        if (!formData.name || !formData.birthdateInput || !formData.gender) {
          setError('Por favor, preencha todos os campos obrigatórios.');
          return false;
        }
        break;
        
      case 4:
        if (!formData.contact.email || !formData.document.documentType || !formData.document.number) {
          setError('Por favor, preencha todos os campos obrigatórios.');
          return false;
        }
        
        if (!validateEmail(formData.contact.email)) {
          setError('Por favor, digite um e-mail válido.');
          return false;
        }
        
        if (formData.contact.phoneNumber && !validatePhone(formData.contact.phoneNumber)) {
          setError('Por favor, digite um telefone válido.');
          return false;
        }
        
        if (!validateDocument(formData.document.number, formData.document.documentType as 'CPF' | 'RG')) {
          setError(`Por favor, digite um ${formData.document.documentType} válido.`);
          return false;
        }
        
        if (!isCaptchaValid) {
          setError('Por favor, resolva a operação matemática de verificação.');
          return false;
        }
        break;
    }
    
    return true;
  }, [step, formData, validatePhone, validateEmail, validateDocument, isCaptchaValid]);
  
  const handleStepOne = useCallback(async (): Promise<boolean> => {
    if (!validateCurrentStep()) return false;
    
    setIsLoading(true);
    try {
      const response = await registerUser(formData.username, formData.password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setError('');
      nextStep();
      return true;
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData.username, formData.password, validateCurrentStep, nextStep]);
  
  const handleFinalStep = useCallback(async (): Promise<boolean> => {
    if (!validateCurrentStep()) {
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      setError('Acesso negado! Entre em contato com o administrador do sistema!');
      setIsLoading(false);
      return false;
    }
    
    try {
      const [day, month, year] = formData.birthdateInput.split('/');
      const dateFormatted = `${year}-${month}-${day}`;
      
      await registerPerson(
        {
          name: formData.name,
          birthdate: dateFormatted,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          church: formData.church,
          clothingSize: formData.clothingSize,
          choralVoiceType: formData.choralVoiceType,
          isLeader: formData.isLeader,
          contact: formData.contact,
          document: formData.document,
        },
        accessToken
      );
      
      setSuccessMessage('Cadastro finalizado com sucesso! Um e-mail de boas-vindas foi enviado.');
      const targetUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login';
      router.push(targetUrl);
      return true;
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
      return false;
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoading(false);
    }
  }, [formData, validateCurrentStep, redirectUrl, router]);
  
  const handleCancelRegister = useCallback(async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    const targetUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login';
    router.push(targetUrl);
    setIsLoading(false);
  }, [redirectUrl, router]);
  
  return {
    // State
    step,
    formData,
    isLoading,
    error,
    successMessage,
    isCaptchaValid,
    redirectUrl,
    
    // Actions
    updateFormData,
    nextStep,
    prevStep,
    handleStepOne,
    handleFinalStep,
    handleCancelRegister,
    setIsCaptchaValid,
    setError
  };
}