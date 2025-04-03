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
import { DatePicker } from "@/components/ui/datePicker";
import DocumentInput from "@/components/ui/documentInput";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [photo, setPhoto] = useState("");
  const [church, setChurch] = useState("");
  const [clothingSize, setClothingSize] = useState("");
  const [choralVoiceType, setChoralVoiceType] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [contact, setContact] = useState({ phoneNumber: "", email: "" });
  const [document, setDocument] = useState({ documentType: "", number: "" });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleStepOne = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setStep(2);
      return;
    }

    try {
      const response = await registerUser(username, password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setStep(2);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    }
  };

  const handleStepTwo = async () => {
    setError(""); // Resetando erro antes da validação
  
    if (!name || !birthdate || !gender || !contact.email || !document.documentType || !document.number) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError(
        "Acesso negado! Entre em contato com o administrador do sistema!"
      );
      return;
    }

    const formattedBirthdate = birthdate
      ? birthdate.toISOString().split("T")[0]
      : "";

    try {
      await registerPerson(
        {
          name,
          formattedBirthdate,
          gender,
          maritalStatus,
          photo,
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-black p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            {step === 1 ? "Criar Conta" : "Dados Pessoais"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

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
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              >
                Continuar
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <DatePicker
                value={birthdate}
                onChange={(date) => setBirthdate(date)}
              />
              <Select
                options={[
                  { label: "Masculino", value: "MALE" },
                  { label: "Feminino", value: "FEMALE" },
                ]}
                value={gender}
                onChange={setGender}
                placeholder={"Gênero"}
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
                placeholder={"Estado Civil"}
              />

              <Input
                placeholder="Igreja"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
              />
              <Input
                placeholder="Foto (URL)"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
              <Input
                placeholder="Tamanho da Vestimenta"
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
                defaultValue={"NOT_INFORMED"}
                placeholder={"Tipo de voz (coral)"}
              />

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
                placeholder={"Tipo de Documento"}
              />
              <Input
                placeholder="Número do Documento"
                value={formatCPF(document.number)}
                disabled={!document.documentType}
                onChange={(e) =>
                  setDocument({ ...document, number: e.target.value.replace(/\D/g, "") })
                }
              />

              <div className="flex items-center justify-between border rounded-lg p-3 bg-white shadow-sm">
                <span className="text-gray-700 font-medium">
                  Exerce liderança?
                </span>
                <Toggle checked={isLeader} onChange={setIsLeader} />
              </div>

              <Button
                onClick={handleStepTwo}
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              >
                Finalizar Cadastro
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
