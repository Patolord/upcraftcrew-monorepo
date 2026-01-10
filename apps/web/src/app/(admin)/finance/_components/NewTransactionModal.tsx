"use client";

import { useId } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCurrency, type Currency } from "@/contexts/CurrencyContext";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const transactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["pending", "completed", "failed"]),
  date: z.string().min(1, "Date is required"),
  clientId: z.string(),
  projectId: z.string(),
  currency: z.string().min(1, "Currency is required"),
});

function formatErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Invalid value";
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const { formatAmount, config, currency, CURRENCIES } = useCurrency();
  const createTransaction = useMutation(api.finance.createTransaction);
  const projects = useQuery(api.projects.getProjects);
  const formId = useId();

  // Validate currency exists in CURRENCIES
  const validCurrency =
    currency && CURRENCIES[currency as keyof typeof CURRENCIES] ? currency : "USD";

  const categories = {
    income: [
      "Project Payment",
      "Consulting",
      "Retainer",
      "Licensing",
      "Investment",
      "Other Income",
    ],
    expense: [
      "Salaries",
      "Software & Tools",
      "Marketing",
      "Office Rent",
      "Equipment",
      "Travel",
      "Training",
      "Other Expense",
    ],
  };

  const form = useForm({
    defaultValues: {
      description: "",
      amount: 0,
      type: "income" as "income" | "expense",
      category: "",
      status: "pending" as "pending" | "completed" | "failed",
      date: new Date().toISOString().split("T")[0],
      clientId: "",
      projectId: "",
      currency: validCurrency,
    },
    onSubmit: async ({ value }) => {
      try {
        await createTransaction({
          description: value.description,
          amount: value.amount,
          type: value.type,
          category: value.category,
          status: value.status,
          date: new Date(value.date).getTime(),
          clientId: value.clientId || undefined,
          projectId: value.projectId ? (value.projectId as Id<"projects">) : undefined,
        });

        toast.success("Transaction created successfully!");
        form.reset();
        onClose();
      } catch (error) {
        console.error("Failed to create transaction:", error);
        toast.error("Failed to create transaction. Please try again.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add New Transaction</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <div className="form-control">
                <label htmlFor={`${formId}-description`} className="label">
                  <span className="label-text">Description *</span>
                </label>
                <input
                  id={`${formId}-description`}
                  type="text"
                  className="input input-bordered"
                  placeholder="e.g., Website Development Payment"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formatErrorMessage(field.state.meta.errors[0])}
                    </span>
                  </label>
                )}
              </div>
            )}
          </form.Field>

          {/* Type, Amount and Currency */}
          <div className="grid grid-cols-3 gap-4">
            <form.Field name="type">
              {(field) => (
                <div className="form-control">
                  <label htmlFor={`${formId}-type`} className="label">
                    <span className="label-text">Type *</span>
                  </label>
                  <select
                    id={`${formId}-type`}
                    className="select select-bordered"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value as "income" | "expense");
                      // Reset category when type changes
                      form.setFieldValue("category", "");
                    }}
                    onBlur={field.handleBlur}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              )}
            </form.Field>
            <form.Field name="amount">
              {(field) => (
                <div className="form-control">
                  <label htmlFor={`${formId}-amount`} className="label">
                    <span className="label-text">Amount *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200 px-4 flex items-center border border-base-300 border-r-0 rounded-l-lg">
                      {CURRENCIES[form.state.values.currency as keyof typeof CURRENCIES]?.symbol ||
                        "$"}
                    </span>
                    <input
                      id={`${formId}-amount`}
                      type="number"
                      className="input input-bordered w-full rounded-l-none"
                      step="0.01"
                      min="0"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {formatErrorMessage(field.state.meta.errors[0])}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field name="currency">
              {(field) => (
                <div className="form-control">
                  <label htmlFor={`${formId}-currency`} className="label">
                    <span className="label-text">Currency *</span>
                  </label>
                  <select
                    id={`${formId}-currency`}
                    className="select select-bordered"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as Currency)}
                    onBlur={field.handleBlur}
                  >
                    {Object.values(CURRENCIES).map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>
          </div>

          {/* Category */}
          <form.Field name="category">
            {(field) => (
              <div className="form-control">
                <label htmlFor={`${formId}-category`} className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select
                  id={`${formId}-category`}
                  className="select select-bordered"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                >
                  <option value="">Select Category</option>
                  {categories[form.state.values.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors.length > 0 && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formatErrorMessage(field.state.meta.errors[0])}
                    </span>
                  </label>
                )}
              </div>
            )}
          </form.Field>

          {/* Status and Date */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="status">
              {(field) => (
                <div className="form-control">
                  <label htmlFor={`${formId}-status`} className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    id={`${formId}-status`}
                    className="select select-bordered"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as "pending" | "completed" | "failed")
                    }
                    onBlur={field.handleBlur}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              )}
            </form.Field>
            <form.Field name="date">
              {(field) => (
                <div className="form-control">
                  <label htmlFor={`${formId}-date`} className="label">
                    <span className="label-text">Date *</span>
                  </label>
                  <input
                    id={`${formId}-date`}
                    type="date"
                    className="input input-bordered"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {formatErrorMessage(field.state.meta.errors[0])}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Client ID */}
          <form.Field name="clientId">
            {(field) => (
              <div className="form-control">
                <label htmlFor={`${formId}-client`} className="label">
                  <span className="label-text">Client/Vendor (optional)</span>
                </label>
                <input
                  id={`${formId}-client`}
                  type="text"
                  className="input input-bordered"
                  placeholder="Client or Vendor name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          {/* Project */}
          <form.Field name="projectId">
            {(field) => (
              <div className="form-control">
                <label htmlFor={`${formId}-project`} className="label">
                  <span className="label-text">Related Project (optional)</span>
                </label>
                <select
                  id={`${formId}-project`}
                  className="select select-bordered"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                >
                  <option value="">None</option>
                  {projects?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name} - {project.client}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          {/* Amount Preview */}
          <div
            className={`alert ${form.state.values.type === "income" ? "alert-success" : "alert-error"}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`iconify ${form.state.values.type === "income" ? "lucide--arrow-down-circle" : "lucide--arrow-up-circle"} size-5`}
              />
              <div className="flex-1">
                <p className="font-semibold">
                  {form.state.values.type === "income" ? "Income" : "Expense"}: {(() => {
                    const currencyData =
                      CURRENCIES[form.state.values.currency as keyof typeof CURRENCIES];
                    if (!currencyData) {
                      return `${form.state.values.currency} ${form.state.values.amount.toFixed(2)}`;
                    }
                    return new Intl.NumberFormat(currencyData.locale, {
                      style: "currency",
                      currency: form.state.values.currency,
                    }).format(form.state.values.amount);
                  })()}
                </p>
                <p className="text-xs opacity-80">
                  {form.state.values.category || "No category selected"} •{" "}
                  {CURRENCIES[form.state.values.currency as keyof typeof CURRENCIES]?.name ||
                    form.state.values.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <Button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={form.state.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn btn-primary" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Add Transaction"
              )}
            </Button>
          </div>
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}
