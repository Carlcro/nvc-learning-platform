/**
 * Development Helpers
 *
 * This module provides utilities for development and testing.
 * These functions should ONLY be used in development mode.
 */

import { mutation } from "./_generated/server";

/**
 * Create or get a development user for testing
 * This allows development without a full auth system
 *
 * Returns the ID of the development user
 */
export const getOrCreateDevUser = mutation({
  handler: async (ctx) => {
    // Check if dev user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", "dev-user-123"))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new dev user
    const devUserId = await ctx.db.insert("users", {
      clerkId: "dev-user-123",
      name: "Dev User",
      email: "dev@localhost",
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return devUserId;
  },
});
