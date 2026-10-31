import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import {
  LessonLoader,
  LessonPage,
} from '~/components/features/learn/LessonPage'

export const Route = createFileRoute('/learn/feeling')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.learn.meta.feeling) }
  },
  pendingComponent: LessonLoader,
  component: FeelingLesson,
})

function FeelingLesson() {
  return <LessonPage lessonId="feeling" />
}
