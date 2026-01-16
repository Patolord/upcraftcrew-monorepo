"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon } from "lucide-react";
import React from "react";

interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BudgetFormItemsProps {
  items: BudgetItem[];
  onChange: (items: BudgetItem[]) => void;
}

export function BudgetFormItems({ items, onChange }: BudgetFormItemsProps) {
  const addItem = () => {
    onChange([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BudgetItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === "description") {
      item.description = value as string;
    } else if (field === "quantity") {
      item.quantity = Number(value) || 0;
      item.total = item.quantity * item.unitPrice;
    } else if (field === "unitPrice") {
      item.unitPrice = Number(value) || 0;
      item.total = item.quantity * item.unitPrice;
    }

    newItems[index] = item;
    onChange(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Itens do Investimento</Label>
        <Button variant="outline" size="sm" onClick={addItem}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Adicionar Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-base-300 rounded-lg">
          <p className="text-sm text-base-content/60">
            Nenhum item adicionado. Clique em &quot;Adicionar Item&quot; para começar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 items-start p-3 bg-base-200/50 rounded-lg"
            >
              <div className="col-span-5">
                <Label className="text-xs text-base-content/60">Descrição</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Ex: Desenvolvimento do site"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-base-content/60">Qtd</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-base-content/60">Preço Unit.</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-base-content/60">Total</Label>
                <Input
                  type="number"
                  value={item.total.toFixed(2)}
                  disabled
                  className="bg-base-200"
                />
              </div>
              <div className="col-span-1 pt-5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-error"
                  onClick={() => removeItem(index)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-end pt-2 border-t border-base-300">
            <div className="text-right">
              <p className="text-xs text-base-content/60">Total Geral</p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
