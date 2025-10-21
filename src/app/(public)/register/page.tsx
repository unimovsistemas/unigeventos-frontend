/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useRouter } from "next/navigation";
import { registerUser } from "@services/authService";
import { registerPerson } from "@/services/registerPersonService";
import Select from "@/components/ui/select";
import Toggle from "@components/ui/toggle";
import { Loader2 } from "lucide-react";
import { InputMask } from "@react-input/mask";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthdateInput, setBirthdateInput] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [church, setChurch] = useState("");
  const [clothingSize, setClothingSize] = useState("");
  const [choralVoiceType, setChoralVoiceType] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [contact, setContact] = useState({ phoneNumber: "", email: "" });
  const [document, setDocument] = useState({ documentType: "", number: "" });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleCancelRegister = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    const targetUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";
    router.push(targetUrl);
    setIsLoading(false);
  };

  const handleStepOne = async () => {
    setIsLoading(true);

    if (!username || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(username, password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setError("");
      setStep(2);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalStep = async () => {
    setError("");
    setIsLoading(true);

    if (
      !name ||
      !birthdateInput ||
      !gender ||
      !contact.email ||
      !document.documentType ||
      !document.number
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError(
        "Acesso negado! Entre em contato com o administrador do sistema!"
      );
      setIsLoading(false);
      return;
    }

    const [day, month, year] = birthdateInput.split("/");
    const dateFormatted = `${year}-${month}-${day}`;

    try {
      await registerPerson(
        {
          name,
          birthdate: dateFormatted,
          gender,
          maritalStatus,
          church,
          clothingSize,
          choralVoiceType,
          isLeader,
          contact,
          document,
        },
        accessToken
      );
      setSuccessMessage(
        "Cadastro finalizado com sucesso! Um e-mail de boas-vindas foi enviado."
      );
      const targetUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";
      router.push(targetUrl);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {{
              1: "Criar Conta",
              2: "Dados Pessoais",
              3: "Dados Ministeriais",
              4: "Documento e Contato",
            }[step] || "Cadastro"}
          </h1>
          <p className="text-gray-600">
            {{
              1: "Vamos começar criando seu usuário",
              2: "Agora precisamos de algumas informações básicas",
              3: "Informações sobre seu ministério",
              4: "Finalize com seus dados de contato",
            }[step] || "Preencha os dados solicitados"}
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  stepNumber === step
                    ? "bg-orange-600"
                    : stepNumber < step
                    ? "bg-orange-300"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Register Card */}
        <Card className="w-full shadow-xl border-0 bg-white">
          <CardContent className="p-8 space-y-6 overflow-auto max-h-[70vh]">
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm text-center">{successMessage}</p>
        )}

        {step === 1 && (
          <>
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
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <Button
              onClick={handleStepOne}
              disabled={isLoading}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registrando usuário...
                </div>
              ) : (
                "Continuar"
              )}
            </Button>
            
            <div className="text-center">
              <a 
                href="/login" 
                className="text-orange-600 hover:text-orange-700 hover:underline font-medium text-sm"
              >
                Já tem uma conta? Faça login
              </a>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <InputMask
                  mask="__/__/____"
                  replacement={{ _: /\d/ }}
                  value={birthdateInput}
                  onChange={(e) => setBirthdateInput(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="border border-gray-300 rounded-lg px-3 py-3 w-full h-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <Select
                  options={[
                    { label: "Masculino", value: "MALE" },
                    { label: "Feminino", value: "FEMALE" },
                  ]}
                  value={gender}
                  onChange={setGender}
                  placeholder="Selecione seu gênero"
                />
              </div>
              
              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Civil
                </label>
                <Select
                  options={[
                    { label: "Solteiro", value: "SINGLE" },
                    { label: "Casado", value: "MARRIED" },
                    { label: "Divorciado", value: "DIVORCED" },
                    { label: "Prefiro não informar", value: "NOT_INFORMED" },
                  ]}
                  value={maritalStatus}
                  onChange={setMaritalStatus}
                  placeholder="Selecione seu estado civil"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCancelRegister}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                Próximo
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-2">
                  Igreja
                </label>
                <Input
                  id="church"
                  placeholder="Nome da sua igreja"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="clothingSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da Vestimenta (Coral)
                </label>
                <Input
                  id="clothingSize"
                  placeholder="P, M, G, GG, etc."
                  value={clothingSize}
                  onChange={(e) => setClothingSize(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="choralVoiceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Voz (Coral)
                </label>
                <Select
                  options={[
                    { label: "Tenor", value: "TENOR" },
                    { label: "Baixo", value: "BASS" },
                    { label: "Contralto", value: "CONTRALTO" },
                    { label: "Soprano", value: "SOPRANO" },
                    { label: "Prefiro não responder", value: "NOT_INFORMED" },
                  ]}
                  value={choralVoiceType}
                  onChange={setChoralVoiceType}
                  placeholder="Selecione seu tipo de voz"
                />
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
                <div>
                  <span className="text-gray-700 font-medium">
                    Exerce liderança?
                  </span>
                  <p className="text-sm text-gray-500">
                    Você tem algum papel de liderança na igreja?
                  </p>
                </div>
                <Toggle checked={isLeader} onChange={setIsLeader} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                Próximo
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={contact.phoneNumber}
                  onChange={(e) =>
                    setContact({ ...contact, phoneNumber: e.target.value })
                  }
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento *
                </label>
                <Select
                  options={[
                    { label: "CPF", value: "CPF" },
                    { label: "RG", value: "RG" },
                  ]}
                  value={document.documentType}
                  onChange={(value) =>
                    setDocument({ ...document, documentType: value })
                  }
                  placeholder="Selecione o tipo de documento"
                />
              </div>
              
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Documento *
                </label>
                <Input
                  id="documentNumber"
                  placeholder={document.documentType === "CPF" ? "000.000.000-00" : "Número do documento"}
                  value={document.documentType === "CPF" ? formatCPF(document.number) : document.number}
                  disabled={!document.documentType}
                  onChange={(e) =>
                    setDocument({
                      ...document,
                      number: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="h-12"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                onClick={handleFinalStep}
                disabled={isLoading}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finalizando...
                  </div>
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
      </div>
    </div>
  );
}
