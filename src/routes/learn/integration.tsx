import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import {
  LessonLoader,
  LessonPage,
} from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/integration')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.learn.meta.integration) }
  },
  pendingComponent: LessonLoader,
  component: IntegrationLesson,
})

function IntegrationLesson() {
  return <LessonPage lessonId="integration" />
}
