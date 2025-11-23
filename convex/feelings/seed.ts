import { v } from 'convex/values'
import type { MutationCtx } from '../_generated/server'

/**
 * Feelings Learning System - Seed Data
 * Creates ~60 feelings organized by family and intensity
 * Plus 30 quiz questions for learning pseudo-feelings detection
 */

interface FeelingData {
  word: string
  category: 'pleasant' | 'unpleasant'
  family: string
  intensity: number
  definition: string
  examples: Array<string>
  synonyms: Array<string>
  relatedFeelings: Array<string>
}

interface QuizQuestionData {
  level: number
  sentence: string
  isRealFeeling: boolean
  explanation: string
  correctFeelings?: Array<string>
  category: string
}

// ============================================================================
// FEELINGS DATA
// ============================================================================

export const feelingsData: Array<FeelingData> = [
  // ========== JOYFUL (Pleasant) ==========
  {
    word: 'joyful',
    category: 'pleasant',
    family: 'joyful',
    intensity: 5,
    definition:
      'A feeling of great happiness and delight. A sense of pleasure and celebration.',
    examples: [
      'I feel joyful when I accomplish a difficult goal.',
      'The news made me feel joyful and excited for the future.',
      "She felt joyful at the celebration of her child's graduation.",
    ],
    synonyms: ['happy', 'delighted', 'elated', 'cheerful'],
    relatedFeelings: ['cheerful', 'delighted', 'glad', 'happy'],
  },
  {
    word: 'cheerful',
    category: 'pleasant',
    family: 'joyful',
    intensity: 3,
    definition:
      'Feeling bright and optimistic. Showing good humor and happiness.',
    examples: [
      'She had a cheerful smile despite the difficult day.',
      "I feel cheerful after a good night's sleep.",
      'He approached the project with a cheerful attitude.',
    ],
    synonyms: ['happy', 'upbeat', 'bright', 'positive'],
    relatedFeelings: ['joyful', 'glad', 'happy', 'lighthearted'],
  },
  {
    word: 'delighted',
    category: 'pleasant',
    family: 'joyful',
    intensity: 4,
    definition:
      'Feeling great pleasure and satisfaction. Pleased and happy about something.',
    examples: [
      'I was delighted to receive the unexpected gift.',
      'She felt delighted by the praise from her mentor.',
      'He seemed delighted with how the event turned out.',
    ],
    synonyms: ['pleased', 'happy', 'thrilled', 'charmed'],
    relatedFeelings: ['joyful', 'glad', 'grateful', 'pleased'],
  },
  {
    word: 'glad',
    category: 'pleasant',
    family: 'joyful',
    intensity: 2,
    definition:
      'Feeling pleasure or satisfaction. Happy about something that has happened.',
    examples: [
      "I'm glad that you're feeling better now.",
      'She felt glad when she saw her old friends.',
      'He was glad to help with the project.',
    ],
    synonyms: ['happy', 'pleased', 'satisfied', 'content'],
    relatedFeelings: ['joyful', 'cheerful', 'pleased', 'satisfied'],
  },
  {
    word: 'happy',
    category: 'pleasant',
    family: 'joyful',
    intensity: 3,
    definition:
      'Feeling or showing pleasure and contentment. A general sense of well-being.',
    examples: [
      "I feel happy when I'm with my family.",
      'She was happy about the new opportunities.',
      'He looked happy as he walked into the room.',
    ],
    synonyms: ['joyful', 'pleased', 'content', 'cheerful'],
    relatedFeelings: ['joyful', 'cheerful', 'delighted', 'glad'],
  },
  {
    word: 'grateful',
    category: 'pleasant',
    family: 'joyful',
    intensity: 3,
    definition:
      'Feeling appreciative of kindness or help received. Thankful and appreciative.',
    examples: [
      "I feel grateful for all the support you've given me.",
      'She felt grateful when her team helped her meet the deadline.',
      'He expressed how grateful he was for the opportunity.',
    ],
    synonyms: ['thankful', 'appreciative', 'blessed'],
    relatedFeelings: ['thankful', 'hopeful', 'satisfied', 'pleased'],
  },
  {
    word: 'thankful',
    category: 'pleasant',
    family: 'joyful',
    intensity: 2,
    definition:
      'Feeling gratitude. Appreciative of something received or experienced.',
    examples: [
      "I'm thankful for this chance to learn and grow.",
      'She felt thankful when someone showed her kindness.',
      'He was thankful for the feedback on his work.',
    ],
    synonyms: ['grateful', 'appreciative', 'blessed'],
    relatedFeelings: ['grateful', 'hopeful', 'pleased', 'satisfied'],
  },
  {
    word: 'inspired',
    category: 'pleasant',
    family: 'joyful',
    intensity: 4,
    definition:
      'Feeling motivated and energized to create or achieve something. Stimulated mentally.',
    examples: [
      'I feel inspired by her determination and passion.',
      'The presentation inspired him to think differently.',
      'She felt inspired after reading the book.',
    ],
    synonyms: ['motivated', 'energized', 'stimulated', 'moved'],
    relatedFeelings: ['hopeful', 'excited', 'enthusiastic', 'energized'],
  },
  {
    word: 'hopeful',
    category: 'pleasant',
    family: 'joyful',
    intensity: 3,
    definition:
      'Feeling or expressing hope. Believing that something good will happen.',
    examples: [
      'I feel hopeful about the future despite the challenges.',
      'She felt hopeful when she learned about the new program.',
      'He was hopeful that things would improve.',
    ],
    synonyms: ['optimistic', 'confident', 'expectant'],
    relatedFeelings: ['optimistic', 'excited', 'inspired', 'peaceful'],
  },
  {
    word: 'optimistic',
    category: 'pleasant',
    family: 'joyful',
    intensity: 3,
    definition:
      'Feeling or showing confidence about the future. Expecting positive outcomes.',
    examples: [
      'She had an optimistic outlook despite the difficulties.',
      'He felt optimistic about his chances of success.',
      "I'm optimistic that we can solve this problem.",
    ],
    synonyms: ['hopeful', 'confident', 'positive'],
    relatedFeelings: ['hopeful', 'confident', 'peaceful', 'joyful'],
  },

  // ========== PEACEFUL (Pleasant) ==========
  {
    word: 'peaceful',
    category: 'pleasant',
    family: 'peaceful',
    intensity: 3,
    definition:
      'Free from conflict, disturbance, or violence. Calm and serene.',
    examples: [
      'I feel peaceful after meditation.',
      'The quiet evening felt peaceful and restorative.',
      'She created a peaceful environment in her home.',
    ],
    synonyms: ['calm', 'serene', 'tranquil', 'quiet'],
    relatedFeelings: ['calm', 'serene', 'relaxed', 'satisfied'],
  },
  {
    word: 'calm',
    category: 'pleasant',
    family: 'peaceful',
    intensity: 2,
    definition:
      'Peaceful and without worry or agitation. Composed and in control.',
    examples: [
      'She remained calm during the crisis.',
      'I felt calm after talking things through.',
      'He spoke in a calm voice that reassured everyone.',
    ],
    synonyms: ['peaceful', 'composed', 'serene', 'collected'],
    relatedFeelings: ['peaceful', 'relaxed', 'centered', 'confident'],
  },
  {
    word: 'relaxed',
    category: 'pleasant',
    family: 'peaceful',
    intensity: 2,
    definition: 'Free from tension or anxiety. In a state of ease and comfort.',
    examples: [
      'I felt relaxed on vacation away from work.',
      'She had a relaxed attitude toward the setback.',
      'He seemed relaxed and comfortable in the group.',
    ],
    synonyms: ['calm', 'comfortable', 'easygoing', 'laid-back'],
    relatedFeelings: ['calm', 'peaceful', 'satisfied', 'content'],
  },
  {
    word: 'serene',
    category: 'pleasant',
    family: 'peaceful',
    intensity: 3,
    definition: 'Calm and peaceful. Untroubled and undisturbed.',
    examples: [
      'The serene lake reflected the mountains perfectly.',
      'She had a serene expression despite the chaos around her.',
      'He felt serene after resolving the conflict.',
    ],
    synonyms: ['peaceful', 'calm', 'tranquil', 'composed'],
    relatedFeelings: ['peaceful', 'calm', 'centered', 'satisfied'],
  },
  {
    word: 'satisfied',
    category: 'pleasant',
    family: 'peaceful',
    intensity: 2,
    definition:
      'Content with what one has or has achieved. Pleased and gratified.',
    examples: [
      'I felt satisfied after completing the project.',
      'She was satisfied with the quality of her work.',
      'He seemed satisfied with the resolution.',
    ],
    synonyms: ['content', 'pleased', 'gratified', 'fulfilled'],
    relatedFeelings: ['content', 'peaceful', 'grateful', 'pleased'],
  },
  {
    word: 'content',
    category: 'pleasant',
    family: 'peaceful',
    intensity: 2,
    definition: "Satisfied and at peace. Happy with one's situation.",
    examples: [
      'I felt content reading quietly at home.',
      'She was content with the simple life.',
      'He seemed content with the progress made.',
    ],
    synonyms: ['satisfied', 'peaceful', 'comfortable', 'fulfilled'],
    relatedFeelings: ['satisfied', 'peaceful', 'grateful', 'accepted'],
  },

  // ========== EXCITED (Pleasant) ==========
  {
    word: 'excited',
    category: 'pleasant',
    family: 'excited',
    intensity: 4,
    definition:
      'Feeling very enthusiastic and eager. Emotionally stimulated and energized.',
    examples: [
      'I felt excited about starting the new job.',
      'She was excited when she heard the good news.',
      'He sounded excited when he talked about the project.',
    ],
    synonyms: ['enthusiastic', 'eager', 'energized', 'thrilled'],
    relatedFeelings: ['enthusiastic', 'energized', 'eager', 'inspired'],
  },
  {
    word: 'enthusiastic',
    category: 'pleasant',
    family: 'excited',
    intensity: 4,
    definition:
      'Having intense and eager interest in something. Showing great excitement.',
    examples: [
      'She was enthusiastic about the new initiative.',
      'He spoke enthusiastically about the opportunity.',
      'They were enthusiastic participants in the discussion.',
    ],
    synonyms: ['eager', 'excited', 'passionate', 'keen'],
    relatedFeelings: ['excited', 'passionate', 'energized', 'hopeful'],
  },
  {
    word: 'eager',
    category: 'pleasant',
    family: 'excited',
    intensity: 3,
    definition: 'Keen or enthusiastic. Having strong desire or interest.',
    examples: [
      'I was eager to learn more about the topic.',
      'She seemed eager to take on the challenge.',
      'He was eager to share his ideas.',
    ],
    synonyms: ['keen', 'enthusiastic', 'excited', 'keen'],
    relatedFeelings: ['excited', 'enthusiastic', 'hopeful', 'inspired'],
  },
  {
    word: 'energized',
    category: 'pleasant',
    family: 'excited',
    intensity: 3,
    definition:
      'Filled with energy and enthusiasm. Feeling vitalized and powerful.',
    examples: [
      'I felt energized after the workout.',
      'She was energized by the supportive feedback.',
      "He felt energized by the team's enthusiasm.",
    ],
    synonyms: ['invigorated', 'stimulated', 'vitalized', 'activated'],
    relatedFeelings: ['excited', 'enthusiastic', 'inspired', 'hopeful'],
  },

  // ========== ANGRY (Unpleasant) ==========
  {
    word: 'angry',
    category: 'unpleasant',
    family: 'angry',
    intensity: 5,
    definition:
      'Feeling strong displeasure and belligerence. In a state of rage or fury.',
    examples: [
      'I felt angry when my boundaries were disrespected.',
      'She was angry about the unfair treatment.',
      'He sounded angry when discussing the situation.',
    ],
    synonyms: ['furious', 'mad', 'enraged', 'livid'],
    relatedFeelings: ['frustrated', 'resentful', 'irritated', 'upset'],
  },
  {
    word: 'frustrated',
    category: 'unpleasant',
    family: 'angry',
    intensity: 3,
    definition:
      'Feeling annoyed or irritated at being unable to change something. Blocked or thwarted.',
    examples: [
      'I felt frustrated when the project hit roadblocks.',
      'She was frustrated by the lack of progress.',
      'He felt frustrated trying to communicate his ideas.',
    ],
    synonyms: ['annoyed', 'irritated', 'exasperated', 'vexed'],
    relatedFeelings: ['angry', 'irritated', 'discouraged', 'annoyed'],
  },
  {
    word: 'irritated',
    category: 'unpleasant',
    family: 'angry',
    intensity: 2,
    definition: 'Annoyed or made angry. Provoked to anger or impatience.',
    examples: [
      'I felt irritated by the repeated interruptions.',
      'She seemed irritated by the noise.',
      'He was irritated with the slow service.',
    ],
    synonyms: ['annoyed', 'vexed', 'exasperated', 'bothered'],
    relatedFeelings: ['frustrated', 'annoyed', 'impatient', 'bothered'],
  },
  {
    word: 'resentful',
    category: 'unpleasant',
    family: 'angry',
    intensity: 4,
    definition:
      'Feeling bitter about something unfair. Holding grudges and negative feelings.',
    examples: [
      'I felt resentful about being excluded from the meeting.',
      'She was resentful of the extra work assigned to her.',
      'He felt resentful about the unfair decision.',
    ],
    synonyms: ['bitter', 'grudging', 'indignant', 'aggrieved'],
    relatedFeelings: ['angry', 'frustrated', 'hurt', 'betrayed'],
  },
  {
    word: 'annoyed',
    category: 'unpleasant',
    family: 'angry',
    intensity: 2,
    definition: 'Slightly angry or irritated. Displeased or troubled.',
    examples: [
      'I was annoyed by the constant texting.',
      'She felt annoyed when her plans changed.',
      'He seemed annoyed by the questions.',
    ],
    synonyms: ['irritated', 'bothered', 'displeased', 'vexed'],
    relatedFeelings: ['frustrated', 'irritated', 'bothered', 'displeased'],
  },
  {
    word: 'upset',
    category: 'unpleasant',
    family: 'angry',
    intensity: 3,
    definition: 'Emotionally disturbed or unhappy. Troubled or distressed.',
    examples: [
      'I felt upset about the hurtful comments.',
      'She was upset when her trust was broken.',
      'He seemed upset about the cancellation.',
    ],
    synonyms: ['troubled', 'distressed', 'bothered', 'agitated'],
    relatedFeelings: ['angry', 'hurt', 'sad', 'anxious'],
  },

  // ========== SAD (Unpleasant) ==========
  {
    word: 'sad',
    category: 'unpleasant',
    family: 'sad',
    intensity: 3,
    definition:
      'Feeling sorrow or unhappiness. Expressing grief or disappointment.',
    examples: [
      'I felt sad when my friend moved away.',
      'She was sad about the ending of the story.',
      'He seemed sad when recalling the loss.',
    ],
    synonyms: ['sorrowful', 'unhappy', 'melancholic', 'downhearted'],
    relatedFeelings: ['disappointed', 'lonely', 'heartbroken', 'down'],
  },
  {
    word: 'disappointed',
    category: 'unpleasant',
    family: 'sad',
    intensity: 2,
    definition:
      'Sad or displeased because expectations were not met. Let down or discouraged.',
    examples: [
      'I felt disappointed when the event was cancelled.',
      'She was disappointed with the test results.',
      'He seemed disappointed by the response.',
    ],
    synonyms: ['let down', 'disheartened', 'discouraged', 'dissatisfied'],
    relatedFeelings: ['sad', 'discouraged', 'hurt', 'frustrated'],
  },
  {
    word: 'lonely',
    category: 'unpleasant',
    family: 'sad',
    intensity: 3,
    definition:
      'Sad because of isolation or lack of connection. Missing companionship.',
    examples: [
      'I felt lonely during the long trip away from home.',
      'She was lonely after her friends moved away.',
      'He seemed lonely despite being in a crowd.',
    ],
    synonyms: ['isolated', 'alone', 'disconnected', 'abandoned'],
    relatedFeelings: ['sad', 'disconnected', 'abandoned', 'misunderstood'],
  },
  {
    word: 'discouraged',
    category: 'unpleasant',
    family: 'sad',
    intensity: 3,
    definition:
      'Made less confident or enthusiastic. Feeling disheartened and lacking hope.',
    examples: [
      'I felt discouraged after repeated failures.',
      'She was discouraged by the lack of progress.',
      'He seemed discouraged about the future.',
    ],
    synonyms: ['disheartened', 'downhearted', 'dejected', 'dispirited'],
    relatedFeelings: ['sad', 'disappointed', 'helpless', 'uncertain'],
  },
  {
    word: 'heartbroken',
    category: 'unpleasant',
    family: 'sad',
    intensity: 5,
    definition:
      'Overwhelmed with grief, especially from romantic loss or deep disappointment.',
    examples: [
      'I felt heartbroken when the relationship ended.',
      'She was heartbroken about losing her closest friend.',
      'He seemed heartbroken over the circumstances.',
    ],
    synonyms: ['devastated', 'broken', 'shattered', 'grief-stricken'],
    relatedFeelings: ['sad', 'grieving', 'hurt', 'devastated'],
  },

  // ========== SCARED (Unpleasant) ==========
  {
    word: 'scared',
    category: 'unpleasant',
    family: 'scared',
    intensity: 4,
    definition:
      'Feeling fear or being frightened. Experiencing anxiety about something.',
    examples: [
      'I felt scared when I heard the loud noise.',
      'She was scared of the unknown future.',
      'He seemed scared about the medical procedure.',
    ],
    synonyms: ['afraid', 'frightened', 'terrified', 'panicked'],
    relatedFeelings: ['anxious', 'worried', 'terrified', 'uneasy'],
  },
  {
    word: 'anxious',
    category: 'unpleasant',
    family: 'scared',
    intensity: 3,
    definition:
      'Experiencing worry or nervous tension about something uncertain.',
    examples: [
      'I felt anxious before the presentation.',
      'She was anxious about the meeting results.',
      'He seemed anxious when discussing finances.',
    ],
    synonyms: ['worried', 'nervous', 'apprehensive', 'uneasy'],
    relatedFeelings: ['scared', 'worried', 'nervous', 'uncertain'],
  },
  {
    word: 'worried',
    category: 'unpleasant',
    family: 'scared',
    intensity: 2,
    definition:
      'Feeling troubled or uneasy about something. Concerned about what might happen.',
    examples: [
      'I felt worried about her health.',
      "She was worried that the plan wouldn't work.",
      'He seemed worried about making the deadline.',
    ],
    synonyms: ['anxious', 'concerned', 'apprehensive', 'troubled'],
    relatedFeelings: ['anxious', 'scared', 'uncertain', 'vulnerable'],
  },
  {
    word: 'nervous',
    category: 'unpleasant',
    family: 'scared',
    intensity: 2,
    definition:
      'Feeling or showing anxiety. Apprehensive or uneasy about something.',
    examples: [
      'I felt nervous about speaking in public.',
      'She was nervous about the upcoming exam.',
      'He seemed nervous meeting her parents.',
    ],
    synonyms: ['anxious', 'jittery', 'apprehensive', 'on edge'],
    relatedFeelings: ['anxious', 'worried', 'uncertain', 'vulnerable'],
  },
  {
    word: 'terrified',
    category: 'unpleasant',
    family: 'scared',
    intensity: 5,
    definition: 'Extremely frightened. Feeling intense fear.',
    examples: [
      'I felt terrified during the earthquake.',
      'She was terrified of losing her job.',
      'He seemed terrified by the threat.',
    ],
    synonyms: ['horrified', 'petrified', 'panic-stricken', 'frantic'],
    relatedFeelings: ['scared', 'panicked', 'helpless', 'overwhelmed'],
  },

  // ========== CONFUSED (Unpleasant) ==========
  {
    word: 'confused',
    category: 'unpleasant',
    family: 'confused',
    intensity: 2,
    definition:
      'Unable to understand or think clearly. Bewildered or disoriented.',
    examples: [
      'I felt confused by the conflicting instructions.',
      'She was confused about which direction to go.',
      'He seemed confused by the explanation.',
    ],
    synonyms: ['bewildered', 'disoriented', 'puzzled', 'perplexed'],
    relatedFeelings: ['uncertain', 'lost', 'overwhelmed', 'frustrated'],
  },
  {
    word: 'uncertain',
    category: 'unpleasant',
    family: 'confused',
    intensity: 2,
    definition:
      'Not able to decide or be sure about something. Lacking confidence.',
    examples: [
      'I felt uncertain about the right choice.',
      'She was uncertain how to proceed.',
      'He seemed uncertain about his decision.',
    ],
    synonyms: ['unsure', 'doubtful', 'hesitant', 'undecided'],
    relatedFeelings: ['confused', 'anxious', 'vulnerable', 'insecure'],
  },
  {
    word: 'overwhelmed',
    category: 'unpleasant',
    family: 'confused',
    intensity: 4,
    definition:
      'Greatly upset or bewildered. Having too much to handle or process.',
    examples: [
      'I felt overwhelmed with all the tasks.',
      'She was overwhelmed by the emotions.',
      'He seemed overwhelmed with work deadlines.',
    ],
    synonyms: ['overloaded', 'swamped', 'inundated', 'consumed'],
    relatedFeelings: ['stressed', 'anxious', 'helpless', 'exhausted'],
  },
]

// ============================================================================
// QUIZ QUESTIONS DATA
// ============================================================================

export const quizQuestionsData: Array<QuizQuestionData> = [
  // ========== LEVEL 1: Easy - Obvious pseudo-feelings ==========
  {
    level: 1,
    sentence: "I feel like you don't respect me.",
    isRealFeeling: false,
    explanation:
      "This is not a real feeling. 'You don't respect me' is a thought or interpretation about the other person's behavior. Real feelings would be: hurt, disrespected, or unvalued.",
    correctFeelings: ['hurt', 'disrespected', 'unvalued'],
    category: 'feel_like',
  },
  {
    level: 1,
    sentence: 'I feel that this is unfair.',
    isRealFeeling: false,
    explanation:
      "'This is unfair' is a judgment or evaluation, not a feeling. The actual feeling underneath might be frustrated, hurt, or angry about the situation.",
    correctFeelings: ['frustrated', 'hurt', 'angry'],
    category: 'feel_that',
  },
  {
    level: 1,
    sentence: "I feel that you're being disrespectful.",
    isRealFeeling: false,
    explanation:
      "This is a thought about the other person's behavior, not a feeling. Real feelings might be: annoyed, hurt, or disrespected.",
    correctFeelings: ['annoyed', 'hurt', 'disrespected'],
    category: 'feel_that',
  },
  {
    level: 1,
    sentence: 'I feel abandoned by you.',
    isRealFeeling: false,
    explanation:
      "While this uses feeling language, 'abandoned' is describing how you interpret the other person's actions. The real feeling is something like lonely, hurt, or sad.",
    correctFeelings: ['lonely', 'hurt', 'sad'],
    category: 'feel_like',
  },
  {
    level: 1,
    sentence: "I feel like you don't care about me.",
    isRealFeeling: false,
    explanation:
      'This is a thought about what the other person feels or thinks, not your feeling. Real feelings might be: hurt, lonely, or unvalued.',
    correctFeelings: ['hurt', 'lonely', 'unvalued'],
    category: 'feel_like',
  },
  {
    level: 1,
    sentence: 'I feel worried about the deadline.',
    isRealFeeling: true,
    explanation:
      "'Worried' is a real feeling. It describes your emotional state about a situation without blaming or judging the other person.",
    category: 'real_feeling',
  },
  {
    level: 1,
    sentence: 'I feel frustrated when you interrupt me.',
    isRealFeeling: true,
    explanation:
      "'Frustrated' is a real feeling. Even though it mentions the other person's action, the focus is on the speaker's emotional experience.",
    category: 'real_feeling',
  },
  {
    level: 1,
    sentence: 'I feel hurt by what you said.',
    isRealFeeling: true,
    explanation:
      "'Hurt' is a real feeling that accurately names an emotional experience, even though it's triggered by the other person's words.",
    category: 'real_feeling',
  },
  {
    level: 1,
    sentence: 'I feel angry when people are late.',
    isRealFeeling: true,
    explanation:
      "'Angry' is a real feeling. It describes your emotional response to lateness without judgment of the person.",
    category: 'real_feeling',
  },
  {
    level: 1,
    sentence: 'I feel that you never listen to me.',
    isRealFeeling: false,
    explanation:
      "'You never listen to me' is a generalization and judgment, not a feeling. Real feelings might be: unheard, frustrated, or lonely.",
    correctFeelings: ['unheard', 'frustrated', 'lonely'],
    category: 'feel_that',
  },

  // ========== LEVEL 2: Medium - Evaluative words disguised as feelings ==========
  {
    level: 2,
    sentence: "I feel ignored when you don't respond quickly.",
    isRealFeeling: false,
    explanation:
      "'Ignored' is actually an evaluation of the other person's behavior. Real feelings are: hurt, unvalued, or anxious about not being a priority.",
    correctFeelings: ['hurt', 'unvalued', 'anxious'],
    category: 'evaluative',
  },
  {
    level: 2,
    sentence: 'I feel rejected by the group.',
    isRealFeeling: false,
    explanation:
      "'Rejected' describes your interpretation of how you're being treated. The actual feeling is: hurt, lonely, or unvalued.",
    correctFeelings: ['hurt', 'lonely', 'unvalued'],
    category: 'evaluative',
  },
  {
    level: 2,
    sentence: 'I feel manipulated by your behavior.',
    isRealFeeling: false,
    explanation:
      "'Manipulated' is judging the other person's intentions. Real feelings might be: anxious, mistrustful, or defensive.",
    correctFeelings: ['anxious', 'mistrustful', 'defensive'],
    category: 'evaluative',
  },
  {
    level: 2,
    sentence: 'I feel unappreciated at work.',
    isRealFeeling: false,
    explanation:
      "'Unappreciated' is an evaluation of how you're being treated. Real feelings are: frustrated, discouraged, or unvalued.",
    correctFeelings: ['frustrated', 'discouraged', 'unvalued'],
    category: 'evaluative',
  },
  {
    level: 2,
    sentence: 'I feel excluded from the conversation.',
    isRealFeeling: false,
    explanation:
      "'Excluded' describes the situation, not the feeling. Real feelings might be: hurt, lonely, or invisible.",
    correctFeelings: ['hurt', 'lonely', 'invisible'],
    category: 'evaluative',
  },
  {
    level: 2,
    sentence: 'I feel sad when remembering that day.',
    isRealFeeling: true,
    explanation:
      "'Sad' is a real core feeling that accurately expresses an emotional state about a memory.",
    category: 'real_feeling',
  },
  {
    level: 2,
    sentence: 'I feel anxious about speaking up in meetings.',
    isRealFeeling: true,
    explanation:
      "'Anxious' is a real feeling that describes your emotional experience in that situation.",
    category: 'real_feeling',
  },
  {
    level: 2,
    sentence: 'I feel grateful for your help.',
    isRealFeeling: true,
    explanation:
      "'Grateful' is a real positive feeling that acknowledges appreciation without judgment.",
    category: 'real_feeling',
  },
  {
    level: 2,
    sentence: 'I feel unsupported by my team.',
    isRealFeeling: false,
    explanation:
      "'Unsupported' judges how the team is treating you. Real feelings are: lonely, discouraged, or abandoned.",
    correctFeelings: ['lonely', 'discouraged', 'abandoned'],
    category: 'evaluative',
  },
  {
    level: 2,
    sentence: 'I feel criticized when people give feedback.',
    isRealFeeling: false,
    explanation:
      "'Criticized' is judging the intent behind the feedback. Real feelings might be: defensive, hurt, or anxious.",
    correctFeelings: ['defensive', 'hurt', 'anxious'],
    category: 'evaluative',
  },

  // ========== LEVEL 3: Hard - Subtle/tricky cases ==========
  {
    level: 3,
    sentence: 'I feel misunderstood by everyone.',
    isRealFeeling: false,
    explanation:
      "'Misunderstood' evaluates how others perceive you. Real feelings are: frustrated, lonely, or desperate to be heard.",
    correctFeelings: ['frustrated', 'lonely', 'desperate'],
    category: 'tricky',
  },
  {
    level: 3,
    sentence: 'I feel vulnerable when sharing my thoughts.',
    isRealFeeling: true,
    explanation:
      "'Vulnerable' is a real core feeling describing emotional exposure and the courage it takes to share.",
    category: 'real_feeling',
  },
  {
    level: 3,
    sentence: 'I feel betrayed by your actions.',
    isRealFeeling: false,
    explanation:
      "'Betrayed' judges the other person's intentions based on your interpretation. Real feelings are: hurt, angry, or distrustful.",
    correctFeelings: ['hurt', 'angry', 'distrustful'],
    category: 'tricky',
  },
  {
    level: 3,
    sentence: 'I feel powerless in this situation.',
    isRealFeeling: false,
    explanation:
      "'Powerless' is a judgment about your capacity. Real feelings are: helpless, frustrated, or afraid.",
    correctFeelings: ['helpless', 'frustrated', 'afraid'],
    category: 'tricky',
  },
  {
    level: 3,
    sentence: 'I feel invisible when you ignore me.',
    isRealFeeling: false,
    explanation:
      "'Invisible' is a metaphor for how you're being treated. Real feelings are: hurt, unvalued, or lonely.",
    correctFeelings: ['hurt', 'unvalued', 'lonely'],
    category: 'tricky',
  },
  {
    level: 3,
    sentence: "I feel alive when I'm creating something new.",
    isRealFeeling: true,
    explanation:
      "'Alive' is a real feeling describing a state of vitality and engagement.",
    category: 'real_feeling',
  },
  {
    level: 3,
    sentence: 'I feel peaceful after our conversation.',
    isRealFeeling: true,
    explanation:
      "'Peaceful' is a real feeling describing a calm, serene emotional state.",
    category: 'real_feeling',
  },
  {
    level: 3,
    sentence: 'I feel disconnected from the group.',
    isRealFeeling: false,
    explanation:
      "'Disconnected' is an interpretation of your social status. Real feelings are: lonely, sad, or uncertain.",
    correctFeelings: ['lonely', 'sad', 'uncertain'],
    category: 'tricky',
  },
  {
    level: 3,
    sentence: 'I feel inspired by her courage.',
    isRealFeeling: true,
    explanation:
      "'Inspired' is a real feeling describing motivation and emotional stimulation from witnessing someone's actions.",
    category: 'real_feeling',
  },
  {
    level: 3,
    sentence: 'I feel trapped by my responsibilities.',
    isRealFeeling: false,
    explanation:
      "'Trapped' is a judgment about your situation. Real feelings are: overwhelmed, anxious, or resentful.",
    correctFeelings: ['overwhelmed', 'anxious', 'resentful'],
    category: 'tricky',
  },
]

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

export async function seedFeelings(ctx: MutationCtx) {
  // Seed feelings
  for (const feeling of feelingsData) {
    await ctx.db.insert('feelings', feeling)
  }
  console.log(`Seeded ${feelingsData.length} feelings`)
}

export async function seedFeelingsQuizQuestions(ctx: MutationCtx) {
  // Seed quiz questions
  for (const question of quizQuestionsData) {
    await ctx.db.insert('feelingsQuizQuestions', question)
  }
  console.log(`Seeded ${quizQuestionsData.length} quiz questions`)
}
