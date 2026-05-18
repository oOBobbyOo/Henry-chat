import { Trophy } from 'lucide-react'

import { ModelLeaderboard } from './ModelLeaderboard'

type ModelsSectionProps = {
  history: Ranking.ModelHistorySeries
  rows: Ranking.ModelRanking[]
  period: Ranking.Period
}

export function ModelsSection(props: ModelsSectionProps) {
  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <div className="border-t">
        <header className="px-5 pt-4 pb-2">
          <h3 className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
            <Trophy className="size-3.5 text-amber-500" />
            {'LLM Leaderboard'}
          </h3>
          <p className="text-muted-foreground/80 mt-0.5 text-xs">{'Compare the most popular models on the platform'}</p>
        </header>
        {props.rows.length === 0 ? (
          <div className="text-muted-foreground/80 px-5 py-8 text-center text-sm">{'No models match the selected filters'}</div>
        ) : (
          <div className="px-5 pt-1 pb-4">
            <ModelLeaderboard rows={props.rows} />
          </div>
        )}
      </div>
    </section>
  )
}
