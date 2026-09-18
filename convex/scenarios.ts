import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { userError } from "./lib/errors";
import { internalMutation, mutation, query } from "./_generated/server";

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
    characterInitialMood: -2,
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
    learningObjectives: [
      "observation",
      "feeling",
      "request",
    ],
    focusArea: "feedback_response",
    orderIndex: 0,
    unlockRequirements: {
      minLevel: 1,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 10,
    tags: ["workplace", "feedback", "emotions"],
    isActive: true,
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
    characterInitialMood: -3,
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
    learningObjectives: [
      "observation",
      "feeling",
      "need",
      "request",
    ],
    focusArea: "responsibility_and_fairness",
    orderIndex: 1,
    unlockRequirements: {
      minLevel: 1,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 10,
    tags: ["family", "fairness", "cooperation"],
    isActive: true,
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
    characterInitialMood: -4,
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
    learningObjectives: [
      "feeling",
      "need",
      "request",
    ],
    focusArea: "friendship_and_reliability",
    orderIndex: 2,
    unlockRequirements: {
      minLevel: 1,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 10,
    tags: ["friendship", "reliability", "empathy"],
    isActive: true,
    createdAt: Date.now(),
  },
];

/**
 * Intermediate scenarios for developing learners
 * Focus on balancing multiple NVC components and handling more complex emotions
 */
export const INTERMEDIATE_SCENARIOS = [
  {
    title: "Romantic Partner Emotional Distance",
    description:
      "Your partner has been emotionally distant for weeks. Navigate this delicate conversation with vulnerability and curiosity while maintaining your own needs.",
    category: "self_expression" as const,
    difficulty: "intermediate" as const,
    characterName: "Casey",
    characterPersonality:
      "Loving but avoidant, tends to withdraw when stressed, cares deeply but struggles with emotional expression",
    characterInitialMood: -5,
    characterBackground:
      "Recently took on a demanding project at work. Has a history of shutting down when overwhelmed. Worried the relationship is failing but doesn't know how to fix it.",
    characterHiddenNeeds: [
      "Space and understanding during stress",
      "Reassurance that they're loved despite pulling away",
      "Help navigating their own overwhelm",
      "Connection without pressure",
    ],
    aiOpeningMessage:
      "I don't know what to say... I know you've noticed I've been distant. I'm just dealing with a lot right now.",
    situation: `Over the past three weeks, your partner Casey has been emotionally withdrawn. They spend time on their phone, go to bed earlier than usual, and barely engage in conversations with you. When you try to talk about your day, they give short responses and seem distracted.

Last night, you felt lonely despite being in the same room. You realize you haven't had a real conversation or physical affection in weeks. You want to express how this is affecting you while staying curious about what they're experiencing.`,
    learningObjectives: [
      "feeling",
      "need",
      "request",
    ],
    focusArea: "emotional_intimacy",
    orderIndex: 3,
    unlockRequirements: {
      minLevel: 2,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 12,
    tags: ["relationship", "intimacy", "empathy"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    title: "Workplace Boundary with Boss",
    description:
      "Your manager expects you to work weekends. Assert your boundaries professionally while maintaining the working relationship.",
    category: "workplace" as const,
    difficulty: "intermediate" as const,
    characterName: "Morgan",
    characterPersonality:
      "Ambitious and results-driven, doesn't intentionally disrespect boundaries but has unclear expectations, works constantly",
    characterInitialMood: -2,
    characterBackground:
      "Senior manager who rose through the ranks by being always available. Unconsciously expects the same from their team. Good intentions but poor boundaries.",
    characterHiddenNeeds: [
      "Project success and recognition",
      "Respect for their leadership",
      "Efficiency and reliability from team",
      "To not be seen as demanding",
    ],
    aiOpeningMessage:
      "I know it's the weekend, but I really need you to polish that presentation. We're pitching Monday and it's crucial. You're my best person on this.",
    situation: `Your manager Morgan has asked you to work on Sunday to finish a presentation. This is the third weekend in a row you're expected to work. You love your job and want to do well, but you also value time for yourself and your family.

You decide you need to have this conversation. You want to express your limits clearly while showing commitment to your work.`,
    learningObjectives: [
      "observation",
      "feeling",
      "need",
      "request",
    ],
    focusArea: "boundary_setting",
    orderIndex: 4,
    unlockRequirements: {
      minLevel: 2,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 12,
    tags: ["workplace", "boundaries", "work-life"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    title: "Friend's Hurtful Comment About Your Appearance",
    description:
      "A close friend made an insensitive comment about how you look. Address the hurt while giving them the benefit of the doubt.",
    category: "friendship" as const,
    difficulty: "intermediate" as const,
    characterName: "Taylor",
    characterPersonality:
      "Blunt and authentic, doesn't filter much, cares about you but has poor social awareness, defensive about feedback",
    characterInitialMood: -1,
    characterBackground:
      "Has always said whatever comes to mind. Thinks honesty is always best. Doesn't realize how comments about appearance affect people.",
    characterHiddenNeeds: [
      "To be accepted as they are",
      "The friendship to stay strong",
      "To not be attacked for their honesty",
      "To understand why this matters",
    ],
    aiOpeningMessage:
      "Oh come on, I was just making an observation. I didn't mean anything by it. You're still beautiful, I was just being real with you.",
    situation: `Yesterday, Taylor said in front of other friends: "You've put on some weight since I last saw you, huh?" You were hurt and embarrassed. They said it casually, as if making an observation about the weather, but it stuck with you.

You value this friendship and don't think Taylor meant to be cruel, but you need them to understand why that comment affected you. You want to address it without either shutting down or attacking them.`,
    learningObjectives: [
      "observation",
      "feeling",
      "request",
    ],
    focusArea: "feedback_and_sensitivity",
    orderIndex: 5,
    unlockRequirements: {
      minLevel: 2,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 11,
    tags: ["friendship", "boundaries", "sensitivity"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    title: "Parent Critical of Your Life Choices",
    description:
      "Your parent questions your career decision. Maintain your autonomy while honoring the relationship.",
    category: "family" as const,
    difficulty: "intermediate" as const,
    characterName: "Pat",
    characterPersonality:
      "Well-intentioned but controlling, worries excessively, comes from a place of love but struggles to respect independence",
    characterInitialMood: -2,
    characterBackground:
      "Comes from a generation where career security was paramount. Has sacrificed their own dreams and wants better for you. Struggles to accept your different values.",
    characterHiddenNeeds: [
      "Reassurance that you'll be okay",
      "To feel respected and listened to",
      "To know their sacrifice mattered",
      "To be part of your important decisions",
    ],
    aiOpeningMessage:
      "I just don't understand why you'd leave a stable job. I'm worried you're making a mistake. You should have listened to me.",
    situation: `Your parent Pat continues to question your decision to leave your corporate job for something more meaningful but less stable. In a recent conversation, they said: "I don't understand why you'd throw away security for some startup dream. I'm worried about your future."

You've heard variations of this criticism for months. You want them to understand and respect your choice while addressing your own feelings about their lack of support.`,
    learningObjectives: [
      "feeling",
      "need",
      "request",
    ],
    focusArea: "parental_independence",
    orderIndex: 6,
    unlockRequirements: {
      minLevel: 2,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 12,
    tags: ["family", "autonomy", "values"],
    isActive: true,
    createdAt: Date.now(),
  },
];

/**
 * Advanced scenarios for experienced learners
 * Focus on complex multi-person dynamics, high emotions, and competing values
 */
export const ADVANCED_SCENARIOS = [
  {
    title: "Team Member Undermining You at Work",
    description:
      "A colleague is taking credit for your ideas in meetings. Navigate this professionally complex situation with both parties present.",
    category: "workplace" as const,
    difficulty: "advanced" as const,
    characterName: "Riley",
    characterPersonality:
      "Competitive and insecure, brilliant but threatened by smart colleagues, ambitious and willing to bend rules for advancement",
    characterInitialMood: -3,
    characterBackground:
      "Came up from a difficult background and is determined to succeed. Uses others' ideas because they feel insecure about their own. Doesn't see it as wrong because they add to the ideas.",
    characterHiddenNeeds: [
      "Recognition for their contributions",
      "Security about their position",
      "To be valued and respected",
      "To not be exposed or shamed",
      "Professional advancement",
    ],
    aiOpeningMessage:
      "I don't know what you mean. I always credit the team. And honestly, I contributed to those ideas too. Why are you making this about you?",
    situation: `In today's leadership meeting, you proposed an innovative feature for your product. Riley, your peer, presented it in the group chat moments later as if it was their idea, adding minor tweaks and presenting it as their own concept.

This is the third time this month. You're angry and feeling unseen, but you also work together daily. You need to address this directly and clearly while maintaining the ability to work together.`,
    learningObjectives: [
      "observation",
      "feeling",
      "request",
    ],
    focusArea: "workplace_conflict",
    orderIndex: 7,
    unlockRequirements: {
      minLevel: 3,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 15,
    tags: ["workplace", "conflict", "boundaries", "professionalism"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    title: "Navigating Different Parenting Styles with Co-Parent",
    description:
      "You and your co-parent disagree on discipline approach. Discuss differing values while prioritizing your child's wellbeing.",
    category: "family" as const,
    difficulty: "advanced" as const,
    characterName: "Jordan",
    characterPersonality:
      "Authoritarian parenting style, believes in consequences and discipline, wants respect and obedience, defensive about parenting choices",
    characterInitialMood: -4,
    characterBackground:
      "Raised in a strict household, believes it made them strong. Frustrated by their child's behavior and feels unsupported by co-parent. Sees gentleness as weakness.",
    characterHiddenNeeds: [
      "Respect for their values and approach",
      "Child to turn out well and be disciplined",
      "Partner to support their authority",
      "To feel like a good parent",
      "Child's respect and obedience",
    ],
    aiOpeningMessage:
      "Your way of parenting is too soft. Kids need consequences or they'll walk all over us. I'm tired of being the bad guy all the time.",
    situation: `You've noticed your child is anxious about making mistakes at school. When they mess up, they shut down emotionally. Your co-parent Jordan believes firm discipline is necessary, but you've learned that your child responds better to understanding and problem-solving.

You're tired of feeling like the "lenient" parent while Jordan gets the credit for discipline. You need to have a real conversation about your differing values and find a way forward that works for both of you and your child.`,
    learningObjectives: [
      "feeling",
      "need",
      "request",
    ],
    focusArea: "parenting_partnership",
    orderIndex: 8,
    unlockRequirements: {
      minLevel: 3,
      requiredScenarios: [],
      minStarsTotal: undefined,
    },
    estimatedDuration: 15,
    tags: ["family", "parenting", "values", "partnership"],
    isActive: true,
    createdAt: Date.now(),
  },
];

// ============================================================================
// CONVEX FUNCTIONS
// ============================================================================

/**
 * Get a specific scenario by ID
 * A private (user-created) scenario is only returned to the user who owns it,
 * so one person's rehearsal can never be opened by anyone else.
 */
export const getById = query({
  args: { scenarioId: v.id("scenarios") },
  handler: async (ctx, args) => {
    const scenario = await ctx.db.get(args.scenarioId);
    if (!scenario) return null;

    if (scenario.visibility === "private") {
      const userId = await getAuthUserId(ctx);
      if (!userId || scenario.ownerId !== userId) {
        return null;
      }
    }

    return scenario;
  },
});

/**
 * List the current user's own (user-created) scenarios, most recent first.
 * Returns an empty array when signed out.
 */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    return await ctx.db
      .query("scenarios")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get scenarios sorted by orderIndex for a user
 * Filtering by unlock requirements must be done in the component
 */
export const listByOrder = query({
  args: {},
  handler: async (ctx) => {
    // User-created scenarios use orderIndex -1 to stay out of the linear
    // ladder; the visibility filter is a second guard so a private scenario
    // can never surface in another user's hub.
    const scenarios = await ctx.db
      .query("scenarios")
      .withIndex("by_order", (q) => q.gt("orderIndex", -1))
      .order("asc")
      .collect();
    return scenarios.filter((s) => s.visibility !== "private");
  },
});

/**
 * Create a new scenario (dashboard/CLI only)
 */
export const create = internalMutation({
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
    characterInitialMood: v.number(),
    characterBackground: v.string(),
    characterHiddenNeeds: v.array(v.string()),
    aiOpeningMessage: v.string(),
    learningObjectives: v.array(v.string()),
    focusArea: v.string(),
    orderIndex: v.number(),
    unlockRequirements: v.object({
      minLevel: v.number(),
      requiredScenarios: v.array(v.id("scenarios")),
      minStarsTotal: v.optional(v.number()),
    }),
    estimatedDuration: v.number(),
    tags: v.array(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scenarios", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Create a personal scenario the user shaped from a real situation in their
 * life. Stored in the shared scenarios table but owned by, and private to, the
 * creator so it flows through the existing roleplay engine unchanged.
 *
 * Model-produced values are clamped/validated defensively before insert.
 */
export const createCustom = mutation({
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
    characterInitialMood: v.number(),
    characterBackground: v.string(),
    characterHiddenNeeds: v.array(v.string()),
    aiOpeningMessage: v.string(),
    learningObjectives: v.array(v.string()),
    focusArea: v.string(),
    estimatedDuration: v.number(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      userError("Not authenticated");
    }

    const now = Date.now();

    // Keep mood inside the engine's -10..+10 band.
    const mood = Math.max(-10, Math.min(10, Math.round(args.characterInitialMood)));

    // Only keep the four real NVC components; fall back to all four.
    const allowedObjectives = ["observation", "feeling", "need", "request"];
    const objectives = args.learningObjectives.filter((o) =>
      allowedObjectives.includes(o)
    );

    const scenarioId = await ctx.db.insert("scenarios", {
      ...args,
      characterInitialMood: mood,
      learningObjectives: objectives.length > 0 ? objectives : allowedObjectives,
      estimatedDuration: Math.max(
        5,
        Math.min(30, Math.round(args.estimatedDuration || 10))
      ),
      orderIndex: -1, // keep out of the linear practice ladder
      unlockRequirements: {
        minLevel: 1, // always available to its creator
        requiredScenarios: [],
        minStarsTotal: undefined,
      },
      isActive: true,
      ownerId: userId,
      visibility: "private" as const,
      source: "user_created" as const,
      createdAt: now,
      updatedAt: now,
    });

    return scenarioId;
  },
});

/**
 * Delete one of the user's own (user-created) scenarios, along with its
 * practice history. Only the owner can delete it. Built-in library scenarios
 * can never be deleted through here.
 */
export const deleteCustom = mutation({
  args: { scenarioId: v.id("scenarios") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      userError("Not authenticated");
    }

    const scenario = await ctx.db.get(args.scenarioId);
    if (!scenario) {
      return { success: true }; // already gone
    }

    if (scenario.ownerId !== userId) {
      userError("You can only delete your own scenarios");
    }

    // Remove the conversations and progress tied to this scenario so nothing
    // is left orphaned. These all belong to the owner (the scenario is private).
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
      .collect();
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    const progressRecords = await ctx.db
      .query("scenarioProgress")
      .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
      .collect();
    for (const progress of progressRecords) {
      await ctx.db.delete(progress._id);
    }

    await ctx.db.delete(args.scenarioId);

    return { success: true };
  },
});

/**
 * Seed beginner scenarios into the database
 * Run this once to populate initial data
 *
 * Usage: npx convex run scenarios:seedBeginner
 */
export const seedBeginner = internalMutation({
  args: {},
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

/**
 * Seed all scenarios (beginner, intermediate, advanced)
 * Run this once to populate complete scenario library
 *
 * Usage: npx convex run scenarios:seedAll
 */
export const seedAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Count only the built-in library. Daily-challenge scenarios (orderIndex
    // -1) and user-created ones also live in this table, so counting every row
    // would let the midnight cron permanently block seeding a fresh deployment.
    const existingBuiltIns = await ctx.db
      .query("scenarios")
      .withIndex("by_order", (q) => q.gte("orderIndex", 0))
      .collect();

    if (existingBuiltIns.length > 0) {
      return {
        success: false,
        message: `Scenarios table already has ${existingBuiltIns.length} built-in scenarios. Skipping seed.`,
        existingScenarios: existingBuiltIns.length,
      };
    }

    const createdIds = [];
    const allScenarios = [
      ...BEGINNER_SCENARIOS,
      ...INTERMEDIATE_SCENARIOS,
      ...ADVANCED_SCENARIOS,
    ];

    for (const scenario of allScenarios) {
      const id = await ctx.db.insert("scenarios", scenario);
      createdIds.push(id);
    }

    return {
      success: true,
      message: `Seeded ${createdIds.length} scenarios (3 beginner, 4 intermediate, 2 advanced)`,
      scenarioIds: createdIds,
      breakdown: {
        beginner: BEGINNER_SCENARIOS.length,
        intermediate: INTERMEDIATE_SCENARIOS.length,
        advanced: ADVANCED_SCENARIOS.length,
      },
    };
  },
});
