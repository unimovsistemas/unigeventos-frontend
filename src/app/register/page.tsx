/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleStepOne = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setStep(2);
      setIsLoading(false);
      return;
    }

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
      router.push("/login");
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-black p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            {{
              1: "Criar Conta",
              2: "Dados Pessoais",
              3: "Dados Ministeriais",
              4: "Documento e Contato",
            }[step] || "Etapa"}{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-auto max-h-[80vh]">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm text-center">
              {successMessage}
            </p>
          )}

          {step === 1 && (
            <>
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
                onClick={handleStepOne}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              >
                {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}{" "}
                Continuar
              </Button>
              <div className="flex justify-center mt-6 text-sm w-full">
                <a href="/login" className="text-orange-500 hover:underline">
                  Cancelar
                </a>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputMask
                mask="__/__/____"
                replacement={{ _: /\d/ }}
                value={birthdateInput}
                onChange={(e) => setBirthdateInput(e.target.value)}
                placeholder="Data de nascimento"
                className="border border-gray-300 text-orange-600 rounded-lg px-3 py-2 w-full"
              />
              <Select
                options={[
                  { label: "Masculino", value: "MALE" },
                  { label: "Feminino", value: "FEMALE" },
                ]}
                value={gender}
                onChange={setGender}
                placeholder="Gênero"
              />
              <Select
                options={[
                  { label: "Solteiro", value: "SINGLE" },
                  { label: "Casado", value: "MARRIED" },
                  { label: "Divorciado", value: "DIVORCED" },
                  { label: "Prefiro não informar", value: "NOT_INFORMED" },
                ]}
                value={maritalStatus}
                onChange={setMaritalStatus}
                placeholder="Estado Civil"
              />
              <Button
                onClick={nextStep}
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              >
                Próximo
              </Button>
              <Button
                onClick={prevStep}
                className="w-full text-orange-500 hover:underline mt-4"
              >
                Voltar
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Input
                placeholder="Igreja"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
              />
              <Input
                placeholder="Tamanho da vestimenta (coral)"
                value={clothingSize}
                onChange={(e) => setClothingSize(e.target.value)}
              />
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
                placeholder="Tipo de voz (coral)"
              />
               <div className="flex items-center justify-between border rounded-lg p-3 bg-white shadow-sm">
                <span className="text-gray-400 font-medium">
                  Exerce liderança?
                </span>
                <Toggle checked={isLeader} onChange={setIsLeader} />
              </div>
              <Button
                onClick={nextStep}
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              >
                Próximo
              </Button>
              <Button
                onClick={prevStep}
                className="w-full text-orange-500 hover:underline mt-4"
              >
                Voltar
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <Input
                placeholder="Telefone"
                value={contact.phoneNumber}
                onChange={(e) =>
                  setContact({ ...contact, phoneNumber: e.target.value })
                }
              />
              <Input
                placeholder="E-mail"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
              />
              <Select
                options={[
                  { label: "CPF", value: "CPF" },
                  { label: "RG", value: "RG" },
                ]}
                value={document.documentType}
                onChange={(value) =>
                  setDocument({ ...document, documentType: value })
                }
                placeholder="Tipo de Documento"
              />
              <Input
                placeholder="Número do Documento"
                value={formatCPF(document.number)}
                disabled={!document.documentType}
                onChange={(e) =>
                  setDocument({
                    ...document,
                    number: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
              <Button
                onClick={handleFinalStep}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              >
                {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}{" "}
                Finalizar Cadastro
              </Button>
              <Button
                onClick={prevStep}
                className="w-full text-orange-500 hover:underline mt-4"
              >
                Voltar
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
