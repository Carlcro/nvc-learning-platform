/**
 * Achievement names and descriptions, keyed by the ids in the server catalog
 * (convex/lib/progress.ts). The server stores and returns ids; the client
 * shows the words in the reader's language. A test keeps the two in step.
 */
export const achievements: Partial<
  Record<string, { title: string; description: string }>
> = {
  'first-conversation': {
    title: 'First Conversation',
    description: 'You completed your first practice conversation.',
  },
  'first-pass': {
    title: 'Finding Your Voice',
    description: 'You guided a conversation to a good place.',
  },
  'first-mastery': {
    title: 'Fluent Giraffe',
    description: 'You mastered a scenario with a score of 85 or higher.',
  },
  'five-completed': {
    title: 'Regular Practice',
    description: 'You completed five different scenarios.',
  },
  'heard-them': {
    title: 'You Heard Them',
    description: "You tuned into the other person's feelings and needs.",
  },
  'streak-3': {
    title: 'Three Days Running',
    description: 'You practiced three days in a row.',
  },
  'streak-7': {
    title: 'A Weekly Rhythm',
    description: 'You practiced seven days in a row.',
  },
  'stars-10': {
    title: 'Ten Stars',
    description: 'You collected ten stars across your scenarios.',
  },
  'stars-25': {
    title: 'Star Collector',
    description: 'You collected twenty-five stars.',
  },
  'perfect-connection': {
    title: 'Perfect Connection',
    description: 'You finished a conversation with a perfect score.',
  },
}
