import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { LessonPage } from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/need')({
  head: () => ({
    meta: pageMeta({
      title: 'Connecting Feelings to Needs',
      description:
        'Find the universal human need underneath a feeling.',
    }),
  }),
  pendingComponent: () => <GiraffeLoader message="Opening the lesson..." />,
  component: NeedLesson,
})

function NeedLesson() {
  return <LessonPage lessonId="need" />
}
