/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getAllPage } from "@/services/eventsService"; // ajuste conforme seu path real
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Select from "../ui/select";

interface Props {
  value: string;
  onChange: (eventId: string) => void;
}

interface Option {
  label: string;
  value: string;
}

export default function EventSelect({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    const fetchEvents = async () => {
      if (!token) {
        toast.error("Usuário não autorizado para realizar esta ação!");
        return;
      }
      setLoading(true);
      try {
        const response = await getAllPage(token, "", true, 0, 100);
        const formatted = response.content.map((event: any) => ({
          label: event.name,
          value: event.id,
        }));
        setOptions(formatted);
      } catch (err: any) {
        toast.error(`${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="animate-spin w-4 h-4" />
        Carregando eventos...
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
        Selecione o evento
      </label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Selecione um evento"
      />
    </div>
  );
}
