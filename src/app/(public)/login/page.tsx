/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { login } from "../../../services/authService"; // Importando o serviço de autenticação
import { Loader2 } from "lucide-react";
import { CloudflareTurnstile } from "@/components/ui/cloudflare-turnstile";
import { PasswordField } from "@/components/ui/password-field";
import { useTurnstile } from "@/hooks/useTurnstile";
import { PanelSelectionModal } from "@/components/ui/panel-selection-modal";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showPanelSelection, setShowPanelSelection] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get('redirect');
  const message = searchParams.get('message');
  
  // Detectar se está tentando se registrar em um evento
  const isEventRegistration = redirectUrl?.includes('/user/events/') && redirectUrl?.includes('/register');
  const eventId = isEventRegistration && redirectUrl ? redirectUrl.split('/')[3] : null;
  
  const { 
    turnstileToken, 
    turnstileError, 
    handleTurnstileSuccess, 
    handleTurnstileError, 
    isTurnstileValid 
  } = useTurnstile();

  // Mostrar captcha apenas quando usuário e senha estiverem preenchidos
  useEffect(() => {
    setShowCaptcha(username.trim() !== "" && password.trim() !== "");
  }, [username, password]);

  // Handler para pressionar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Só permite login se não estiver carregando e se o captcha estiver válido (quando visível)
      const canLogin = !isLoading && (!showCaptcha || isTurnstileValid);
      
      if (canLogin) {
        handleLogin();
      }
    }
  };

  const handleRedirectAfterLogin = (roles: string[]) => {
    const hasAdminRole = roles.includes('ROLE_ADMIN');
    const hasUserRole = roles.includes('ROLE_USER') || roles.includes('ROLE_LEADER');

    if (redirectUrl) {
      // Se há URL de redirecionamento, usar ela
      router.push(redirectUrl);
      return;
    }

    if (hasAdminRole && hasUserRole) {
      // Usuário tem ambos os roles - mostrar modal de seleção
      setUserRoles(roles);
      setShowPanelSelection(true);
    } else if (hasAdminRole) {
      // Apenas admin - ir para painel admin
      router.push("/admin");
    } else if (hasUserRole) {
      // Apenas user/leader - ir para painel user
      router.push("/user");
    } else {
      // Sem roles válidos - erro
      setError("Usuário não possui permissões adequadas para acessar o sistema.");
    }
  };

  const handlePanelSelection = (panel: 'admin' | 'user') => {
    setShowPanelSelection(false);
    if (panel === 'admin') {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const handleLogin = async () => {
    // Validação do captcha apenas se estiver visível
    if (showCaptcha && !isTurnstileValid) {
      toast.warning("Por favor, complete a verificação de segurança para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(username, password);
      
      // Aguardar um pouco para garantir que os cookies sejam definidos
      setTimeout(() => {
        // Redirecionar baseado nos roles
        handleRedirectAfterLogin(response.roles);
      }, 100);
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
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-xl border-0 bg-white">
          <CardContent className="p-8 space-y-6">
            {redirectUrl && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-orange-700 text-sm font-medium">
                  {isEventRegistration 
                    ? "🎯 Para se inscrever no evento, é necessário fazer login ou criar uma conta"
                    : "Faça login para continuar"
                  }
                </p>
                {isEventRegistration && (
                  <p className="text-orange-600 text-xs mt-1">
                    Após o login, você será redirecionado automaticamente para a página de inscrição
                  </p>
                )}
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuário
                </label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="h-12"
                />
              </div>
              
              <PasswordField
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                required
              />
            </div>

            {/* Captcha de Segurança - Cloudflare Turnstile */}
            {showCaptcha && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Verificação de Segurança
                </label>
                <CloudflareTurnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                  theme="light"
                  size="normal"
                />
                {turnstileError && (
                  <p className="text-red-600 text-sm">
                    Erro na verificação de segurança. Tente novamente.
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-300"
              disabled={isLoading || (showCaptcha && !isTurnstileValid)}
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
                href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} 
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
              href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
            >
              Cadastre-se gratuitamente
            </a>
          </p>
        </div>
      </div>

      {/* Modal de Seleção de Painel */}
      <PanelSelectionModal
        isOpen={showPanelSelection}
        onClose={() => setShowPanelSelection(false)}
        onSelectPanel={handlePanelSelection}
      />
    </div>
  );
}
