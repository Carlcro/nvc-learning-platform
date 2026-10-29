---
target: learn area
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/carlc/Documents/development/nvc-learning-platform/src/routes/learn/index.tsx"
target_fingerprint: "sha256:922d36abf73e4ebb806ea5900a677e6852a09f43fc41bdaf97e95f25df454e76"
target_path: /Users/carlc/Documents/development/nvc-learning-platform/src/routes/learn/index.tsx
timestamp: 2026-10-29T21-54-26Z
slug: src-routes-learn-index-tsx
---
Learn area critique (dual-agent). Score 20/40. Verdict: generic template catalog and 6 copy-pasted lesson pages, pre-rework visual language.
P1 white on gold gradient hero bands fail contrast (1.6 to 2.95:1): learn/index.tsx:103, line 50 of every lesson file.
P1 six near-duplicate lesson files (~2,300 lines) have drifted; build one LessonPage from convex/lessons.ts.
P1 quiz Show Answer locks a wrong answer (QuizSection.tsx:48,96); feedback generic, coral on coral.
P2 after passing, primary is Retake Quiz; next lesson two sections down; three "Complete!" headings; stat row grading.
P2 index is a catalog, no h1, hero duplicates a grid card, no progress.
P2 filler copy: transform/master/dive deeper, static integration breakdown, em dashes lessons.ts:81,393, "15-20 categories" needs question, coral check on jackal takeaway.
Detector: CLI clean; browser only cream-palette (intentional).
