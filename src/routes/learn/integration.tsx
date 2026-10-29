import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { LessonPage } from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/integration')({
  head: () => ({
    meta: pageMeta({
      title: 'Putting It All Together',
      description:
        'Combine observation, feeling, need and request into one clear expression.',
    }),
  }),
  pendingComponent: () => <GiraffeLoader message="Opening the lesson..." />,
  component: IntegrationLesson,
})

function IntegrationLesson() {
  return <LessonPage lessonId="integration" />
}
