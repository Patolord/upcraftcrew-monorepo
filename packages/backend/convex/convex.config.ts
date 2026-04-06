import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config.js";

const app = defineApp();

app.use(aggregate, { name: "budgetsByStatus" });
app.use(aggregate, { name: "budgetsByCurrency" });

export default app;
