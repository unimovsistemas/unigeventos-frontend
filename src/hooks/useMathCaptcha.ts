import { useState, useEffect, useCallback } from 'react';

interface MathCaptcha {
  question: string;
  answer: number;
}

export function useMathCaptcha() {
  const [captcha, setCaptcha] = useState<MathCaptcha>({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);

  const generateCaptcha = useCallback(() => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }
    
    const question = `${num1} ${operation} ${num2} = ?`;
    setCaptcha({ question, answer });
    setUserAnswer('');
    setIsValid(false);
  }, []);

  const validateCaptcha = useCallback((value: string) => {
    const numericValue = parseInt(value, 10);
    const valid = !isNaN(numericValue) && numericValue === captcha.answer;
    setIsValid(valid);
    return valid;
  }, [captcha.answer]);

  const handleAnswerChange = useCallback((value: string) => {
    setUserAnswer(value);
    validateCaptcha(value);
  }, [validateCaptcha]);

  const reset = useCallback(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  return {
    captcha: captcha.question,
    userAnswer,
    isValid,
    handleAnswerChange,
    reset,
    validateCaptcha: () => validateCaptcha(userAnswer)
  };
}