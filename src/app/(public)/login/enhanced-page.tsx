/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { login } from "../../../services/authService";
import { Loader2, Mail, Lock } from "lucide-react";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { FormField } from "@/components/ui/form-field";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useFormValidation } from "@/hooks/useFormValidation";

const validationRules = {
  username: { required: true, minLength: 3 },
  password: { required: true, minLength: 6 }
};

export default function EnhancedLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const { isLoading, error, handleAsyncAction } = useAuthState();
  const { redirectUrl, handleSuccessfulAuth, getRegisterLink } = useAuthRedirect();
  const { errors, validateAllFields, clearError } = useFormValidation(validationRules);

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      clearError(field);
    }
  };

  const handleLogin = async () => {
    // Validate form
    if (!validateAllFields(formData)) {
      return;
    }

    const result = await handleAsyncAction(async () => {
      const response = await login(formData.username, formData.password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    });

    if (result) {
      handleSuccessfulAuth();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <AuthContainer
      title="Bem-vindo de volta!"
      subtitle="Faça login para acessar sua conta"
    >
      {/* Login Card */}
      <Card className="w-full shadow-xl border-0 bg-white">
        <CardContent className="p-8 space-y-6">
          {redirectUrl && (
            <FeedbackMessage
              type="info"
              message="Faça login para continuar com sua inscrição no evento"
            />
          )}
          
          {error && (
            <FeedbackMessage
              type="error"
              message={error}
            />
          )}

          <div className="space-y-4">
            <FormField
              label="Usuário"
              placeholder="Digite seu usuário"
              value={formData.username}
              onChange={handleInputChange('username')}
              onKeyPress={handleKeyPress}
              error={errors.username}
              required
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="username"
            />
            
            <FormField
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleInputChange('password')}
              onKeyPress={handleKeyPress}
              error={errors.password}
              required
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
            />
          </div>

          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="flex justify-between items-center text-sm">
            <a
              href="/forgot-password"
              className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
            >
              Esqueci minha senha
            </a>
            <a 
              href={getRegisterLink()}
              className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
            >
              Criar conta
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Ainda não tem uma conta?{" "}
          <a 
            href={getRegisterLink()}
            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
          >
            Cadastre-se gratuitamente
          </a>
        </p>
      </div>
    </AuthContainer>
  );
}