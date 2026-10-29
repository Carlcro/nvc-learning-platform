import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { LessonPage } from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/observation')({
  head: () => ({
    meta: pageMeta({
      title: 'Observations Without Evaluation',
      description:
        'Describe what you see and hear without judgment, the first step of NVC.',
    }),
  }),
  pendingComponent: () => <GiraffeLoader message="Opening the lesson..." />,
  component: ObservationLesson,
})

function ObservationLesson() {
  return <LessonPage lessonId="observation" />
}
