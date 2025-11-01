import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * NVC Learning App Database Schema
 *
 * This schema defines all data models for the Non-Violent Communication
 * learning platform. See project-spec.md for complete documentation.
 */

export default defineSchema({
  // ============================================================================
  // USERS & AUTHENTICATION
  // ============================================================================

  /**
   * Core user profile data
   * Stores authentication and progress information
   */
  users: defineTable({
    clerkId: v.string(), // External auth provider ID
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    currentStreak: v.number(), // Current daily challenge streak
    longestStreak: v.number(), // Longest streak achieved
    totalPoints: v.number(), // Total points earned
    level: v.number(), // User skill level (1-10)
    createdAt: v.number(), // Timestamp when user joined
    updatedAt: v.number(), // Last profile update
  })
    .index("by_clerk_id", ["clerkId"]) // Quick lookup by auth ID
    .index("by_email", ["email"]),

  // ============================================================================
  // PROGRESS TRACKING
  // ============================================================================

  /**
   * User progress for lessons (Phase 1 content)
   * Tracks completion and scores for each lesson
   */
  userProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.string(), // Matches lesson definition
    completed: v.boolean(),
    score: v.number(), // 0-100
    attempts: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_lesson", ["userId", "lessonId"]),

  // ============================================================================
  // SCENARIOS (AI Roleplay)
  // ============================================================================

  /**
   * Roleplay scenarios for users to practice NVC
   * Each scenario has an AI character and learning goals
   * See AI_ROLEPLAY_FEATURE_SUMMARY.md "Scenario Structure" section
   */
  scenarios: defineTable({
    title: v.string(), // Short, descriptive name
    description: v.string(), // Brief description for scenario browser
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
    // ============ Situation Context ============
    situation: v.string(), // 2-3 sentences setting up the conflict
    // ============ Character Profile ============
    characterName: v.string(), // Name of the AI character
    characterPersonality: v.string(), // Personality traits (e.g., "Stressed, defensive, values competence")
    characterEmotionalState: v.string(), // Current emotional state (e.g., "Anxious, overwhelmed, guilty")
    characterBackground: v.string(), // Background and motivation context
    characterHiddenNeeds: v.array(v.string()), // Character's needs (hidden from user, used by AI)
    aiOpeningMessage: v.string(), // The AI's opening statement to start conversation
    // ============ Learning & Progression ============
    learningGoals: v.array(v.string()), // What NVC skills this scenario practices
    unlockLevel: v.number(), // Min user level required (1-10)
    estimatedDuration: v.number(), // Minutes to complete
    // ============ Metadata ============
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"])
    .index("by_level", ["unlockLevel"]),

  // ============================================================================
  // CONVERSATIONS & MESSAGING
  // ============================================================================

  /**
   * NVC Score data structure (nested in messages)
   * Stored separately for reuse
   */
  // Note: NVC scores are stored inline within messages array

  /**
   * Conversations - Main chat history for AI roleplay
   * Each conversation has multiple messages with NVC analysis
   * See project-spec.md "NVC Scoring Algorithm" section
   */
  conversations: defineTable({
    userId: v.id("users"),
    scenarioId: v.id("scenarios"),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),
        // NVC scoring data (only for user messages)
        nvcScore: v.optional(
          v.object({
            observation: v.number(), // 0-25
            feeling: v.number(), // 0-25
            need: v.number(), // 0-25
            request: v.number(), // 0-25
            total: v.number(), // 0-100
          })
        ),
        feedback: v.optional(v.string()), // Coaching feedback
        isJackalLanguage: v.optional(v.boolean()), // Jackal/giraffe classification
        jackalPhrases: v.optional(v.array(v.string())), // Specific judgment phrases
        giraffeAlternative: v.optional(v.string()), // Suggested rephrasing
        whatWentWell: v.optional(v.string()), // Specific praise
      })
    ),
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    finalScore: v.optional(v.number()), // Avg of all message scores
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_scenario", ["scenarioId"])
    .index("by_user_and_scenario", ["userId", "scenarioId"])
    .index("by_status", ["status"]),

  // ============================================================================
  // DAILY CHALLENGES & STREAKS
  // ============================================================================

  /**
   * Daily Challenge definitions
   * One per day, auto-generated at midnight UTC
   * Users get bonus points for completing the daily challenge
   */
  dailyChallenges: defineTable({
    date: v.string(), // ISO format: "2025-10-25"
    scenarioId: v.id("scenarios"),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    description: v.string(),
    bonusPoints: v.number(),
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_scenario", ["scenarioId"]),

  /**
   * Challenge Completions - User attempts at daily challenges
   * Links users to their challenge completions for streak tracking
   */
  challengeCompletions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("dailyChallenges"),
    conversationId: v.id("conversations"),
    completed: v.boolean(),
    score: v.number(), // Final score from conversation
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_challenge", ["challengeId"])
    .index("by_user_and_challenge", ["userId", "challengeId"])
    .index("by_user_and_date", ["userId", "completedAt"]), // For streak calculations

  // ============================================================================
  // REFERENCE CONTENT
  // ============================================================================

  /**
   * Feelings Wheel - Reference tool for users
   * Helps users identify and name their emotions
   */
  feelingsWheel: defineTable({
    category: v.string(), // e.g., "joyful", "sad", "fearful", "angry"
    feelings: v.array(v.string()), // Specific feeling words
    color: v.string(), // Hex color for UI
    description: v.string(),
  })
    .index("by_category", ["category"]),

  /**
   * Needs Inventory - Reference tool for users
   * Universal human needs used in NVC
   */
  needsInventory: defineTable({
    category: v.string(), // e.g., "Connection", "Autonomy", "Safety"
    needs: v.array(v.string()), // Specific need words
    icon: v.optional(v.string()), // Emoji or icon name
    description: v.string(),
  })
    .index("by_category", ["category"]),

  /**
   * Lessons - Educational content for Phase 1
   * Teaches the 4 components of NVC
   */
  lessons: defineTable({
    lessonId: v.string(), // Unique identifier
    title: v.string(),
    description: v.string(),
    component: v.union(
      v.literal("introduction"),
      v.literal("observation"),
      v.literal("feeling"),
      v.literal("need"),
      v.literal("request"),
      v.literal("integration")
    ),
    content: v.string(), // Markdown or structured content
    order: v.number(), // Lesson sequence
    estimatedDuration: v.number(), // Minutes
    examples: v.array(
      v.object({
        title: v.string(),
        scenario: v.string(),
        giraffResponse: v.string(), // NVC example
        jackalResponse: v.string(), // Counter-example
        explanation: v.string(),
      })
    ),
    quiz: v.optional(
      v.object({
        questions: v.array(
          v.object({
            question: v.string(),
            options: v.array(v.string()),
            correctAnswer: v.number(),
            explanation: v.string(),
          })
        ),
        passingScore: v.number(), // % needed to pass
      })
    ),
  })
    .index("by_lesson_id", ["lessonId"])
    .index("by_order", ["order"]),

  // ============================================================================
  // ANALYTICS & TELEMETRY (Optional - for future analytics)
  // ============================================================================

  /**
   * User activity logs for analytics
   * Tracks user interactions and learning patterns
   */
  activityLogs: defineTable({
    userId: v.id("users"),
    action: v.string(), // e.g., "lesson_started", "conversation_completed"
    details: v.optional(v.any()), // Action-specific data
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_action", ["action"])
    .index("by_timestamp", ["timestamp"]),
});
