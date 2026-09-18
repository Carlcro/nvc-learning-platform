import { describe, expect, it } from 'vitest'
import {
  pickRecommendedScenario,
  summarizeConversation,
} from './conversationInsights'

function userTurn(
  content: string,
  score: Partial<
    Record<'observation' | 'feeling' | 'need' | 'request' | 'total', number>
  >,
) {
  return {
    role: 'user' as const,
    content,
    nvcScore: {
      observation: 0,
      feeling: 0,
      need: 0,
      request: 0,
      total: 0,
      ...score,
    },
  }
}

const reply = { role: 'assistant' as const, content: 'Hm.' }

describe('summarizeConversation', () => {
  it('has nothing to say about a conversation with no scored turns', () => {
    expect(summarizeConversation([reply])).toEqual({
      strongest: null,
      focus: null,
      focusUntried: false,
      bestMessage: null,
    })
  })

  it('points at the earliest piece of the arc that never showed up', () => {
    const insights = summarizeConversation([
      userTurn('You got here at nine.', { observation: 22, total: 80 }),
      reply,
      userTurn('I felt worried.', { feeling: 20, total: 85 }),
    ])
    expect(insights.focus).toBe('need')
    expect(insights.focusUntried).toBe(true)
    expect(insights.strongest).toBe('observation')
  })

  it('averages a component only over the turns that attempted it', () => {
    // Three turns without a request must not drag the one clean request down.
    const insights = summarizeConversation([
      userTurn('a', { observation: 20, total: 70 }),
      userTurn('b', { feeling: 20, total: 70 }),
      userTurn('c', { need: 20, total: 70 }),
      userTurn('d', { request: 24, total: 95 }),
    ])
    expect(insights.strongest).toBe('request')
    expect(insights.focus).toBeNull()
  })

  it('names the weakest attempted component once all four were tried', () => {
    const insights = summarizeConversation([
      userTurn('a', { observation: 22, feeling: 21, total: 80 }),
      userTurn('b', { need: 9, request: 20, total: 60 }),
    ])
    expect(insights.focus).toBe('need')
    expect(insights.focusUntried).toBe(false)
  })

  it('prefers an earlier piece that never landed over a weaker later one', () => {
    // Feeling was tried but never reached the milestone bar; need was tried
    // once and scored lower. The arc order wins, matching the progress rail.
    const insights = summarizeConversation([
      userTurn('a', { observation: 18, feeling: 12, total: 55 }),
      userTurn('b', { feeling: 8, need: 5, total: 30 }),
    ])
    expect(insights.focus).toBe('feeling')
    expect(insights.focusUntried).toBe(false)
  })

  it('quotes the best message only when it genuinely landed', () => {
    const rough = summarizeConversation([
      userTurn('You never listen.', { observation: 4, total: 25 }),
    ])
    expect(rough.bestMessage).toBeNull()

    const good = summarizeConversation([
      userTurn('You never listen.', { observation: 4, total: 25 }),
      userTurn('I felt hurt when the plans changed.', {
        feeling: 23,
        total: 88,
      }),
    ])
    expect(good.bestMessage).toEqual({
      content: 'I felt hurt when the plans changed.',
      total: 88,
    })
  })
})

describe('pickRecommendedScenario', () => {
  const ladder = [
    { _id: 'a', unlockRequirements: { minLevel: 1 } },
    { _id: 'b', unlockRequirements: { minLevel: 1 } },
    { _id: 'c', unlockRequirements: { minLevel: 3 } },
  ]

  it('starts a new user at the first scenario', () => {
    expect(pickRecommendedScenario(ladder, [], 1)?._id).toBe('a')
  })

  it('skips what has been passed, but not what was only attempted', () => {
    const progress = [
      { scenarioId: 'a', status: 'mastered' },
      { scenarioId: 'b', status: 'attempted' },
    ]
    expect(pickRecommendedScenario(ladder, progress, 1)?._id).toBe('b')
  })

  it('never suggests the scenario that was just finished', () => {
    expect(pickRecommendedScenario(ladder, [], 1, 'a')?._id).toBe('b')
  })

  it('suggests a stretch scenario rather than nothing', () => {
    const progress = [
      { scenarioId: 'a', status: 'passed' },
      { scenarioId: 'b', status: 'passed' },
    ]
    expect(pickRecommendedScenario(ladder, progress, 1)?._id).toBe('c')
  })

  it('has nothing to suggest once everything is passed', () => {
    const progress = ladder.map((s) => ({
      scenarioId: s._id,
      status: 'passed',
    }))
    expect(pickRecommendedScenario(ladder, progress, 5)).toBeNull()
  })
})
