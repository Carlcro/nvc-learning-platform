import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Scenarios for NVC roleplay practice
 *
 * Each scenario defines an AI character and situation for users to practice
 * compassionate communication. Scenarios progress from beginner to advanced.
 */

// ============================================================================
// SCENARIO DATA
// ============================================================================

/**
 * Beginner scenarios for new learners
 * Focus on single NVC components and forgiving character responses
 */
export const BEGINNER_SCENARIOS = [
  {
    title: "Colleague Feedback",
    description:
      "Your coworker gave you critical feedback during a team meeting and you felt blindsided. Practice expressing your feelings without blame.",
    category: "workplace" as const,
    difficulty: "beginner" as const,
    characterName: "Jordan",
    characterPersonality:
      "Direct and detail-oriented, values efficiency and honest feedback, not intentionally hurtful",
    characterEmotionalState:
      "Neutral to slightly defensive, doesn't realize the impact of their words",
    characterBackground:
      "Project manager with a results-oriented approach. Tends to prioritize productivity over emotional awareness.",
    characterHiddenNeeds: [
      "Respect for their directness",
      "Efficiency in teamwork",
      "Being understood as well-intentioned",
    ],
    aiOpeningMessage:
      "Look, I was just giving you honest feedback. You know I'm always straightforward. Is there an issue with what I said?",
    situation: `During today's team standup, Jordan said: "Your code review process is too slow. It's holding up the team."

You felt embarrassed and hurt that this was said in front of everyone. This is your chance to respond to Jordan and express how you felt, what you need, and what might work better moving forward.`,
    learningGoals: [
      "Practice separating observation from judgment",
      "Express feelings without blame",
      "Identify what's important to you (a universal need)",
      "Make a clear request for future communication",
    ],
    unlockLevel: 1,
    estimatedDuration: 8,
    createdAt: Date.now(),
  },
  {
    title: "Family Responsibility Conflict",
    description:
      "You feel frustrated that your sibling isn't helping with household chores as promised. Learn to express your needs without accusation.",
    category: "family" as const,
    difficulty: "beginner" as const,
    characterName: "Alex",
    characterPersonality:
      "Busy with work, feels guilty about not helping, can be defensive if attacked, cares about family",
    characterEmotionalState:
      "Stressed about work, guilty but defensive, not wanting to feel blamed",
    characterBackground:
      "Alex recently took on extra responsibilities at work and is struggling to balance everything. They feel overwhelmed and sometimes shut down when confronted.",
    characterHiddenNeeds: [
      "Compassion for their workload",
      "To not be blamed or shamed",
      "Support rather than criticism",
    ],
    aiOpeningMessage:
      "Hey, I know I've been slacking on chores. I've just had so much going on at work. Can't we talk about this when I'm less stressed?",
    situation: `You agreed with your sibling Alex that you'd share household chores equally. Last weekend, you did most of the cleaning while Alex said they were too busy.

Today, you notice the kitchen is messy again and Alex is relaxing on the couch. You're feeling frustrated and want to address this. This is your chance to express what you're observing and how it affects you.`,
    learningGoals: [
      "Describe specific behaviors without blame",
      "Name the feeling underneath your frustration",
      "Connect to what matters to you (respect, fairness, cooperation)",
      "Request specific actions going forward",
    ],
    unlockLevel: 1,
    estimatedDuration: 8,
    createdAt: Date.now(),
  },
  {
    title: "Friend Canceled Plans",
    description:
      "Your friend canceled your plans at the last minute again. Practice expressing disappointment while staying open and curious.",
    category: "friendship" as const,
    difficulty: "beginner" as const,
    characterName: "Sam",
    characterPersonality:
      "Genuine and caring, has a chaotic schedule, sometimes over-commits, struggles with organization",
    characterEmotionalState:
      "Stressed and guilty about canceling again, anxious about the friendship strain",
    characterBackground:
      "Sam is juggling a demanding job with personal commitments. They deeply value the friendship but have difficulty saying no and managing their time.",
    characterHiddenNeeds: [
      "Understanding and acceptance",
      "To not be abandoned due to their struggles",
      "Space to be imperfect",
    ],
    aiOpeningMessage:
      "Hey, I'm so sorry, something came up at work. I feel terrible about this. I know I keep doing this... do you hate me?",
    situation: `You had plans to meet Sam this evening to catch a movie and grab dinner. An hour before you were supposed to meet, Sam texted: "Hey, I'm so sorry, something came up at work. Can we reschedule?"

This is the third time in two months Sam has canceled. You're disappointed and hurt, but you also care about the friendship. You want to express how this pattern affects you while staying open to understanding what's going on with them.`,
    learningGoals: [
      "Acknowledge your feelings without making Sam the villain",
      "Express the impact of their actions on you",
      "Share what you need from the friendship",
      "Stay curious about their perspective",
    ],
    unlockLevel: 1,
    estimatedDuration: 8,
    createdAt: Date.now(),
  },
];

// ============================================================================
// CONVEX FUNCTIONS
// ============================================================================

/**
 * List all scenarios (with filtering options for future)
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("scenarios").collect();
  },
});

/**
 * Get a specific scenario by ID
 */
export const getById = query({
  args: { scenarioId: v.id("scenarios") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scenarioId);
  },
});

/**
 * Get scenarios by category
 */
export const listByCategory = query({
  args: {
    category: v.union(
      v.literal("workplace"),
      v.literal("family"),
      v.literal("friendship"),
      v.literal("self_expression")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scenarios")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

/**
 * Get scenarios by difficulty level
 */
export const listByDifficulty = query({
  args: {
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scenarios")
      .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty))
      .collect();
  },
});

/**
 * Get scenarios available to a user based on their level
 */
export const listAvailableForUser = query({
  args: { userLevel: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scenarios")
      .withIndex("by_level", (q) => q.lte("unlockLevel", args.userLevel))
      .collect();
  },
});

/**
 * Create a new scenario (admin/seed function)
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("workplace"),
      v.literal("family"),
      v.literal("friendship"),
      v.literal("self_expression")
    ),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    situation: v.string(),
    characterName: v.string(),
    characterPersonality: v.string(),
    characterEmotionalState: v.string(),
    characterBackground: v.string(),
    characterHiddenNeeds: v.array(v.string()),
    aiOpeningMessage: v.string(),
    learningGoals: v.array(v.string()),
    unlockLevel: v.number(),
    estimatedDuration: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scenarios", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Seed beginner scenarios into the database
 * Run this once to populate initial data
 *
 * Usage: npx convex run scenarios:seedBeginner
 */
export const seedBeginner = mutation({
  handler: async (ctx) => {
    const existingCount = await ctx.db.query("scenarios").collect();

    // Only seed if scenarios table is empty
    if (existingCount.length > 0) {
      return {
        success: false,
        message: `Scenarios table already has ${existingCount.length} scenarios. Skipping seed.`,
      };
    }

    const createdIds = [];

    for (const scenario of BEGINNER_SCENARIOS) {
      const id = await ctx.db.insert("scenarios", scenario);
      createdIds.push(id);
    }

    return {
      success: true,
      message: `Seeded ${createdIds.length} beginner scenarios`,
      scenarioIds: createdIds,
    };
  },
});
