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
    quiz: {
      questions: [
        {
          question: "What does the 'Giraffe' symbol represent in NVC?",
          options: [
            "Tall and fast judgment",
            "Empathy and compassionate communication",
            "Abstract thinking",
            "Predatory communication",
          ],
          correctAnswer: 1,
          explanation:
            "In NVC, the giraffe symbolizes empathy and compassionate communication because it has a large heart and long neck to see different perspectives. The jackal represents reactive, defensive communication.",
        },
        {
          question: "Which of the following is an example of Giraffe Language (NVC)?",
          options: [
            "You're so irresponsible and inconsiderate.",
            "When you arrived late, I felt worried because punctuality helps me feel respected.",
            "You always make the same mistakes.",
            "You should know better than that.",
          ],
          correctAnswer: 1,
          explanation:
            "This response uses NVC by including an observation (arrived late), a feeling (worried), a need (respect), showing the core components of compassionate communication.",
        },
        {
          question: "What is the PRIMARY goal of Non-Violent Communication?",
          options: [
            "To win arguments and get your way",
            "To make others feel guilty for their actions",
            "To express your needs and foster mutual understanding and compassion",
            "To avoid all conflicts at any cost",
          ],
          correctAnswer: 2,
          explanation:
            "NVC aims to create mutual understanding and compassion by expressing your needs authentically while remaining empathetic to the other person's needs.",
        },
        {
          question: "Which statement is NOT one of the 4 pillars of NVC?",
          options: [
            "Observation",
            "Judgment",
            "Feeling",
            "Request",
          ],
          correctAnswer: 1,
          explanation:
            "The 4 pillars of NVC are: Observation, Feeling, Need, and Request. Judgment is the opposite of what NVC teaches—observations should be free of judgment.",
        },
        {
          question: "What is the key difference between a Feeling and a Pseudo-feeling in NVC?",
          options: [
            "Feelings are more important than pseudo-feelings",
            "Feelings are emotions, while pseudo-feelings contain thoughts or judgments",
            "Pseudo-feelings are more honest and authentic",
            "There is no difference between them",
          ],
          correctAnswer: 1,
          explanation:
            "A feeling is a genuine emotion (sad, happy, anxious), while a pseudo-feeling often contains a judgment or thought. For example, 'I feel like you don't respect me' is a pseudo-feeling because it's actually a thought. The genuine feeling might be 'I feel sad and hurt.'",
        },
      ],
      passingScore: 60,
    },
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
    quiz: {
      questions: [
        {
          question: "What is the key difference between an observation and a judgment?",
          options: [
            "Observations are always positive, judgments are always negative",
            "Observations describe observable facts without evaluation; judgments include interpretation and evaluation",
            "Observations are used for good people; judgments are used for bad people",
            "There is no difference between them",
          ],
          correctAnswer: 1,
          explanation:
            "An observation states what you can see, hear, or experience without interpretation. A judgment adds evaluation, blame, or interpretation to what you observe.",
        },
        {
          question: "Which of the following is a pure observation WITHOUT judgment?",
          options: [
            "You're always messy and disorganized",
            "You left your shoes by the door three times this week",
            "You're irresponsible with your belongings",
            "You never put things away",
          ],
          correctAnswer: 1,
          explanation:
            "This is a specific, observable fact with a time frame. The others use generalizations ('always,' 'never') or judgments ('messy,' 'irresponsible').",
        },
        {
          question: "What should you avoid in observations according to NVC?",
          options: [
            "Being too specific with details",
            "Using numbers or measurements",
            "Generalizations like 'always,' 'never,' 'constantly'",
            "Describing exactly what happened",
          ],
          correctAnswer: 2,
          explanation:
            "Generalizations distort the observation and make it sound like a judgment. Pure observations avoid words like 'always,' 'never,' 'constantly,' and other absolute statements.",
        },
        {
          question: "How should you express an observation about someone's behavior?",
          options: [
            "Based on what you think about their character",
            "What you directly see, hear, or experience without interpretation",
            "Based on past patterns to predict future behavior",
            "Based on what others have told you",
          ],
          correctAnswer: 1,
          explanation:
            "An observation must be based on direct sensory experience - what you actually see or hear - without adding your interpretation or character judgment.",
        },
        {
          question: "Which statement best follows the observation pillar of NVC?",
          options: [
            "When I see you roll your eyes at me, I assume you don't respect me",
            "When you roll your eyes at me, I feel hurt because respect is important",
            "You always roll your eyes at everything I say, which is disrespectful",
            "I think you're judgmental because you roll your eyes",
          ],
          correctAnswer: 1,
          explanation:
            "This correctly separates the observation (you roll your eyes) from the feeling (hurt) without adding judgment or interpretation about their character or intentions.",
        },
      ],
      passingScore: 60,
    },
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
    quiz: {
      questions: [
        {
          question: "What is the main difference between a feeling and a pseudo-feeling?",
          options: [
            "Feelings are always stronger than pseudo-feelings",
            "Feelings are actual emotions; pseudo-feelings contain thoughts or judgments",
            "Pseudo-feelings are more important in NVC",
            "There is no real difference between them",
          ],
          correctAnswer: 1,
          explanation:
            "Genuine feelings are emotions like happy, sad, anxious, or angry. Pseudo-feelings like 'I feel rejected' or 'I feel betrayed' are actually thoughts or interpretations about what others think of you.",
        },
        {
          question: "Which of these is a genuine feeling (not a pseudo-feeling)?",
          options: [
            "I feel like you don't care about me",
            "I feel anxious and worried",
            "I feel that you're being unfair",
            "I feel like nobody respects me",
          ],
          correctAnswer: 1,
          explanation:
            "'Anxious and worried' are actual emotions you can experience. The others are pseudo-feelings because they contain judgments about what others think (don't care, unfair, disrespectful).",
        },
        {
          question: "In NVC, how should you express feelings?",
          options: [
            "Blame the other person for causing them",
            "Own your feelings without blaming others for them",
            "Assume the other person knows how you feel",
            "Only express positive feelings",
          ],
          correctAnswer: 1,
          explanation:
            "In NVC, you own your feelings by saying 'I felt sad' rather than 'You made me sad.' This empowers you and keeps communication focused on understanding rather than blame.",
        },
        {
          question: "What's wrong with saying 'You made me angry'?",
          options: [
            "It's grammatically incorrect",
            "Anger is not a real feeling",
            "It gives the other person power over your emotions and suggests blame",
            "It's too direct",
          ],
          correctAnswer: 2,
          explanation:
            "While the other person's actions may have triggered your anger, they didn't 'make' you feel it. You're responsible for your feelings. NVC emphasizes owning emotions: 'I feel angry when...' instead of 'You made me angry.'",
        },
        {
          question: "Which statement best expresses feelings authentically in NVC?",
          options: [
            "I feel like you never listen to me",
            "I feel hurt and disappointed because connection is important to me",
            "You always make me feel anxious",
            "I feel that you don't understand me",
          ],
          correctAnswer: 1,
          explanation:
            "This response names genuine emotions (hurt, disappointed), owns the feelings, and connects them to a need (connection). It doesn't blame or include judgments about the other person.",
        },
      ],
      passingScore: 60,
    },
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
    quiz: {
      questions: [
        {
          question: "What is the difference between a need and a strategy?",
          options: [
            "Needs are demands, strategies are requests",
            "A need is a universal human requirement; a strategy is a specific way to meet that need",
            "Strategies are more important than needs",
            "There is no difference between them",
          ],
          correctAnswer: 1,
          explanation:
            "A need is something fundamental to human wellbeing (safety, connection, respect). A strategy is a specific action to meet that need. For example, 'connection' is a need; 'having dinner together' is a strategy.",
        },
        {
          question: "Which of the following is a universal need (not a strategy)?",
          options: [
            "Your partner should help with housework",
            "You should listen to me more",
            "Autonomy and respect",
            "You need to be on time",
          ],
          correctAnswer: 2,
          explanation:
            "'Autonomy and respect' are universal human needs that apply to all people. The others are specific strategies or demands for particular behaviors.",
        },
        {
          question: "How many universal human needs are there in NVC?",
          options: [
            "About 3-5",
            "Exactly 10",
            "About 15-20 major categories",
            "It varies from person to person",
          ],
          correctAnswer: 2,
          explanation:
            "Marshall Rosenberg identified approximately 15-20 major universal human needs including connection, autonomy, safety, meaning, creativity, rest, and many others that apply across all cultures.",
        },
        {
          question: "What's the best way to identify your underlying need?",
          options: [
            "Demand that others meet your needs",
            "Look beneath your feelings to understand what's important to you",
            "Assume others know what you need",
            "Express your needs as demands",
          ],
          correctAnswer: 1,
          explanation:
            "In NVC, you identify needs by exploring what's important to you beneath your feelings. Ask yourself: 'What am I really wanting?' or 'What's important to me in this situation?'",
        },
        {
          question: "Which statement best connects a feeling to a universal need?",
          options: [
            "I feel sad because you're not helping with chores",
            "I feel hurt because respect and shared responsibility are important to me",
            "I feel frustrated because you need to change",
            "I feel angry because you never listen",
          ],
          correctAnswer: 1,
          explanation:
            "This response identifies the feeling (hurt), connects it to universal needs (respect, shared responsibility), and avoids blame. It shows what's truly important rather than focusing on specific behaviors.",
        },
      ],
      passingScore: 60,
    },
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
    quiz: {
      questions: [
        {
          question: "What is the key characteristic of a request in NVC?",
          options: [
            "It's a demand that others must follow",
            "It asks for a concrete action and the other person can say no",
            "It assumes others know what you want",
            "It focuses on what the other person shouldn't do",
          ],
          correctAnswer: 1,
          explanation:
            "In NVC, a request is different from a demand. A request asks for a specific, doable action AND leaves room for the other person to decline without judgment or punishment.",
        },
        {
          question: "Which of the following is a clear, actionable request?",
          options: [
            "You should stop being late",
            "I need you to care more about our relationship",
            "Would you be willing to call me when you're running late?",
            "You have to listen better",
          ],
          correctAnswer: 2,
          explanation:
            "This request is specific (call when running late), concrete (the person knows exactly what to do), and can be declined. The others are vague demands or judgments.",
        },
        {
          question: "Why is positive language important in making requests?",
          options: [
            "Because people have to obey positive requests",
            "Because it describes what you want rather than what you don't want",
            "Because it sounds nicer",
            "Because it doesn't require thinking",
          ],
          correctAnswer: 1,
          explanation:
            "Positive requests tell people what TO DO rather than what NOT to do. 'Please speak quietly' is clearer than 'Stop being so loud.' Positive language helps people understand the action you're requesting.",
        },
        {
          question: "What should you do if someone declines your request?",
          options: [
            "Punish them or withdraw affection",
            "Listen to their needs and look for other strategies to meet yours",
            "Repeat the same request over and over",
            "Assume they don't care about you",
          ],
          correctAnswer: 1,
          explanation:
            "In NVC, if someone can't meet your request, it's an opportunity for dialogue. You listen to their needs and constraints, then explore other ways to meet your needs together.",
        },
        {
          question: "Which statement is the best example of an NVC request?",
          options: [
            "You need to be more responsible",
            "Stop being so messy",
            "Would you be willing to put dirty clothes in the hamper when you change?",
            "You're always inconsiderate",
          ],
          correctAnswer: 2,
          explanation:
            "This request is concrete (put dirty clothes in hamper), specific about the action, asks 'would you be willing' (leaving room for declining), and doesn't include blame or judgment.",
        },
      ],
      passingScore: 60,
    },
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
    quiz: {
      questions: [
        {
          question: "Which response includes all 4 NVC components (observation, feeling, need, request)?",
          options: [
            "You never listen to me and you don't care about my feelings.",
            "When you interrupt me, I feel frustrated because being heard is important to me. Would you be willing to let me finish speaking?",
            "I feel like you're not respecting me. You need to change.",
            "You're inconsiderate and rude.",
          ],
          correctAnswer: 1,
          explanation:
            "This response includes: observation (you interrupt me), feeling (frustrated), need (being heard), and request (let me finish speaking). All four pillars are present.",
        },
        {
          question: "In a complete NVC expression, what comes AFTER expressing your need?",
          options: [
            "Blame the other person",
            "Repeat the observation",
            "Make a clear request",
            "Judge their character",
          ],
          correctAnswer: 2,
          explanation:
            "The complete NVC flow is: Observation → Feeling → Need → Request. The request comes last and asks for concrete action.",
        },
        {
          question: "What is the purpose of making a request at the end of a complete NVC expression?",
          options: [
            "To demand that the other person obey you",
            "To ask for a specific action that could meet your need, while respecting their freedom to say no",
            "To make the other person feel guilty",
            "To prove you're right",
          ],
          correctAnswer: 1,
          explanation:
            "A request in NVC is meant to propose a concrete action that could help meet your need, while leaving the other person free to decline. It's collaborative, not coercive.",
        },
        {
          question: "How would you translate this jackal statement into a complete NVC expression? 'You're always late and irresponsible.'",
          options: [
            "You're a bad person for being late.",
            "When you arrive 15 minutes after we agreed, I feel anxious because reliability and respect are important to me. Would you be willing to call if you're running late?",
            "Stop being irresponsible.",
            "You never respect my time.",
          ],
          correctAnswer: 1,
          explanation:
            "This response provides: specific observation (15 minutes late), emotion (anxious), universal need (reliability, respect), and concrete request (call if running late).",
        },
        {
          question: "What makes a complete NVC expression different from just expressing anger or frustration?",
          options: [
            "It's longer and more complicated",
            "It expresses all four components and focuses on understanding rather than blame",
            "It makes the other person feel worse",
            "It's more forceful and demanding",
          ],
          correctAnswer: 1,
          explanation:
            "A complete NVC expression moves beyond blame to mutual understanding by clearly naming observations, feelings, needs, and requests. This opens dialogue rather than closing it.",
        },
        {
          question: "Which of the following is a complete and compassionate NVC expression?",
          options: [
            "You're selfish and you never think about anyone but yourself.",
            "When I don't hear from you for days, I feel hurt and disconnected because friendship and closeness are important to me. Would you be willing to reach out more often?",
            "You need to care about our friendship more.",
            "You're a terrible friend.",
          ],
          correctAnswer: 1,
          explanation:
            "This expression includes all components: observation (no contact for days), feeling (hurt, disconnected), need (friendship, closeness), and request (reach out more often). It invites dialogue and understanding.",
        },
      ],
      passingScore: 60,
    },
  },
];

/**
 * Query to fetch all lessons for the lesson hub
 * Returns lessons in order with all content needed for the UI
 */
export const getAllLessons = query({
  handler: async () => {
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
  handler: async (_, args) => {
    return LESSONS.find((lesson) => lesson.lessonId === args.lessonId) || null;
  },
});
