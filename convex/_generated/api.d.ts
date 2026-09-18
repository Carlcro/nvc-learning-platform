/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as conversations from "../conversations.js";
import type * as crons from "../crons.js";
import type * as dailyChallenges from "../dailyChallenges.js";
import type * as dailyChallengesGeneration from "../dailyChallengesGeneration.js";
import type * as feelings_seed from "../feelings/seed.js";
import type * as feelings from "../feelings.js";
import type * as feelingsProgress from "../feelingsProgress.js";
import type * as feelingsQuiz from "../feelingsQuiz.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_limits from "../lib/limits.js";
import type * as lib_progress from "../lib/progress.js";
import type * as passwordReset from "../passwordReset.js";
import type * as scenarioProgress from "../scenarioProgress.js";
import type * as scenarios from "../scenarios.js";
import type * as seed from "../seed.js";
import type * as usage from "../usage.js";
import type * as userProgress from "../userProgress.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  conversations: typeof conversations;
  crons: typeof crons;
  dailyChallenges: typeof dailyChallenges;
  dailyChallengesGeneration: typeof dailyChallengesGeneration;
  "feelings/seed": typeof feelings_seed;
  feelings: typeof feelings;
  feelingsProgress: typeof feelingsProgress;
  feelingsQuiz: typeof feelingsQuiz;
  http: typeof http;
  lessons: typeof lessons;
  "lib/errors": typeof lib_errors;
  "lib/limits": typeof lib_limits;
  "lib/progress": typeof lib_progress;
  passwordReset: typeof passwordReset;
  scenarioProgress: typeof scenarioProgress;
  scenarios: typeof scenarios;
  seed: typeof seed;
  usage: typeof usage;
  userProgress: typeof userProgress;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
