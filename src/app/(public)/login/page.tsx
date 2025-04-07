/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { login } from "../../../services/authService"; // Importando o serviço de autenticação
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 👈 novo estado

  const handleLogin = async () => {
    setIsLoading(true); // 👈 ativa o loading
    try {
      const response = await login(username, password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      window.location.href = "/dashboard";
    } catch (err: any) {
      const hasCausedBy = err.response != null && err.response.data != null;
      const errorMessage = hasCausedBy
        ? err.response.data.message
        : "Ocorreu um erro inesperado! Entre em contato com o administrador do sistema!";
      setError(`${errorMessage}`);
    } finally {
      setIsLoading(false); // 👈 desativa o loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-black p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm text-center mb-3">{error}</p>
          )}
          <Input
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={handleLogin}
            className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
            disabled={isLoading} // 👈 botão desabilitado se loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
          <div className="flex justify-between mt-6 text-sm w-full">
            <a
              href="/forgot-password"
              className="text-orange-500 hover:underline"
            >
              Esqueci a senha
            </a>
            <a href="/register" className="text-orange-500 hover:underline">
              Criar conta
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
