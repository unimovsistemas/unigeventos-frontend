/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forgotPassword, resetPassword } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { PasswordField } from "@/components/ui/password-field";
import { toast } from "react-toastify";

export default function PasswordRecovery() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSendEmail = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await forgotPassword(email);
      if (response?.status === 200) {
        toast.success(`E-mail de redefinição enviado para ${email}`, {
          position: "top-right",
          autoClose: 5000,
        });
        setStep(2);
      } else {
        toast.error("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
      }
    } catch (error: any) {
      toast.error(`Erro ao conectar com o servidor. Causa: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, newPassword);
      if (response?.status === 200) {
        toast.success("Sua senha foi alterada com sucesso!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error("Token inválido ou senha não aceita.");
      }
    } catch (error: any) {
      toast.error(`Erro ao conectar com o servidor. Causa: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 1 ? "Recuperar Senha" : "Nova Senha"}
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? "Digite seu e-mail para receber as instruções de recuperação"
              : "Digite o token recebido e sua nova senha"
            }
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="w-full shadow-xl border-0 bg-white">
          <CardContent className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu e-mail cadastrado"
                      className="h-12"
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-300"
                  onClick={handleSendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    "Enviar Link de Redefinição"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                      Token de Verificação
                    </label>
                    <Input
                      id="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Digite o token recebido por e-mail"
                      className="h-12"
                    />
                  </div>

                  <PasswordField
                    label="Nova Senha"
                    placeholder="Digite sua nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    helperText="Mínimo de 6 caracteres"
                    required
                  />

                  <PasswordField
                    label="Confirmar Nova Senha"
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-300"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Alterando...
                    </div>
                  ) : (
                    "Alterar Senha"
                  )}
                </Button>
              </>
            )}

            <div className="text-center">
              <a 
                href="/login" 
                className="text-orange-600 hover:text-orange-700 hover:underline font-medium text-sm"
              >
                Voltar para o login
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Lembrou da sua senha?{" "}
            <a 
              href="/login"
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
            >
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
