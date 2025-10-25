import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * The 6 foundational NVC lessons
 * These form the core learning path for Phase 1
 */
const LESSONS = [
  {
    lessonId: "introduction",
    title: "Introduction to Non-Violent Communication",
    description:
      "Learn what NVC is and why it matters. Discover how compassionate communication can transform your relationships.",
    component: "introduction",
    order: 1,
    estimatedDuration: 8,
    icon: "🌱",
    content:
      "Non-Violent Communication (NVC) is a framework for peaceful, empathetic communication created by Marshall Rosenberg. In this lesson, you'll learn the philosophy behind NVC and how it can help you communicate more authentically.",
    examples: [
      {
        title: "From blame to understanding",
        scenario:
          "Your friend forgot your birthday. Normally, you might get angry. With NVC, you can express your feelings and needs instead.",
        giraffResponse:
          'When you forgot my birthday, I felt hurt because celebration and connection are important to me. Would you be willing to acknowledge the day with me sometime this week?',
        jackalResponse: "You're so inconsiderate. You always forget important things about me.",
        explanation:
          "The giraffe response expresses the feeling (hurt) and need (connection) without blame. The jackal response uses judgment and generalization.",
      },
    ],
  },
  {
    lessonId: "observation",
    title: "Observations Without Evaluation",
    description:
      "Learn to describe what you see and hear without judgment. Master the foundation of clear communication.",
    component: "observation",
    order: 2,
    estimatedDuration: 7,
    icon: "👀",
    content:
      "Observation is the first pillar of NVC. It means describing observable facts without adding judgment, interpretation, or evaluation. In this lesson, you'll learn to separate what you actually see from what you think about it.",
    examples: [
      {
        title: "Facts vs. judgment",
        scenario: "Your coworker submitted a project late.",
        giraffResponse: "You submitted the project at 5pm when the deadline was 3pm.",
        jackalResponse: "You're always late and irresponsible.",
        explanation:
          "The giraffe response states the observable fact. The jackal response adds judgment (lazy, irresponsible) instead of describing what actually happened.",
      },
      {
        title: "Be specific",
        scenario: "Someone didn't text you back immediately.",
        giraffResponse:
          "I sent you a text at noon and didn't receive a response until evening.",
        jackalResponse: "You never respond to my messages.",
        explanation:
          'The giraffe response is specific and factual. The jackal uses "never" which is a generalization.',
      },
    ],
  },
  {
    lessonId: "feeling",
    title: "Identifying and Expressing Feelings",
    description:
      "Discover real feelings vs. pseudo-feelings. Learn to express your emotions authentically.",
    component: "feeling",
    order: 3,
    estimatedDuration: 8,
    icon: "💭",
    content:
      "Feeling is the second pillar of NVC. It means naming actual emotions (sad, joyful, anxious) rather than thoughts disguised as feelings. In this lesson, you'll learn to identify and own your feelings without blame.",
    examples: [
      {
        title: "Real feelings vs. pseudo-feelings",
        scenario: "Someone didn't invite you to an event.",
        giraffResponse: "I feel sad and left out.",
        jackalResponse: "I feel like you don't value me.",
        explanation:
          '"Feel like" is a thought, not a feeling. The giraffe response names actual emotions.',
      },
      {
        title: "Own your feelings",
        scenario: "Someone interrupted you.",
        giraffResponse: "I felt frustrated when I was interrupted.",
        jackalResponse: "You made me angry by interrupting.",
        explanation:
          "The giraffe response owns the feeling. The jackal blames the other person for causing the feeling.",
      },
    ],
  },
  {
    lessonId: "need",
    title: "Connecting Feelings to Needs",
    description:
      "Explore universal human needs. Learn to identify what's truly important to you.",
    component: "need",
    order: 4,
    estimatedDuration: 9,
    icon: "❤️",
    content:
      "Need is the third pillar of NVC. It means identifying the universal human needs behind your feelings. In this lesson, you'll learn the difference between needs and strategies, and discover universal needs that apply to all humans.",
    examples: [
      {
        title: "Need vs. strategy",
        scenario: "You want your partner to take out the trash.",
        giraffResponse:
          "I need to feel respected and have a shared environment. Would you be willing to help with household tasks?",
        jackalResponse: "You need to start helping around the house.",
        explanation:
          "The giraffe response identifies the underlying need (respect, shared environment). The jackal confuses the strategy (partner taking out trash) with the need.",
      },
      {
        title: "Universal needs",
        scenario: "You're upset because someone was late.",
        giraffResponse:
          "I felt anxious because reliability and respect are important to me.",
        jackalResponse: "You should always be on time.",
        explanation:
          "The giraffe response connects to universal needs (reliability, respect). The jackal makes a demand without expressing the underlying need.",
      },
    ],
  },
  {
    lessonId: "request",
    title: "Making Clear Requests",
    description:
      "Learn to ask for what you need. Master the art of requests (not demands).",
    component: "request",
    order: 5,
    estimatedDuration: 8,
    icon: "🎯",
    content:
      "Request is the fourth pillar of NVC. It means asking for a concrete, actionable, positive action—and leaving room for the other person to say no. In this lesson, you'll learn to transform demands into genuine requests.",
    examples: [
      {
        title: "Request vs. demand",
        scenario: "You want your friend to listen to your problems.",
        giraffResponse: "Would you be willing to listen while I share what's on my mind?",
        jackalResponse: "You should care about my problems.",
        explanation:
          "The giraffe response is a clear, concrete request that can be declined. The jackal is a demand disguised as an expectation.",
      },
      {
        title: "Positive language",
        scenario: "You want someone to stop interrupting.",
        giraffResponse: "Would you be willing to wait until I finish speaking?",
        jackalResponse: "Stop interrupting me.",
        explanation:
          "The giraffe response asks for a positive action. The jackal uses negative language (what not to do).",
      },
    ],
  },
  {
    lessonId: "integration",
    title: "Putting It All Together",
    description:
      "Integrate all 4 components into complete NVC expressions. Master compassionate communication.",
    component: "integration",
    order: 6,
    estimatedDuration: 10,
    icon: "🦒",
    content:
      "Integration is where NVC comes alive. In this lesson, you'll learn to combine all 4 components into complete, compassionate expressions. You'll practice translating everyday conflicts into NVC language.",
    examples: [
      {
        title: "Complete NVC expression",
        scenario: "Your partner doesn't help with household chores.",
        giraffResponse:
          "When I see dishes piling up in the sink, I feel overwhelmed and resentful because I need partnership and shared responsibility. Would you be willing to help with dishes after dinner?",
        jackalResponse:
          "You never help me. You're so lazy and inconsiderate. You should start doing your fair share of chores.",
        explanation:
          "The giraffe response includes observation (dishes in sink), feeling (overwhelmed), need (partnership), and request (help with dishes). The jackal uses judgment, blame, and demands.",
      },
      {
        title: "Empathy in conflict",
        scenario: "Someone got defensive when you gave feedback.",
        giraffResponse:
          "I sense you might be feeling hurt or defensive. I care about our relationship and want to communicate in a way that helps you feel understood. Would you be open to talking about this?",
        jackalResponse: "Why are you being so sensitive? It's not a big deal.",
        explanation:
          "The giraffe response shows empathy and curiosity about the other person's feelings. The jackal dismisses and minimizes.",
      },
    ],
  },
];

/**
 * Query to fetch all lessons for the lesson hub
 * Returns lessons in order with all content needed for the UI
 */
export const getAllLessons = query({
  handler: async (ctx) => {
    // Return the hardcoded lessons in order
    // In the future, this could query from the database
    return LESSONS.sort((a, b) => a.order - b.order);
  },
});

/**
 * Query to fetch a single lesson by ID
 */
export const getLessonById = query({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    return LESSONS.find((lesson) => lesson.lessonId === args.lessonId) || null;
  },
});
