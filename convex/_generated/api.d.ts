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
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as contentTranslations_index from "../contentTranslations/index.js";
import type * as contentTranslations_needs from "../contentTranslations/needs.js";
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
import type * as lib_adminStats from "../lib/adminStats.js";
import type * as lib_contentText from "../lib/contentText.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_limits from "../lib/limits.js";
import type * as lib_locale from "../lib/locale.js";
import type * as lib_localizeContent from "../lib/localizeContent.js";
import type * as lib_modelUsage from "../lib/modelUsage.js";
import type * as lib_progress from "../lib/progress.js";
import type * as lib_promptLanguage from "../lib/promptLanguage.js";
import type * as lib_scenarioText from "../lib/scenarioText.js";
import type * as lib_userProgressWrite from "../lib/userProgressWrite.js";
import type * as passwordReset from "../passwordReset.js";
import type * as scenarioProgress from "../scenarioProgress.js";
import type * as scenarioTranslations_es from "../scenarioTranslations/es.js";
import type * as scenarioTranslations_fr from "../scenarioTranslations/fr.js";
import type * as scenarioTranslations_index from "../scenarioTranslations/index.js";
import type * as scenarioTranslations_sv from "../scenarioTranslations/sv.js";
import type * as scenarios from "../scenarios.js";
import type * as scoreCalibration from "../scoreCalibration.js";
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
  admin: typeof admin;
  ai: typeof ai;
  auth: typeof auth;
  "contentTranslations/index": typeof contentTranslations_index;
  "contentTranslations/needs": typeof contentTranslations_needs;
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
  "lib/adminStats": typeof lib_adminStats;
  "lib/contentText": typeof lib_contentText;
  "lib/errors": typeof lib_errors;
  "lib/limits": typeof lib_limits;
  "lib/locale": typeof lib_locale;
  "lib/localizeContent": typeof lib_localizeContent;
  "lib/modelUsage": typeof lib_modelUsage;
  "lib/progress": typeof lib_progress;
  "lib/promptLanguage": typeof lib_promptLanguage;
  "lib/scenarioText": typeof lib_scenarioText;
  "lib/userProgressWrite": typeof lib_userProgressWrite;
  passwordReset: typeof passwordReset;
  scenarioProgress: typeof scenarioProgress;
  "scenarioTranslations/es": typeof scenarioTranslations_es;
  "scenarioTranslations/fr": typeof scenarioTranslations_fr;
  "scenarioTranslations/index": typeof scenarioTranslations_index;
  "scenarioTranslations/sv": typeof scenarioTranslations_sv;
  scenarios: typeof scenarios;
  scoreCalibration: typeof scoreCalibration;
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
