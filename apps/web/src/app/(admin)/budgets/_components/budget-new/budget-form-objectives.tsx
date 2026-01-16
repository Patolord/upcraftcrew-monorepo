"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon } from "lucide-react";
import React from "react";

interface BudgetObjective {
  title: string;
  description: string;
}

interface BudgetFormObjectivesProps {
  objectives: BudgetObjective[];
  onChange: (objectives: BudgetObjective[]) => void;
}

export function BudgetFormObjectives({ objectives, onChange }: BudgetFormObjectivesProps) {
  const addObjective = () => {
    onChange([...objectives, { title: "", description: "" }]);
  };

  const removeObjective = (index: number) => {
    onChange(objectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, field: keyof BudgetObjective, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = { ...newObjectives[index], [field]: value };
    onChange(newObjectives);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Objetivos do Projeto</Label>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={addObjective}
          className="border border-orange-500 bg-white rounded-md"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Adicionar Objetivo
        </Button>
      </div>

      {objectives.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-base-300 rounded-lg">
          <p className="text-sm text-base-content/60">
            Clique em &quot;Adicionar Objetivo&quot; para definir os objetivos do projeto.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {objectives.map((objective, index) => (
            <div key={index} className="p-4 bg-base-200/50 rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Label className="text-xs text-base-content/60 pb-3">
                    Título do Objetivo {index + 1}
                  </Label>
                  <Input
                    value={objective.title}
                    onChange={(e) => updateObjective(index, "title", e.target.value)}
                    placeholder={`Objetivo ${index + 1}`}
                    className="border border-orange-500 rounded-md"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 pt-3 text-error mt-4"
                  onClick={() => removeObjective(index)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label className="text-xs text-base-content/60 pb-3">Descrição</Label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-ring border border-orange-500 rounded-md"
                  value={objective.description}
                  onChange={(e) => updateObjective(index, "description", e.target.value)}
                  placeholder="Descreva o objetivo em detalhes..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
