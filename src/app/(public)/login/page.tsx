/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { login } from "../../../services/authService"; // Importando o serviço de autenticação
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login(username, password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      // Redireciona para a URL especificada ou para o dashboard
      const targetUrl = redirectUrl || "/dashboard";
      window.location.href = targetUrl;
    } catch (err: any) {
      const hasCausedBy = err.response != null && err.response.data != null;
      const errorMessage = hasCausedBy
        ? err.response.data.message
        : "Ocorreu um erro inesperado! Entre em contato com o administrador do sistema!";
      setError(`${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {redirectUrl && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
              <p className="text-orange-700 text-sm">
                Faça login para continuar com sua inscrição no evento
              </p>
            </div>
          )}
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
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-300"
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
          <div className="flex justify-between mt-6 text-sm w-full">
            <a
              href="/forgot-password"
              className="text-orange-500 hover:underline"
            >
              Esqueci a senha
            </a>
            <a 
              href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} 
              className="text-orange-500 hover:underline"
            >
              Criar conta
            </a>
          </div>
        </CardContent>
      </Card>
  );
}
