import { cn } from '@/lib/utils'

import { QUICK_QUESTIONS } from '../constants'

interface QuickQuestionsProps {
  onClickQuestion: (question: Chat.QuickQuestion) => void
}

export function QuickQuestions({ onClickQuestion }: QuickQuestionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {QUICK_QUESTIONS.map((question) => (
        <button
          key={question.id}
          onClick={() => {
            onClickQuestion(question)
          }}
          className={cn('cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600', 'transition-colors hover:border-blue-200 hover:bg-gray-50')}
        >
          {question.text}
        </button>
      ))}
    </div>
  )
}
