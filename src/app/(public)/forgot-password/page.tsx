/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forgotPassword, resetPassword } from "@/services/authService";
import { Loader2 } from "lucide-react";

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
        alert("Um e-mail de redefinição foi enviado para " + email);
        setStep(2);
      } else {
        setError("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
      }
    } catch (error: any) {
      setError(`Erro ao conectar com o servidor. Causa: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, newPassword);
      if (response?.status === 200) {
        alert("Sua senha foi alterada com sucesso.");
        router.push("/login");
      } else {
        setError("Token inválido ou senha não aceita.");
      }
    } catch (error: any) {
      setError(`Erro ao conectar com o servidor. Causa: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-black p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            {step === 1 ? "Recuperar Senha" : "Nova Senha"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm text-center mb-3">{error}</p>
          )}

          {step === 1 ? (
            <>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
              />
              <Button
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
                onClick={handleSendEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  "Enviar link de redefinição"
                )}
              </Button>
            </>
          ) : (
            <>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Digite o token recebido por e-mail"
              />

              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />

              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
              />

              <Button
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  "Alterar senha"
                )}
              </Button>
            </>
          )}
          <div className="flex justify-center mt-6 text-sm w-full">
            <a href="/login" className="text-orange-500 hover:underline">
              Cancelar
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
