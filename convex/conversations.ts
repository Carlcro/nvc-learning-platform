import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Conversations - Core conversation management for AI roleplay
 *
 * Handles creation, messaging, and completion of NVC practice conversations.
 * Each conversation includes NVC scoring data for learning analytics.
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get the active conversation for a user in a specific scenario
 * Returns the ongoing conversation or null if none exists
 */
export const getActive = query({
  args: {
    userId: v.id("users"),
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user_and_scenario", (q) =>
        q.eq("userId", args.userId).eq("scenarioId", args.scenarioId)
      )
      .collect();

    // Find the first in_progress conversation
    const conversation = conversations.find((c) => c.status === "in_progress");
    return conversation || null;
  },
});

/**
 * Get a specific conversation by ID with full history
 */
export const getById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

/**
 * Get user's conversation history for a scenario
 * Useful for showing past attempts and progress
 */
export const getHistory = query({
  args: {
    userId: v.id("users"),
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_user_and_scenario", (q) =>
        q.eq("userId", args.userId).eq("scenarioId", args.scenarioId)
      )
      .order("desc")
      .collect();
  },
});

/**
 * Get all conversations for a user (across all scenarios)
 * For user dashboard/progress tracking
 */
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get user's completed conversations (for analytics/progress)
 */
export const getUserCompletedConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return conversations.filter((c) => c.status === "completed");
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new conversation for a user in a scenario
 * Initializes with empty messages array and "in_progress" status
 */
export const create = mutation({
  args: {
    userId: v.id("users"),
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      userId: args.userId,
      scenarioId: args.scenarioId,
      messages: [],
      status: "in_progress",
      createdAt: Date.now(),
    });
  },
});

/**
 * Add a message to a conversation
 * Supports both user and assistant messages
 * NVC scoring data is optional (only for user messages)
 */
export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    nvcScore: v.optional(
      v.object({
        observation: v.number(),
        feeling: v.number(),
        need: v.number(),
        request: v.number(),
        total: v.number(),
      })
    ),
    feedback: v.optional(v.string()),
    isJackalLanguage: v.optional(v.boolean()),
    jackalPhrases: v.optional(v.array(v.string())),
    giraffeAlternative: v.optional(v.string()),
    whatWentWell: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { conversationId, role, content, ...scoreData } = args;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const updatedMessages = [
      ...conversation.messages,
      {
        role,
        content,
        timestamp: Date.now(),
        ...scoreData,
      },
    ];

    await ctx.db.patch(conversationId, {
      messages: updatedMessages,
    });

    return { success: true };
  },
});

/**
 * Complete a conversation and calculate final score
 * Marks conversation as "completed" and stores final NVC score
 */
export const complete = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Calculate average NVC score from all user messages
    const userMessages = conversation.messages.filter(
      (m) => m.role === "user" && m.nvcScore
    );

    let finalScore = 0;
    if (userMessages.length > 0) {
      const totalScore = userMessages.reduce(
        (sum, m) => sum + (m.nvcScore?.total || 0),
        0
      );
      finalScore = Math.round(totalScore / userMessages.length);
    }

    await ctx.db.patch(args.conversationId, {
      status: "completed",
      finalScore,
      completedAt: Date.now(),
    });

    return {
      success: true,
      finalScore,
      messageCount: conversation.messages.length,
    };
  },
});

/**
 * Abandon a conversation (user gives up or navigates away)
 * Preserves the conversation for learning purposes
 */
export const abandon = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      status: "abandoned",
    });
    return { success: true };
  },
});

/**
 * Delete a conversation (for testing or data cleanup)
 * Use with caution - this removes all history
 */
export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.conversationId);
    return { success: true };
  },
});
