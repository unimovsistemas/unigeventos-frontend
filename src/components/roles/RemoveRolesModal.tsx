/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddRolesModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { removeUserRoles } from "@/services/userRolesService";
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

const allRoles = ["ROLE_ADMIN", "ROLE_LEADER"];

export const roleTypeLabels: Record<string, string> = {
  "ROLE_ADMIN": "ADMIN",
  "ROLE_LEADER": "LÍDER",
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
      
      await removeUserRoles(userName, rolesInput);
      toast.success("Permissões removidas com sucesso.");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover permissões.");
    } finally {
      clearSelectedRoles();
    }
  };

  const clearSelectedRoles = () => {
      setSelectedRoles([]);
  }

  const availableRolesToRemove = allRoles.filter((role) => currentRoles.includes(role));

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
          <DialogTitle>Remover Permissões</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {availableRolesToRemove.map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => handleToggleRole(role)}
              />
              <span>{roleTypeLabels[role] || role}</span>
            </label>
          ))}
          {availableRolesToRemove.length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma permissão disponível para remover.
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
