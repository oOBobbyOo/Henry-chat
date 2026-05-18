import Link from 'next/link'

import { cn } from '@/lib/utils'

type EntityLinkBaseProps = {
  className?: string
  children?: React.ReactNode
}

type ModelLinkProps = EntityLinkBaseProps & {
  /** model_name as it appears in the pricing API. Used as the route param. */
  modelName: string
}

export function ModelLink(props: ModelLinkProps) {
  return (
    <Link
      href={`/pricing/${props.modelName}`}
      className={cn('decoration-foreground/30 hover:decoration-foreground underline decoration-1 underline-offset-4 transition-colors', props.className)}
    >
      {props.children ?? props.modelName}
    </Link>
  )
}

type VendorLinkProps = EntityLinkBaseProps & {
  /** Display name of the vendor (e.g. "Google", "OpenAI"). */
  vendor: string
}

export function VendorLink(props: VendorLinkProps) {
  return (
    <Link
      href={{
        pathname: '/pricing',
        query: {
          vendor: props.vendor,
        },
      }}
      className={cn('hover:text-foreground underline decoration-current/40 decoration-1 underline-offset-2 transition-colors hover:decoration-current', props.className)}
    >
      {props.children ?? props.vendor}
    </Link>
  )
}
