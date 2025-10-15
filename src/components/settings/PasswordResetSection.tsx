"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { changePassword, validatePassword } from "@/services/settingsService";

interface PasswordResetSectionProps {
  theme?: "dark" | "light";
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PasswordResetSection({
  theme = "dark",
  onSuccess,
  onError,
}: PasswordResetSectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDark = theme === "dark";
  
  const cardClass = isDark
    ? "bg-[#2b2b2b] border-[#444] text-neutral-200"
    : "bg-white border-gray-200 text-gray-900";
  
  const inputClass = isDark
    ? "bg-[#1e1e1e] border-[#444] text-neutral-200"
    : "bg-white border-gray-300 text-gray-900";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      onError?.("Todos os campos são obrigatórios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      onError?.("As senhas não coincidem");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.message || "Senha inválida");
      onError?.(validation.message || "Senha inválida");
      return;
    }

    if (currentPassword === newPassword) {
      setError("A nova senha deve ser diferente da senha atual");
      onError?.("A nova senha deve ser diferente da senha atual");
      return;
    }

    setIsLoading(true);

    try {
      // Recuperar o token do localStorage (ou de onde você armazena)
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      await changePassword(
        {
          currentPassword,
          newPassword,
        },
        token
      );

      setSuccess("Senha alterada com sucesso!");
      onSuccess?.();
      
      // Limpar os campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Remover mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao alterar senha";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="text-xl">Alterar Senha</CardTitle>
        <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
          Atualize sua senha para manter sua conta segura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500">
              <XCircle size={18} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/50 text-green-500">
              <CheckCircle2 size={18} />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className={inputClass}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className={inputClass}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
              Mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                className={inputClass}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
        </form>
      </CardContent>
    </Card>
  );
}
