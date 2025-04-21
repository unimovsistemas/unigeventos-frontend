import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CustomDatePicker } from "../ui/CustomDatePicker";

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

  const addBatch = async () => {
    append({
      name: "",
      capacity: null,
      price: null,
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Lotes</h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 border border-gray-200 rounded-2xl p-4 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Nome do lote"
                {...register(`batches.${index}.name`)}
              />
              {errors.batches && errors.batches[index]?.name && (
                <p className="text-orange-500 text-sm">
                  {errors.batches[index]?.name?.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="number"
                placeholder="Capacidade"
                {...register(`batches.${index}.capacity`, {
                  valueAsNumber: true,
                })}
              />
              {errors.batches && errors.batches[index]?.capacity && (
                <p className="text-orange-500 text-sm">
                  {errors.batches[index]?.capacity?.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="number"
                placeholder="Preço"
                {...register(`batches.${index}.price`, { valueAsNumber: true })}
              />
              {errors.batches && errors.batches[index]?.price && (
                <p className="text-orange-500 text-sm">
                  {errors.batches[index]?.price?.message}
                </p>
              )}
            </div>

            <div>
              <CustomDatePicker
                name={`batches.${index}.startDate`}
                control={control}
                placeholder="Data de início"
                withTime={false}
              />
              {errors.batches && errors.batches[index]?.startDate && (
                <p className="text-orange-500 text-sm">
                  {errors.batches[index]?.startDate?.message}
                </p>
              )}
            </div>

            <div>
              <CustomDatePicker
                name={`batches.${index}.endDate`}
                control={control}
                placeholder="Data de fim"
                withTime={false}
              />
              {errors.batches && errors.batches[index]?.endDate && (
                <p className="text-orange-500 text-sm">
                  {errors.batches[index]?.endDate?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="mt-2"
            >
              Remover lote
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" onClick={addBatch}>
        Adicionar lote
      </Button>
    </div>
  );
};
