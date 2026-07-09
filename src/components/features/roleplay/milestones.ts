/**
 * Conversation milestone flags, computed server-side as the conversation
 * progresses and read by the feedback panel and results screen.
 */
export interface Milestones {
  conversationStarted: boolean
  feelingExpressed: boolean
  needIdentified: boolean
  requestMade: boolean
  resolutionReached: boolean
  // Optional: conversations from before the empathy milestone lack it.
  empathyShown?: boolean
}
