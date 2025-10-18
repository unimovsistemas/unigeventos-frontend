import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { Plus, Trash2, DollarSign, Users, Calendar, Tag, X } from "lucide-react";

export const BatchList = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "batches",
  });

  const addBatch = () => {
    append({
      name: "",
      capacity: 0,
      price: 0,
      startDate: null,
      endDate: null,
    });
  };

  // Helper para acessar erros de forma segura
  const getBatchError = (index: number, field: string) => {
    const batchErrors = errors?.batches as any;
    return batchErrors?.[index]?.[field]?.message;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-orange-300 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Lotes de Pagamento
        </h3>
        <Button
          type="button"
          onClick={addBatch}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lote
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-neutral-400">
          <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum lote configurado ainda.</p>
          <p className="text-sm">Clique em "Adicionar Lote" para começar.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 border border-neutral-600 rounded-lg p-4 bg-neutral-800/30"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-orange-300">
              Lote {index + 1}
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="bg-transparent border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nome do Lote */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                <Tag className="h-4 w-4" />
                Nome do Lote
              </label>
              <Input
                placeholder="Ex: 1º Lote, Promoção..."
                {...register(`batches.${index}.name`)}
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20"
              />
              {getBatchError(index, 'name') && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'name')}
                </p>
              )}
            </div>

            {/* Capacidade */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                <Users className="h-4 w-4" />
                Capacidade
              </label>
              <Input
                type="number"
                placeholder="Ex: 50"
                min="1"
                {...register(`batches.${index}.capacity`, {
                  valueAsNumber: true,
                })}
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {getBatchError(index, 'capacity') && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'capacity')}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                <DollarSign className="h-4 w-4" />
                Preço (R$)
              </label>
              <Input
                type="number"
                placeholder="Ex: 25.00"
                min="0"
                step="0.01"
                {...register(`batches.${index}.price`, { valueAsNumber: true })}
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {getBatchError(index, 'price') && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'price')}
                </p>
              )}
            </div>

            {/* Data de Início */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                <Calendar className="h-4 w-4" />
                Data de Início
              </label>
              <CustomDatePicker
                name={`batches.${index}.startDate`}
                control={control}
                placeholder="Início do lote"
                withTime={false}
              />
              {getBatchError(index, 'startDate') && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'startDate')}
                </p>
              )}
            </div>

            {/* Data de Fim */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                <Calendar className="h-4 w-4" />
                Data de Fim
              </label>
              <CustomDatePicker
                name={`batches.${index}.endDate`}
                control={control}
                placeholder="Fim do lote"
                withTime={false}
              />
              {getBatchError(index, 'endDate') && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'endDate')}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {fields.length > 0 && (
        <div className="text-center">
          <Button
            type="button"
            onClick={addBatch}
            variant="outline"
            className="bg-transparent border-green-600/50 text-green-400 hover:bg-green-600/10 hover:border-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Outro Lote
          </Button>
        </div>
      )}
    </div>
  );
};
