import { Capabilities } from './_components/capabilities'
import { FinalCta } from './_components/final-cta'
import { Governance } from './_components/governance'
import { Hero } from './_components/hero'
import { Metrics } from './_components/metrics'
import { PartnersShowcase } from './_components/partners-showcase'
import { Routing } from './_components/routing'
import { Workflow } from './_components/workflow'

export default function TokenHubPage() {
  return (
    <main className="flex-1 bg-[#f7f9fd]">
      <Hero />
      <Metrics />
      <Capabilities />
      <Routing />
      <Workflow />
      <Governance />
      <PartnersShowcase />
      <FinalCta />
    </main>
  )
}
