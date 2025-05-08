/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { choralVoiceTypeLabels, genderTypeLabels, getPersonsPage, maritalStatusTypeLabels, PersonResponse, roleTypeLabels } from "@/services/personService";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export default function PersonListPage() {
  const [persons, setPersons] = useState<PersonResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersons() {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token de acesso não encontrado.");
          return;
        }

        const response = await getPersonsPage(token, currentPage);
        setPersons(response.content || []);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar pessoas.");
      } finally {
        setLoading(false);
      }
    }

    fetchPersons();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-400">Pessoas</h1>

      <Accordion type="multiple" className="space-y-4">
        {persons.map((person) => (
          <AccordionItem key={person.id} value={person.id}>
            <AccordionTrigger className="bg-neutral-800 px-4 py-3 rounded-md text-white hover:bg-neutral-700">
              <div className="flex items-center gap-4 w-full text-left">
                <Avatar
                  className="h-9 w-9 border border-neutral-600"
                  src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`} // temporário, depois poderá ser substituído por algo como "{person.photo} || {user?.imageUrl}"
                  alt="{user?.name}"
                />
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-lg">
                    {person.login.username}
                  </span>
                  <span className="text-sm text-neutral-300">
                    {person.name}
                  </span>
                  <span className="text-sm text-neutral-300">
                  {genderTypeLabels[person.gender] || person.gender}
                  </span>
                </div>
                <div className="text-sm text-neutral-400 text-right">
                  <p className="font-bold text-orange-500 mb-1">Permissões</p>
                  <p>{person.login.roles?.map(r => roleTypeLabels[r.role] || r.role).join(", ")}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-neutral-900 px-6 py-4 text-white rounded-b-md border border-t-0 border-neutral-700">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <li>
                  <strong>Data de nascimento:</strong> {new Date(person.birthdate).toLocaleDateString()}
                </li>
                <li>
                  <strong>Estado civil:</strong> {maritalStatusTypeLabels[person.maritalStatus] || person.maritalStatus}
                </li>
                <li>
                  <strong>Tamanho vestimenta:</strong> {person.clothingSize}
                </li>
                <li>
                  <strong>Tipo de voz coral:</strong> {choralVoiceTypeLabels[person.choralVoiceType] || person.choralVoiceType}
                </li>
                <li>
                  <strong>Telefone:</strong> {person.contact?.phoneNumber}
                </li>
                <li>
                  <strong>Email:</strong> {person.personalContactEmail}
                </li>
                <li>
                  <strong>Documento:</strong> {person.document?.documentType} -{" "}
                  {person.document?.number}
                </li>
                <li>
                  <strong>Igreja:</strong> {person.church}
                </li>
                <li>
                  <strong>Líder:</strong> {person.isLeader ? "Sim" : "Não"}
                </li>
                <li>
                  <strong>Data do último acesso:</strong> {person.login.lastLogin ? new Date(person.login.lastLogin).toLocaleDateString() : "-"}
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {!loading && (
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`${
              currentPage === 0 ? "text-gray-400" : "text-orange-400"
            }`}
          >
            Anterior <ArrowLeftCircle className="ml-2" size={16} />
          </Button>

          <span className="text-white text-sm">
            Página <strong>{currentPage + 1}</strong> de{" "}
            <strong>{totalPages}</strong>
          </span>

          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages - 1}
            className={`${
              currentPage >= totalPages - 1
                ? "text-gray-400"
                : "text-orange-400"
            }`}
          >
            Próxima <ArrowRightCircle className="ml-2" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
