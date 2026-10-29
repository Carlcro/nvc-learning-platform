import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { LessonPage } from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/introduction')({
  head: () => ({
    meta: pageMeta({
      title: 'Introduction to Non-Violent Communication',
      description:
        'What compassionate communication is, and why it changes how conversations go.',
    }),
  }),
  pendingComponent: () => <GiraffeLoader message="Opening the lesson..." />,
  component: IntroductionLesson,
})

function IntroductionLesson() {
  return <LessonPage lessonId="introduction" />
}
