"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon } from "lucide-react";
import React from "react";

interface BudgetExtra {
  description: string;
  value: number;
  recurrence?: string;
}

interface BudgetFormExtrasProps {
  extras: BudgetExtra[];
  onChange: (extras: BudgetExtra[]) => void;
}

const recurrenceOptions = [
  { value: "", label: "Único" },
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
  { value: "trimestral", label: "Trimestral" },
  { value: "semestral", label: "Semestral" },
];

export function BudgetFormExtras({ extras, onChange }: BudgetFormExtrasProps) {
  const addExtra = () => {
    onChange([...extras, { description: "", value: 0, recurrence: undefined }]);
  };

  const removeExtra = (index: number) => {
    onChange(extras.filter((_, i) => i !== index));
  };

  const updateExtra = (index: number, field: keyof BudgetExtra, value: string | number) => {
    const newExtras = [...extras];
    if (field === "value") {
      newExtras[index] = { ...newExtras[index], value: Number(value) || 0 };
    } else if (field === "recurrence") {
      newExtras[index] = {
        ...newExtras[index],
        recurrence: value === "" ? undefined : (value as string),
      };
    } else {
      // field === "description"
      newExtras[index] = { ...newExtras[index], description: value as string };
    }
    onChange(newExtras);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Extras Opcionais</Label>
        <Button variant="outline" size="sm" onClick={addExtra}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Adicionar Extra
        </Button>
      </div>

      {extras.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-base-300 rounded-lg">
          <p className="text-sm text-base-content/60">
            Nenhum extra adicionado. Adicione serviços extras opcionais como hospedagem, domínio,
            suporte, etc.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {extras.map((extra, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 items-start p-3 bg-base-200/50 rounded-lg"
            >
              <div className="col-span-5">
                <Label className="text-xs text-base-content/60">Descrição</Label>
                <Input
                  value={extra.description}
                  onChange={(e) => updateExtra(index, "description", e.target.value)}
                  placeholder="Ex: Hospedagem com SSL"
                />
              </div>
              <div className="col-span-3">
                <Label className="text-xs text-base-content/60">Valor</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={extra.value}
                  onChange={(e) => updateExtra(index, "value", e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Label className="text-xs text-base-content/60">Recorrência</Label>
                <select
                  className="w-full h-8 px-2 text-xs border border-input rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
                  value={extra.recurrence || ""}
                  onChange={(e) => updateExtra(index, "recurrence", e.target.value)}
                >
                  {recurrenceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 pt-5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-error"
                  onClick={() => removeExtra(index)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
