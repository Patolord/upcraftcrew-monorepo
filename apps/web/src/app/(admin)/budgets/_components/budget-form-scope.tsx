"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, X } from "lucide-react";

interface BudgetScopeOption {
  name: string;
  features: string[];
  value?: number;
  isSelected: boolean;
}

interface BudgetFormScopeProps {
  scopeOptions: BudgetScopeOption[];
  onChange: (scopeOptions: BudgetScopeOption[]) => void;
}

export function BudgetFormScope({ scopeOptions, onChange }: BudgetFormScopeProps) {
  const addScopeOption = () => {
    onChange([...scopeOptions, { name: "", features: [""], value: undefined, isSelected: false }]);
  };

  const removeScopeOption = (index: number) => {
    onChange(scopeOptions.filter((_, i) => i !== index));
  };

  const updateScopeOption = (
    index: number,
    field: keyof BudgetScopeOption,
    value: string | number | boolean | string[] | undefined,
  ) => {
    const newOptions = [...scopeOptions];
    newOptions[index] = { ...newOptions[index], [field]: value } as BudgetScopeOption;
    onChange(newOptions);
  };

  const addFeature = (optionIndex: number) => {
    const newOptions = [...scopeOptions];
    newOptions[optionIndex].features.push("");
    onChange(newOptions);
  };

  const removeFeature = (optionIndex: number, featureIndex: number) => {
    const newOptions = [...scopeOptions];
    newOptions[optionIndex].features = newOptions[optionIndex].features.filter(
      (_, i) => i !== featureIndex,
    );
    onChange(newOptions);
  };

  const updateFeature = (optionIndex: number, featureIndex: number, value: string) => {
    const newOptions = [...scopeOptions];
    newOptions[optionIndex].features[featureIndex] = value;
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Opções de Escopo</Label>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={addScopeOption}
          className="border border-orange-500 bg-white rounded-md"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Opção
        </Button>
      </div>

      {scopeOptions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-base-300 rounded-lg">
          <p className="text-sm text-base-content/60">
            Adicione diferentes pacotes ou opções de serviço.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scopeOptions.map((option, optionIndex) => (
            <div key={optionIndex} className="p-4 bg-base-200/50 rounded-lg space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-base-content/60 pb-3">Nome da Opção</Label>
                    <Input
                      value={option.name}
                      onChange={(e) => updateScopeOption(optionIndex, "name", e.target.value)}
                      placeholder="Ex: Opção 1 - Landing Page Individual"
                      className="border border-orange-500 rounded-md"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-base-content/60 pb-3">Valor (opcional)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={option.value || ""}
                      onChange={(e) =>
                        updateScopeOption(
                          optionIndex,
                          "value",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      placeholder="0,00"
                      className="border border-orange-500 rounded-md"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 pt-3 text-error mt-4"
                  onClick={() => removeScopeOption(optionIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-xs text-base-content/60 pb-2">
                    Funcionalidades Incluídas
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={addScopeOption}
                    className="border border-orange-500 bg-white rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(optionIndex, featureIndex, e.target.value)}
                        placeholder="Ex: Design responsivo"
                        className="flex-1 border border-orange-500 rounded-md"
                      />
                      {option.features.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-base-content/60 hover:text-error"
                          onClick={() => removeFeature(optionIndex, featureIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
