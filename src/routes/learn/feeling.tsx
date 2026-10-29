import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { LessonPage } from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/feeling')({
  head: () => ({
    meta: pageMeta({
      title: 'Identifying and Expressing Feelings',
      description:
        'Tell real feelings apart from thoughts, and name your emotions honestly.',
    }),
  }),
  pendingComponent: () => <GiraffeLoader message="Opening the lesson..." />,
  component: FeelingLesson,
})

function FeelingLesson() {
  return <LessonPage lessonId="feeling" />
}
