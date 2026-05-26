import { AppHeader } from '@/components/app-header'

import { HomePromoCarousel } from './_components/home-promo-carousel'

export default async function HomePage() {
  return (
    <div className="bg-background flex h-[3000px] min-h-full flex-col">
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-(--app-content-max-width) flex-1 px-4 pt-8 pb-10 lg:px-5">
          <HomePromoCarousel />
        </div>
      </div>
    </div>
  )
}
