import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { LessonPage } from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/request')({
  head: () => ({
    meta: pageMeta({
      title: 'Making Clear Requests',
      description:
        'Ask for something concrete and doable, without turning it into a demand.',
    }),
  }),
  pendingComponent: () => <GiraffeLoader message="Opening the lesson..." />,
  component: RequestLesson,
})

function RequestLesson() {
  return <LessonPage lessonId="request" />
}
