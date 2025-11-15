import { query, mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

/**
 * Get all progress records for the current user
 * Returns an array of scenarioProgress entries, sorted by scenario orderIndex
 */
export const getUserProgress = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const progress = await ctx.db
      .query("scenarioProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    return progress
  },
})

/**
 * Get progress for a specific scenario for the current user
 */
export const getScenarioProgress = query({
  args: { scenarioId: v.id("scenarios") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const progress = await ctx.db
      .query("scenarioProgress")
      .withIndex("by_user_and_scenario", (q) =>
        q.eq("userId", userId).eq("scenarioId", args.scenarioId)
      )
      .first()

    return progress || null
  },
})

/**
 * Initialize scenario progress when user starts a new scenario
 * Creates a scenarioProgress record if it doesn't exist
 */
export const initializeScenarioProgress = mutation({
  args: { scenarioId: v.id("scenarios") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new Error("Not authenticated")
    }

    // Check if progress already exists
    const existing = await ctx.db
      .query("scenarioProgress")
      .withIndex("by_user_and_scenario", (q) =>
        q.eq("userId", userId).eq("scenarioId", args.scenarioId)
      )
      .first()

    if (existing) {
      return existing
    }

    // Create new progress record
    const progressId = await ctx.db.insert("scenarioProgress", {
      userId,
      scenarioId: args.scenarioId,
      status: "available",
      attempts: 0,
      bestScore: 0,
      bestStars: 0,
      lastAttemptAt: Date.now(),
      objectivesCompleted: [],
      conversationIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return await ctx.db.get(progressId)
  },
})

/**
 * Update scenario progress after conversation completion
 */
export const updateScenarioProgress = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    score: v.number(),
    stars: v.number(),
    status: v.union(
      v.literal("locked"),
      v.literal("available"),
      v.literal("in_progress"),
      v.literal("attempted"),
      v.literal("passed"),
      v.literal("mastered")
    ),
    conversationId: v.id("conversations"),
    objectivesCompleted: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new Error("Not authenticated")
    }

    let progress = await ctx.db
      .query("scenarioProgress")
      .withIndex("by_user_and_scenario", (q) =>
        q.eq("userId", userId).eq("scenarioId", args.scenarioId)
      )
      .first()

    if (!progress) {
      throw new Error("Scenario progress not found")
    }

    // Update best score and stars
    const newBestScore = Math.max(progress.bestScore, args.score)
    const newBestStars = Math.max(progress.bestStars, args.stars)
    const isNewBestScore = args.score > progress.bestScore

    // Update first completion if needed
    const isFirstCompletion =
      progress.status === "available" || progress.status === "in_progress"

    const update: any = {
      status: args.status,
      attempts: progress.attempts + 1,
      bestScore: newBestScore,
      bestStars: newBestStars,
      lastScore: args.score,
      lastAttemptAt: Date.now(),
      objectivesCompleted: [
        ...new Set([...progress.objectivesCompleted, ...args.objectivesCompleted]),
      ],
      conversationIds: [...progress.conversationIds, args.conversationId],
      updatedAt: Date.now(),
    }

    // Update bestConversationId if this is a new best score
    if (isNewBestScore) {
      update.bestConversationId = args.conversationId
    }

    if (isFirstCompletion) {
      update.firstCompletedAt = Date.now()
      update.firstCompletionScore = args.score
      update.firstCompletionStars = args.stars
    }

    await ctx.db.patch(progress._id, update)
    return await ctx.db.get(progress._id)
  },
})

/**
 * Determine if a scenario is unlocked for the user
 * Helper function to check unlock requirements
 */
export const isScenarioUnlocked = query({
  args: { scenarioId: v.id("scenarios") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return false
    }

    // Get the scenario
    const scenario = await ctx.db.get(args.scenarioId)
    if (!scenario) {
      return false
    }

    // Get user level from userProgress table
    const userProgressRecord = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first()
    const userLevel = userProgressRecord?.level || 1

    // Check minLevel requirement
    if (userLevel < scenario.unlockRequirements.minLevel) {
      return false
    }

    // Check required scenarios
    if (scenario.unlockRequirements.requiredScenarios.length > 0) {
      for (const requiredScenarioId of scenario.unlockRequirements.requiredScenarios) {
        const requiredProgress = await ctx.db
          .query("scenarioProgress")
          .withIndex("by_user_and_scenario", (q) =>
            q.eq("userId", userId).eq("scenarioId", requiredScenarioId)
          )
          .first()

        if (!requiredProgress || requiredProgress.status === "locked") {
          return false
        }
      }
    }

    return true
  },
})
