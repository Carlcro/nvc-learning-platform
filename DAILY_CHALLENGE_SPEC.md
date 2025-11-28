I need to implement the AI-Generated Daily Challenge System for the NVC app.
This system generates 3 fresh scenarios every day (beginner, intermediate,
advanced) and assigns each user the appropriate difficulty level.

Please read these documents:

1. CLAUDE.md - for project patterns
2. PROJECT_SPEC.md - for overall context
3. SCENARIO_PROGRESSION_SPEC.md - for scenario structure
4. DAILY_CHALLENGE_SPEC.md - for complete daily challenge system specs

Then implement the Daily Challenge System:

═══════════════════════════════════════════════════════════════
PHASE 1: DATABASE & GENERATION (Start Here)
═══════════════════════════════════════════════════════════════

1. Update convex/schema.ts:
   - Add dailyChallenges table (see DAILY_CHALLENGE_SPEC.md)
   - Add dailyChallengeCompletions table
   - Update userProgress table with challenge tracking fields
   - Add all required indexes

2. Create convex/crons.ts:
   - Set up daily cron job at midnight UTC
   - Call generation function
   - Add weekly cleanup job (optional)

3. Create convex/dailyChallenges.ts:
   - Import Anthropic SDK ("use node")
   - Implement generateThreeTiers (internal action)
   - Implement AI generation function with proper prompt
   - Add validation for generated scenarios
   - Add queries: getToday, getMyChallenge, getByDate
   - Add mutations: create, recordCompletion
   - Implement determineUserDifficulty logic
   - Add streak checking logic

4. Test generation:
   - Run generation manually in Convex dashboard
   - Verify 3 scenarios created
   - Check all fields are populated correctly

═══════════════════════════════════════════════════════════════
PHASE 2: UI IMPLEMENTATION
═══════════════════════════════════════════════════════════════

5. Create main daily challenge page:
   - File: app/routes/challenges/daily.tsx
   - Show user's recommended challenge
   - Display challenge stats
   - Show other difficulty options
   - Protected route (requires auth)

6. Create DailyChallengeCard component:
   - File: app/components/features/challenges/DailyChallengeCard.tsx
   - Show challenge details (title, situation, character)
   - Display learning objectives
   - Show 2x bonus indicator
   - Countdown timer (hours remaining)
   - Start button links to conversation
   - Handle completed state (show score, retry button)

7. Create ChallengeStats component:
   - File: app/components/features/challenges/ChallengeStats.tsx
   - Show current streak (with fire emoji if 7+)
   - Display total challenges completed
   - Show average score
   - Highlight achievements

8. Add to navigation:
   - Update FloatingNav to include "Daily" link
   - Use 🎯 emoji icon
   - Link to /challenges/daily

═══════════════════════════════════════════════════════════════
PHASE 3: INTEGRATION WITH PRACTICE
═══════════════════════════════════════════════════════════════

9. Connect to conversation system:
   - When user starts daily challenge, create conversation
   - Use daily challenge as scenario source
   - Track that it's a daily challenge (for bonus points)
   - Record completion with 2x multiplier

10. Update completion flow:
    - After conversation completes, call recordCompletion
    - Calculate bonus points (base × 2)
    - Update streak
    - Show special "Daily Challenge Complete" results screen
    - Update user progress stats

═══════════════════════════════════════════════════════════════
IMPORTANT REQUIREMENTS
═══════════════════════════════════════════════════════════════

TypeScript & Types:

- Use strict TypeScript
- Import types from \_generated
- Proper error handling

AI Generation:

- Use Claude Sonnet 4.5 model
- Prompt must request 3 scenarios (one per difficulty)
- Validate JSON response structure
- Handle AI failures gracefully (log error, use backup)

Difficulty Assignment:

- Level 1-2 → Beginner
- Level 3-5 → Intermediate (adjust based on recent scores)
- Level 6+ → Advanced
- Consider recent performance in recommendation

Streak Logic:

- Count consecutive days
- Reset if missed a day
- Show streak prominently
- Celebrate 7, 30, 100 day milestones

Points & Rewards:

- Base: 100 points per star
- Multiplier: 2x for daily challenges
- Update user total points
- Track separately from regular scenarios

UI/UX:

- Use giraffe color scheme
- Prominent 2x bonus indicator
- Countdown timer showing time remaining
- Celebration on completion
- Responsive design

Testing:

- Test generation manually first
- Verify difficulty assignment works
- Check streak logic
- Test completion and points

═══════════════════════════════════════════════════════════════
DELIVERABLES
═══════════════════════════════════════════════════════════════

When complete, users should be able to:

1. See today's challenge on /challenges/daily
2. Start the challenge appropriate for their level
3. Complete it and receive 2x points
4. See their streak maintained
5. View stats and history
6. New challenges appear daily at midnight

Success criteria:

- Daily generation works (can test manually)
- UI shows challenges correctly
- Difficulty assignment is accurate
- Streak tracking works
- Points awarded with 2x multiplier
- Stats update correctly

═══════════════════════════════════════════════════════════════
