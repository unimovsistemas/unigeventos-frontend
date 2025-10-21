import { useState, useCallback } from 'react';

// Formatação de telefone brasileiro
export const usePhoneMask = () => {
  const formatPhone = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
      // Formato: (XX) XXXX-XXXX
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Formato: (XX) XXXXX-XXXX
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  }, []);

  const validatePhone = useCallback((value: string): boolean => {
    const numbers = value.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  }, []);

  return { formatPhone, validatePhone };
};

// Formatação de CPF
export const useCPFMask = () => {
  const formatCPF = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }, []);

  const validateCPF = useCallback((cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  }, []);

  return { formatCPF, validateCPF };
};

// Formatação de RG
export const useRGMask = () => {
  const formatRG = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})$/, '$1-$2');
  }, []);

  const validateRG = useCallback((rg: string): boolean => {
    const numbers = rg.replace(/\D/g, '');
    return numbers.length >= 7 && numbers.length <= 9;
  }, []);

  return { formatRG, validateRG };
};

// Validação de email
export const useEmailValidation = () => {
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, []);

  const normalizeEmail = useCallback((email: string): string => {
    return email.trim().toLowerCase();
  }, []);

  return { validateEmail, normalizeEmail };
};

// Hook combinado para documento (CPF ou RG)
export const useDocumentMask = () => {
  const { formatCPF, validateCPF } = useCPFMask();
  const { formatRG, validateRG } = useRGMask();

  const formatDocument = useCallback((value: string, type: 'CPF' | 'RG'): string => {
    return type === 'CPF' ? formatCPF(value) : formatRG(value);
  }, [formatCPF, formatRG]);

  const validateDocument = useCallback((value: string, type: 'CPF' | 'RG'): boolean => {
    return type === 'CPF' ? validateCPF(value) : validateRG(value);
  }, [validateCPF, validateRG]);

  const getDocumentPlaceholder = useCallback((type: 'CPF' | 'RG'): string => {
    return type === 'CPF' ? '000.000.000-00' : '00.000.000-0';
  }, []);

  const getDocumentMaxLength = useCallback((type: 'CPF' | 'RG'): number => {
    return type === 'CPF' ? 14 : 12; // Incluindo pontos e traços
  }, []);

  return { 
    formatDocument, 
    validateDocument, 
    getDocumentPlaceholder, 
    getDocumentMaxLength 
  };
};