/**
 * Development Helpers
 *
 * This module provides utilities for development and testing.
 * These functions should ONLY be used in development mode.
 *
 * Note: With Convex Auth, you should use the auth system instead of this helper.
 * This is kept for backwards compatibility with tests.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a development user profile for testing
 * Use with a real Convex Auth user ID from the users table
 *
 * Returns the ID of the user profile
 */
export const createDevUserProfile = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: args.userId,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return profileId;
  },
});
