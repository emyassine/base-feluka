import type { App } from 'vue'
import NmBrandAttributions from './attributions/NmBrandAttributions.vue'
import NmBrandColorSection from './colors/NmBrandColorSection.vue'
import NmBrandFooter from './essentials/NmBrandFooter.vue'
import NmBrandHero from './essentials/NmBrandHero.vue'
import NmBrandIndex from './essentials/NmBrandIndex.vue'
import NmBrandOverview from './essentials/NmBrandOverview.vue'
import NmBrandVision from './essentials/NmBrandVision.vue'
import NmBrandIconLibrary from './icons/NmBrandIconLibrary.vue'
import NmBrandLogoSection from './logo/NmBrandLogoSection.vue'
import NmBrandPhotoSection from './photos/NmBrandPhotoSection.vue'
import NmBrandTypeSection from './type/NmBrandTypeSection.vue'

const brandComponents = {
  NmBrandAttributions,
  NmBrandColorSection,
  NmBrandFooter,
  NmBrandHero,
  NmBrandIndex,
  NmBrandOverview,
  NmBrandVision,
  NmBrandIconLibrary,
  NmBrandLogoSection,
  NmBrandPhotoSection,
  NmBrandTypeSection,
}

export function registerBrandComponents(app: App): void {
  for (const [name, component] of Object.entries(brandComponents)) {
    app.component(name, component)
  }
}
