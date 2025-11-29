import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

/**
 * NVC Learning App Database Schema
 *
 * This schema defines all data models for the Non-Violent Communication
 * learning platform. See project-spec.md for complete documentation.
 */

export default defineSchema({
  ...authTables,
  // ============================================================================
  // USERS & AUTHENTICATION
  // ============================================================================

  /**
   * Extended user profile data
   * Links to authTables.users and stores NVC-specific progress information
   */
  userProfiles: defineTable({
    userId: v.id('users'), // Reference to Convex Auth user
    currentStreak: v.number(), // Current daily challenge streak
    longestStreak: v.number(), // Longest streak achieved
    totalPoints: v.number(), // Total points earned
    level: v.number(), // User skill level (1-10)
    createdAt: v.number(), // Timestamp when profile created
    updatedAt: v.number(), // Last profile update
  }).index('by_user_id', ['userId']),

  // ============================================================================
  // PROGRESS TRACKING
  // ============================================================================

  /**
   * User progress for lessons (Phase 1 content)
   * Tracks completion and scores for each lesson
   */
  lessonProgress: defineTable({
    userId: v.id('users'), // Reference to Convex Auth user
    lessonId: v.string(), // Matches lesson definition
    completed: v.boolean(),
    score: v.number(), // 0-100
    attempts: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_lesson', ['userId', 'lessonId']),

  /**
   * User Overall Progress - Comprehensive tracking across all scenarios
   * Tracks user level, points, achievements, and aggregate stats
   */
  userProgress: defineTable({
    userId: v.id('users'),

    // Level & Points
    level: v.number(), // User skill level
    totalPoints: v.number(), // Total points earned
    pointsToNextLevel: v.number(), // Points needed to level up

    // Scenarios
    scenariosCompleted: v.number(), // Total scenarios completed
    scenariosPassed: v.number(), // Scenarios with 60+ score
    scenariosMastered: v.number(), // Scenarios with 85+ score
    totalStars: v.number(), // Sum of all stars earned

    // Streaks
    currentStreak: v.number(), // Days in a row (practice streak)
    longestStreak: v.number(), // Longest streak achieved
    lastPracticeDate: v.string(), // ISO format: "2025-11-08"

    // NVC Component Averages (across all conversations)
    averageScores: v.object({
      observation: v.number(), // 0-25
      feeling: v.number(), // 0-25
      need: v.number(), // 0-25
      request: v.number(), // 0-25
      overall: v.number(), // 0-100
    }),

    // Achievements
    achievements: v.array(v.string()), // Achievement IDs
    badges: v.array(v.string()), // Badge IDs

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  // ============================================================================
  // SCENARIOS (AI Roleplay)
  // ============================================================================

  /**
   * Roleplay scenarios for users to practice NVC
   * Each scenario has an AI character and learning goals
   * Users progress through scenarios linearly, unlocking based on performance
   */
  scenarios: defineTable({
    // ============ Basic Info ============
    title: v.string(), // Short, descriptive name
    description: v.string(), // Brief description for scenario browser
    category: v.union(
      v.literal('workplace'),
      v.literal('family'),
      v.literal('friendship'),
      v.literal('self_expression'),
    ),
    difficulty: v.union(
      v.literal('beginner'),
      v.literal('intermediate'),
      v.literal('advanced'),
    ),

    // ============ Character Info ============
    characterName: v.string(), // Name of the AI character
    characterPersonality: v.string(), // Personality traits (e.g., "Stressed, defensive, values competence")
    characterInitialMood: v.number(), // -10 (very closed) to +10 (very open)
    characterBackground: v.optional(v.string()), // Background and motivation context
    characterHiddenNeeds: v.array(v.string()), // Character's needs (hidden from user, used by AI)
    situation: v.string(), // 2-3 sentences setting up the conflict
    aiOpeningMessage: v.string(), // The AI's opening statement to start conversation

    // ============ Learning Goals ============
    learningObjectives: v.array(v.string()), // Which NVC components ("observation", "feeling", "need", "request")
    focusArea: v.string(), // e.g., "conflict_resolution", "boundary_setting"

    // ============ Progression & Unlocking ============
    orderIndex: v.number(), // For linear progression (0, 1, 2, ...)
    unlockRequirements: v.object({
      minLevel: v.number(), // Min user level required
      requiredScenarios: v.array(v.id('scenarios')), // IDs of scenarios that must be completed first
      minStarsTotal: v.optional(v.number()), // Total stars needed across all scenarios to unlock
    }),

    // ============ Metadata ============
    estimatedDuration: v.number(), // Minutes to complete
    tags: v.array(v.string()), // e.g., ["workplace", "conflict", "deadline"]
    isActive: v.boolean(), // Whether scenario is available
    createdAt: v.number(), // When created
    updatedAt: v.optional(v.number()), // Last updated
  })
    .index('by_category', ['category'])
    .index('by_difficulty', ['difficulty'])
    .index('by_order', ['orderIndex']),

  /**
   * Scenario Progress - Tracks user's completion status for each scenario
   * Records attempts, scores, unlock status, and learning objectives progress
   */
  scenarioProgress: defineTable({
    userId: v.id('users'),
    scenarioId: v.id('scenarios'),

    // ============ Status ============
    status: v.union(
      v.literal('locked'), // Not yet available
      v.literal('available'), // Can start
      v.literal('in_progress'), // Started but not completed
      v.literal('attempted'), // Attempted but scored <60 (no stars)
      v.literal('passed'), // Completed with 60-84 score (1-2 stars)
      v.literal('mastered'), // Completed with 85+ score (3 stars)
    ),

    // ============ Performance Tracking ============
    attempts: v.number(), // Total number of attempts
    bestScore: v.number(), // Best score achieved (0-100)
    bestStars: v.number(), // Stars from best score (0-3)
    bestConversationId: v.optional(v.id('conversations')), // Conversation with best score
    lastScore: v.optional(v.number()), // Most recent score
    averageScore: v.optional(v.number()), // Average across all attempts

    // ============ First Completion ============
    firstCompletedAt: v.optional(v.number()), // Timestamp of first completion
    firstCompletionScore: v.optional(v.number()), // Score on first completion
    firstCompletionStars: v.optional(v.number()), // Stars on first completion

    // ============ Current Activity ============
    lastAttemptAt: v.number(), // Timestamp of most recent attempt
    currentConversationId: v.optional(v.id('conversations')), // Active conversation (if in progress)

    // ============ Learning Objectives ============
    objectivesCompleted: v.array(v.string()), // Which learning objectives user demonstrated
    objectiveScores: v.optional(
      v.object({
        observation: v.number(), // 0-25
        feeling: v.number(), // 0-25
        need: v.number(), // 0-25
        request: v.number(), // 0-25
      }),
    ),

    // ============ Conversation History ============
    conversationIds: v.array(v.id('conversations')), // All conversation attempts for this scenario

    // ============ Metadata ============
    createdAt: v.number(), // When user first started this scenario
    updatedAt: v.number(), // Last update to progress
  })
    .index('by_user', ['userId'])
    .index('by_scenario', ['scenarioId'])
    .index('by_user_and_scenario', ['userId', 'scenarioId'])
    .index('by_status', ['userId', 'status']),

  // ============================================================================
  // CONVERSATIONS & MESSAGING
  // ============================================================================

  /**
   * NVC Score data structure (nested in messages)
   * Stored separately for reuse
   */
  // Note: NVC scores are stored inline within messages array

  /**
   * Conversations - Main chat history for AI roleplay scenarios
   * Records all messages, scores, character state, and feedback
   * Updated in real-time as conversation progresses
   */
  conversations: defineTable({
    userId: v.id('users'),
    scenarioId: v.id('scenarios'),

    // ============ Messages ============
    messages: v.array(
      v.object({
        role: v.union(v.literal('user'), v.literal('assistant')),
        content: v.string(),
        timestamp: v.number(),

        // ============ NVC Analysis (for user messages) ============
        nvcScore: v.optional(
          v.object({
            observation: v.number(), // 0-25
            feeling: v.number(), // 0-25
            need: v.number(), // 0-25
            request: v.number(), // 0-25
            total: v.number(), // 0-100
          }),
        ),
        feedback: v.optional(v.string()), // Real-time coaching feedback
        isJackalLanguage: v.optional(v.boolean()), // True if mostly judgmental language
        jackalPhrases: v.optional(v.array(v.string())), // Specific blame/judgment phrases
        giraffeAlternative: v.optional(v.string()), // Suggested NVC rephrasing
        whatWorked: v.optional(v.string()), // What was good about this message
        whatWentWell: v.optional(v.string()), // Feedback on what the user did well

        // ============ Character State (for assistant messages) ============
        characterMood: v.optional(v.number()), // -10 to +10, character's emotional state
      }),
    ),

    // ============ Conversation Status ============
    status: v.union(
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('abandoned'),
    ),

    // ============ Real-Time Tracking ============
    messageCount: v.number(), // Total messages in conversation
    averageNVCScore: v.number(), // Average score across all user messages
    currentCharacterMood: v.number(), // Character's mood (-10 to +10)
    giraffeStreakCount: v.number(), // Consecutive good NVC messages
    jackalLanguageCount: v.number(), // Number of messages with jackal language

    // ============ Objectives ============
    objectivesMetInConversation: v.array(v.string()), // Learning objectives demonstrated

    // ============ Final Results (when completed) ============
    finalScore: v.optional(v.number()), // Average NVC score (0-100)
    finalStars: v.optional(v.number()), // Stars earned (0-3)
    completionStatus: v.optional(
      v.union(
        v.literal('excellent'), // 85+
        v.literal('success'), // 70-84
        v.literal('pass'), // 60-69
        v.literal('incomplete'), // <60
      ),
    ),

    // ============ Feedback (generated at completion) ============
    whatWentWell: v.optional(v.array(v.string())), // 2-4 positive specific points
    roomToGrow: v.optional(v.array(v.string())), // 1-3 areas for improvement
    personalizedSuggestions: v.optional(
      v.array(
        v.object({
          component: v.string(), // "observation", "feeling", "need", "request"
          issue: v.string(), // Description of the issue
          example: v.object({
            whatYouSaid: v.string(), // Actual quote from conversation
            betterApproach: v.string(), // Suggested NVC rephrasing
            why: v.string(), // Explanation of why this is better
          }),
          practiceTip: v.string(), // Actionable tip for next time
        }),
      ),
    ),

    // ============ Timestamps ============
    createdAt: v.number(), // When conversation started
    completedAt: v.optional(v.number()), // When conversation ended
    lastMessageAt: v.number(), // Timestamp of most recent message
  })
    .index('by_user', ['userId'])
    .index('by_scenario', ['scenarioId'])
    .index('by_user_and_scenario', ['userId', 'scenarioId'])
    .index('by_status', ['userId', 'status']),

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
    scenarioId: v.id('scenarios'),
    difficulty: v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard'),
    ),
    description: v.string(),
    bonusPoints: v.number(),
    createdAt: v.number(),
  })
    .index('by_date', ['date'])
    .index('by_scenario', ['scenarioId']),

  /**
   * Challenge Completions - User attempts at daily challenges
   * Links users to their challenge completions for streak tracking
   */
  challengeCompletions: defineTable({
    userId: v.id('users'),
    challengeId: v.id('dailyChallenges'),
    conversationId: v.id('conversations'),
    completed: v.boolean(),
    score: v.number(), // Final score from conversation
    completedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_challenge', ['challengeId'])
    .index('by_user_and_challenge', ['userId', 'challengeId'])
    .index('by_user_and_date', ['userId', 'completedAt']), // For streak calculations

  // ============================================================================
  // REFERENCE CONTENT
  // ============================================================================

  /**
   * Feelings - Comprehensive feelings learning system
   * Organized by family and intensity for user learning
   */
  feelings: defineTable({
    word: v.string(), // The feeling word (e.g., "grateful")
    category: v.union(v.literal('pleasant'), v.literal('unpleasant')),
    family: v.string(), // "joyful", "peaceful", "excited", "angry", "sad", "scared", "confused"
    intensity: v.number(), // 1 (mild) to 5 (intense)
    definition: v.string(), // Clear explanation of the feeling
    examples: v.array(v.string()), // Example sentences showing it in use
    synonyms: v.array(v.string()), // Related words
    relatedFeelings: v.array(v.string()), // Other feelings in same family
  })
    .index('by_category', ['category'])
    .index('by_family', ['family'])
    .index('by_intensity', ['family', 'intensity']),

  /**
   * User Feelings Progress - Tracks learning and daily check-ins
   */
  userFeelingsProgress: defineTable({
    userId: v.id('users'),

    // Learning progress
    feelingsExplored: v.array(v.string()), // Feeling words they've clicked on
    feelingsSaved: v.array(v.string()), // Their personal library

    // Quiz progress
    quizQuestionsAnswered: v.number(),
    quizQuestionsCorrect: v.number(),
    quizScore: v.number(), // Percentage
    quizLevel: v.number(), // 1-3

    // Daily check-ins
    dailyCheckIns: v.array(
      v.object({
        date: v.string(), // "2025-11-15"
        feelings: v.array(v.string()),
        note: v.optional(v.string()),
        timestamp: v.number(),
      }),
    ),
    currentCheckInStreak: v.number(),
    longestCheckInStreak: v.number(),
    lastCheckInDate: v.optional(v.string()),

    // Stats
    mostCommonFeelings: v.optional(v.array(v.string())),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  /**
   * Feelings Quiz Questions - Learning game content
   */
  feelingsQuizQuestions: defineTable({
    level: v.number(), // 1, 2, 3
    sentence: v.string(),
    isRealFeeling: v.boolean(),
    explanation: v.string(),
    correctFeelings: v.optional(v.array(v.string())), // What they should say instead
    category: v.string(), // "feel_like", "feel_that", "evaluative", "tricky"
  })
    .index('by_level', ['level'])
    .index('by_category', ['category']),

  /**
   * Feelings Wheel - Reference tool for users (Legacy - for backwards compatibility)
   * Helps users identify and name their emotions
   */
  feelingsWheel: defineTable({
    category: v.string(), // e.g., "joyful", "sad", "fearful", "angry"
    feelings: v.array(v.string()), // Specific feeling words
    color: v.string(), // Hex color for UI
    description: v.string(),
  }).index('by_category', ['category']),

  /**
   * Needs Inventory - Reference tool for users
   * Universal human needs used in NVC
   */
  needsInventory: defineTable({
    category: v.string(), // e.g., "Connection", "Autonomy", "Safety"
    needs: v.array(v.string()), // Specific need words
    icon: v.optional(v.string()), // Emoji or icon name
    description: v.string(),
  }).index('by_category', ['category']),

  /**
   * Lessons - Educational content for Phase 1
   * Teaches the 4 components of NVC
   */
  lessons: defineTable({
    lessonId: v.string(), // Unique identifier
    title: v.string(),
    description: v.string(),
    component: v.union(
      v.literal('introduction'),
      v.literal('observation'),
      v.literal('feeling'),
      v.literal('need'),
      v.literal('request'),
      v.literal('integration'),
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
      }),
    ),
    quiz: v.optional(
      v.object({
        questions: v.array(
          v.object({
            question: v.string(),
            options: v.array(v.string()),
            correctAnswer: v.number(),
            explanation: v.string(),
          }),
        ),
        passingScore: v.number(), // % needed to pass
      }),
    ),
  })
    .index('by_lesson_id', ['lessonId'])
    .index('by_order', ['order']),

  // ============================================================================
  // ANALYTICS & TELEMETRY (Optional - for future analytics)
  // ============================================================================

  /**
   * User activity logs for analytics
   * Tracks user interactions and learning patterns
   */
  activityLogs: defineTable({
    userId: v.id('users'),
    action: v.string(), // e.g., "lesson_started", "conversation_completed"
    details: v.optional(v.any()), // Action-specific data
    timestamp: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_action', ['action'])
    .index('by_timestamp', ['timestamp']),
})
