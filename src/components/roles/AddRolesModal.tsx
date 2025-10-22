/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddRolesModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addUserRoles } from "@/services/userRolesService";
import { toast } from "react-toastify";
import { RolesInput } from '../../services/userRolesService';

interface AddRolesModalProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  currentRoles: string[];
  onSuccess: () => void;
}

const allRoles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_LEADER"];

export const roleTypeLabels: Record<string, string> = {
  "ROLE_ADMIN": "ADMIN",
  "ROLE_LEADER": "LÍDER",
  "ROLE_USER": "USUÁRIO",
};

export default function AddRolesModal({
  open,
  onClose,
  userName,
  userId,
  currentRoles,
  onSuccess,
}: AddRolesModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleToggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    try {
      const rolesInput: RolesInput = { 
        userId: userId, 
        roles: selectedRoles
      }
      
      await addUserRoles(userName, rolesInput);
      toast.success("Permissões adicionadas com sucesso.");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar permissões.");
    } finally {
      clearSelectedRoles();
    }
  };

  const clearSelectedRoles = () => {
      setSelectedRoles([]);
  }

  const availableRoles = allRoles.filter((role) => !currentRoles.includes(role));

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearSelectedRoles();
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Permissões</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {availableRoles.map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => handleToggleRole(role)}
              />
              <span>{roleTypeLabels[role] || role}</span>
            </label>
          ))}
          {availableRoles.length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma permissão disponível para adicionar.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              clearSelectedRoles();
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={selectedRoles.length === 0}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
