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
    characterEmotionalState:
      "Withdrawn and defensive, carrying their own stress from work, guilt about distance, fear of abandonment",
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
    learningGoals: [
      "Express vulnerability about the relationship impact",
      "Balance your needs with curiosity about their experience",
      "Navigate competing needs with empathy",
      "Make a request that honors both people's needs",
      "Stay connected during a tense conversation",
    ],
    unlockLevel: 3,
    estimatedDuration: 12,
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
    characterEmotionalState:
      "Stressed about project deadlines, sees work as more important than personal time, surprised by pushback",
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
    learningGoals: [
      "Set a boundary without guilt or aggression",
      "Acknowledge their needs while honoring your own",
      "Propose creative solutions to the real problem",
      "Build trust while maintaining limits",
      "Use observations instead of accusations",
    ],
    unlockLevel: 3,
    estimatedDuration: 10,
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
    characterEmotionalState:
      "Confused about why this is a problem, defensive about their intent, unaware of the impact",
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
    learningGoals: [
      "Express the impact of words without assuming bad intent",
      "Help someone understand how comments land differently than intended",
      "Balance authenticity with kindness in friendship",
      "Request the kind of honesty and feedback you actually want",
      "Maintain the friendship while setting expectations",
    ],
    unlockLevel: 3,
    estimatedDuration: 10,
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
    characterEmotionalState:
      "Anxious about your security, disappointed you didn't follow their advice, fearful you'll regret your choice",
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
    learningGoals: [
      "Stand firm in your choices while honoring their perspective",
      "Express feelings without being defensive",
      "Help a worried parent understand your values",
      "Request support even if they disagree",
      "Maintain relationship boundaries across generations",
    ],
    unlockLevel: 3,
    estimatedDuration: 12,
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
    characterEmotionalState:
      "Defensive and justifying their behavior, feels threatened by your competence, guilty but resistant to admitting it",
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
    learningGoals: [
      "Express anger without aggression or accusation",
      "Handle a confrontational person who denies the problem",
      "Maintain professionalism in a tense situation",
      "Set boundaries that actually stick",
      "Request behavior change from a defensive peer",
      "Use observations to counter denial tactics",
    ],
    unlockLevel: 5,
    estimatedDuration: 15,
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
    characterEmotionalState:
      "Worried about child growing up too soft, frustrated with perceived leniency, defensive about criticism",
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
    learningGoals: [
      "Express deep values without judgment of different approaches",
      "Find common ground on differing parenting philosophies",
      "Acknowledge valid points in opposing views",
      "Present evidence and observations, not criticism",
      "Request partnership rather than compliance",
      "Handle high emotion (parenting involves kids) with NVC",
      "Work toward solutions that honor both people's needs",
    ],
    unlockLevel: 5,
    estimatedDuration: 15,
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

/**
 * Seed all scenarios (beginner, intermediate, advanced)
 * Run this once to populate complete scenario library
 *
 * Usage: npx convex run scenarios:seedAll
 */
export const seedAll = mutation({
  handler: async (ctx) => {
    const existingCount = await ctx.db.query("scenarios").collect();

    // Only seed if scenarios table is empty
    if (existingCount.length > 0) {
      return {
        success: false,
        message: `Scenarios table already has ${existingCount.length} scenarios. Skipping seed.`,
        existingScenarios: existingCount.length,
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
