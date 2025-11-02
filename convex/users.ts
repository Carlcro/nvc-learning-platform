import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user;
  },
});

/**
 * Get the current user's profile with progress stats
 * Returns null if user is not authenticated
 */
export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Get or create user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return {
      user,
      profile,
    };
  },
});

/**
 * Update user profile (name, email, etc.)
 * Only accessible to the authenticated user themselves
 */
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update the auth user
    if (args.name !== undefined) {
      await ctx.db.patch(userId, {
        name: args.name,
      });
    }

    return await ctx.db.get(userId);
  },
});

/**
 * Initialize user profile when they sign up
 * Called automatically after successful authentication
 */
export const initializeUserProfile = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(profileId);
  },
});

/**
 * Update user points and level
 * Internal use only - called by challenge completion
 */
export const updateUserProgress = mutation({
  args: {
    userId: v.id("users"),
    pointsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    const newPoints = profile.totalPoints + args.pointsToAdd;
    const newLevel = Math.min(10, Math.floor(newPoints / 500) + 1); // Level up every 500 points

    await ctx.db.patch(profile._id, {
      totalPoints: newPoints,
      level: newLevel,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(profile._id);
  },
});

/**
 * Get current user's conversation history
 * Returns all conversations for the authenticated user, most recent first
 */
export const getMyConversations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return conversations;
  },
});
