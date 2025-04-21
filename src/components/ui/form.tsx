'use client';

import {
  FormProvider,
  useFormContext,
  Controller,
  ControllerRenderProps,
  FieldValues,
  FieldError
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormProps {
  children: React.ReactNode;
  [key: string]: any;
}
export function Form({ children, ...props }: FormProps) {
  return <FormProvider {...props}>{children}</FormProvider>;
}

interface FormFieldProps<T extends FieldValues> {
  name: string;
  control: any;
  render: (props: { field: ControllerRenderProps<T, any> }) => ReactNode;
}
export function FormField<T extends FieldValues>({ name, control, render }: FormFieldProps<T>) {
  return <Controller name={name} control={control} render={render} />;
}

export function FormItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function FormLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={cn("text-sm font-medium text-gray-700", className)}>{children}</label>;
}

export function FormControl({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ name }: { name?: string }) {
  const {
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = name
    ? (errors as any)[name]
    : undefined;

  if (!error) return null;

  return <p className="text-sm text-red-600">{error.message as string}</p>;
}