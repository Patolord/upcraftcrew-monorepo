/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as budgets from "../budgets.js";
import type * as clients from "../clients.js";
import type * as errors from "../errors.js";
import type * as finance from "../finance.js";
import type * as healthCheck from "../healthCheck.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as privateData from "../privateData.js";
import type * as projects from "../projects.js";
import type * as schedule from "../schedule.js";
import type * as seed from "../seed.js";
import type * as subtasks from "../subtasks.js";
import type * as taskComments from "../taskComments.js";
import type * as taskLabels from "../taskLabels.js";
import type * as tasks from "../tasks.js";
import type * as team from "../team.js";
import type * as userAccess from "../userAccess.js";
import type * as users from "../users.js";

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  budgets: typeof budgets;
  clients: typeof clients;
  errors: typeof errors;
  finance: typeof finance;
  healthCheck: typeof healthCheck;
  http: typeof http;
  migrations: typeof migrations;
  privateData: typeof privateData;
  projects: typeof projects;
  schedule: typeof schedule;
  seed: typeof seed;
  subtasks: typeof subtasks;
  taskComments: typeof taskComments;
  taskLabels: typeof taskLabels;
  tasks: typeof tasks;
  team: typeof team;
  userAccess: typeof userAccess;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;

export declare const components: {};
