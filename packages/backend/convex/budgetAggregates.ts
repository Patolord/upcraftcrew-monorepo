import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation,
} from "./_generated/server";
import { TableAggregate } from "@convex-dev/aggregate";
import { Triggers } from "convex-helpers/server/triggers";
import { customMutation, customCtx } from "convex-helpers/server/customFunctions";

/**
 * Aggregate keyed by [currency, status] for efficient per-currency
 * count/sum breakdown by status.
 */
export const budgetsByStatus = new TableAggregate<{
  Key: [string, string];
  DataModel: DataModel;
  TableName: "budgets";
}>(components.budgetsByStatus, {
  sortKey: (doc) => [doc.currency, doc.status],
  sumValue: (doc) => doc.totalAmount,
});

/**
 * Aggregate keyed by currency alone for global per-currency count/sum.
 */
export const budgetsByCurrency = new TableAggregate<{
  Key: string;
  DataModel: DataModel;
  TableName: "budgets";
}>(components.budgetsByCurrency, {
  sortKey: (doc) => doc.currency,
  sumValue: (doc) => doc.totalAmount,
});

const triggers = new Triggers<DataModel>();
triggers.register("budgets", budgetsByStatus.trigger());
triggers.register("budgets", budgetsByCurrency.trigger());

export const mutationWithBudgetTriggers = customMutation(rawMutation, customCtx(triggers.wrapDB));

export const internalMutationWithBudgetTriggers = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);
