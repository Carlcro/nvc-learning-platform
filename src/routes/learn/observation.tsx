import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import {
  LessonLoader,
  LessonPage,
} from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/observation')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.learn.meta.observation) }
  },
  pendingComponent: LessonLoader,
  component: ObservationLesson,
})

function ObservationLesson() {
  return <LessonPage lessonId="observation" />
}
