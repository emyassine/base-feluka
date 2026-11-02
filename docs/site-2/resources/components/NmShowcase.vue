<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface ShowcaseStory {
  name: string
  beforeImage: string
  afterImage: string
  beforeText: string
  afterText: string
}

const ycStories: ShowcaseStory[] = [
  {
    name: 'Airbnb',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/airbnb-batch-2-a1df9c49bacc25254fe05a3bac4921eff5ac37109de97b1d2337f6fd86a488be.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/airbnb-now-1-26d764d24e2486fd91a902dbd06b7bb05a3613e5af6273baffecf6f24090f6d1.jpg',
    beforeText: 'Brian, Joe, and Nate did YC in W09.',
    afterText: 'Airbnb went public in 2020 at an over $100B valuation.',
  },
  {
    name: 'OpenAI',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/openai-batch-2-bd451c2a6d1966e17822ce4a22aeaec5167daad588cf0a99a9a68c563b6b4028.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/openai-now-1-14b338a4c66a1ad05c34b311d1d4c1b535cb960ef24109be329fe552358ebba9.jpg',
    beforeText: "Sam was part of YC's inaugural batch in S05 and founded OpenAI as YC Research in 2015.",
    afterText: 'Sam built OpenAI into a $500B company.',
  },
  {
    name: 'Stripe',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/stripe-batch-2-60e80fb0b35bee455d46fafcd3b175126ae5fce3e397e94a919b968a832d6107.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/stripe-now-1-4fc6337a8f67eadec8f2f1e6b72dc008fb646e670d0336caa16902f51602aa85.jpg',
    beforeText: 'The Collison brothers did YC twice—first in W07 and then in S09, when they started Stripe.',
    afterText: 'Stripe is now the internet’s $107B payments backbone.',
  },
  {
    name: 'Coinbase',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/coinbase-batch-1-d0d5c84104f9f9578d888d283099ee17b47731e6301304faf9d1109b38e4d177.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/coinbase-now-1d5b1a7aa6aaa70d84f4e77bcc5d35e63a9cedbb9dcb849ab946d1c274b6e47e.jpg',
    beforeText: 'Fred and Brian met on Reddit and did YC in S12.',
    afterText: 'Coinbase went public in 2021 at an $86B valuation.',
  },
  {
    name: 'DoorDash',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/doordash-batch-2-dd602f0734e6093e3d306eb0f7de4fad730cc6d357f478a769c97d0e50c5ceb2.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/doordash-now-331fd1df377dabb40264bb83071545d114a7a9fb024f152a8098c98c2fcab3f7.jpg',
    beforeText: 'Andy, Stanley, Tony, and Evan did YC in S13.',
    afterText: 'DoorDash went public in 2020 at a valuation of $39B.',
  },
  {
    name: 'Scale AI',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/scale-ai-batch3-cac949deabf5b818c3f3f2c49d9e2d194227ec90dab863ac2ab636dbb870cd19.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/scaleai-now-1-225d65a5b18021eeaa18fe4eadb83f9cd4ea5abffe8dbac6c51f87866dd5cd37.jpg',
    beforeText: 'Alexandr and Lucy did YC S16 and pivoted during the batch.',
    afterText: 'In 2025, Meta acquired 49% of Scale for over $14B.',
  },
  {
    name: 'Dropbox',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/dropbox-batch-7f8ebe6bc34eb91cd5103055679597bd7b6628c50ed447b7d6a33c1fda872223.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/dropbox-now-64142144a6030372b92accc4e8531ead60eea517d9a24230c30371c7358a206b.jpg',
    beforeText: 'Arash and Drew started Dropbox at MIT and did YC in S07.',
    afterText: 'Dropbox had the biggest tech IPO of 2018 at a $9B valuation.',
  },
  {
    name: 'Reddit',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/reddit-batch-a4d08a9bbb466f39806eab735405aea784f6b39f22c9af07f697fe8c323cdc2e.png',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/reddit-now-f6838bd6494ed8a21e646d7ee4a79c0f12f684e8842cd7c53612c5f31d7aa0eb.jpg',
    beforeText: 'Alexis and Steve were in the inaugural YC batch in S05.',
    afterText: 'Reddit went public in 2024 at a $6.4B valuation.',
  },
  {
    name: 'Instacart',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/instacart-batch-2-c4d5c8eea73e1c85e472b9b3fa9f91488ca278f2f2bf258d30166c61847a3c43.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/instacart-now-2-296ed5ff821bb577b68429995747f9251c1d02bb7ceb4d52e727db3f2d295332.jpg',
    beforeText: 'Apoorva, Max, and Brandon did YC in S12.',
    afterText: 'Instacart went public in 2023 at a $10B valuation.',
  },
  {
    name: 'GitLab',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/gitlab-batch-1-858c18e16366d3344abd06cec9ad5f6440f1395086e96fc733baf2a927645e4e.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/gitlab-now-2-1c6a0934f16b0f8d84d0fc90ffa92d8c11f7fb7ca40d44b9e6d4627b620edcba.jpg',
    beforeText: 'Sid and Dmytro did YC in S14.',
    afterText: 'GitLab went public in 2021 at an $11B valuation.',
  },
  {
    name: 'Kalshi',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/kalshi-batch-1-12c1828169bef411e3f7910f0b7e48f8e5fb4d1f7eafee50926c933b55b324d5.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/kalshi-now-1-3affaf3dd1e1259afd5d1f72f1b0331818f9ed44454d1820b20b01c58771495b.jpg',
    beforeText: 'Tarek and Luana did YC in W19.',
    afterText: 'Kalshi reached an $11B valuation in 2025.',
  },
  {
    name: 'Replit',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/replit-batch-1-1fa8581e2ab474b5475f0ba9ef36c5eebbecfe58a82759ca1cdb6ee45f64c38c.jpg',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/replit-now-3-03e7f981faef0a67ca9ba3b60f41f91a6179d41abc628de02373d2607b8fb343.jpg',
    beforeText: 'Haya and Amjad interviewing for the YC W18 batch.',
    afterText: 'Replit became a leading AI coding platform valued at over $9B.',
  },
  {
    name: 'Twitch',
    beforeImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/twitch-batch-3714c0d71b6d4d29c573e59b5b2b165dc6b78f3f837af6ad49149152a62208fe.png',
    afterImage: 'https://bookface-static.ycombinator.com/assets/ycdc/beforevsnow/twitch-now-2-9f9f4f8fa6f4e70b792332cb296e107391771cf947aae6c1e8fc2967d0836bfb.jpg',
    beforeText: 'Michael, Justin, Kyle, and Emmett in YC W07.',
    afterText: 'Twitch was acquired by Amazon for nearly $1B.',
  },
]

const props = defineProps<{
  title: string
  footnote?: string
  citation?: string
  stories?: ShowcaseStory[]
}>()
const displayStories = computed(() => props.stories ?? ycStories)

const track = ref<HTMLElement | null>(null)
const cards = ref<HTMLElement[]>([])
const revealedStory = ref<number | null>(null)
const pinnedStory = ref<number | null>(null)
const prefersReducedMotion = ref(false)
let observer: IntersectionObserver | undefined
let revealTimer: ReturnType<typeof setTimeout> | undefined
let resetTimer: ReturnType<typeof setTimeout> | undefined
let visibleCard: number | null = null

function clearTimers() {
  if (revealTimer) clearTimeout(revealTimer)
  if (resetTimer) clearTimeout(resetTimer)
  revealTimer = undefined
  resetTimer = undefined
}

function playStory(index: number) {
  if (pinnedStory.value !== null) return
  clearTimers()
  revealedStory.value = null

  if (prefersReducedMotion.value) return

  revealTimer = setTimeout(() => {
    if (visibleCard !== index || pinnedStory.value !== null) return
    revealedStory.value = index
    resetTimer = setTimeout(() => {
      if (pinnedStory.value === null && visibleCard === index) revealedStory.value = null
    }, 4200)
  }, 500)
}

function toggleStory(index: number) {
  clearTimers()
  if (pinnedStory.value === index) {
    pinnedStory.value = null
    revealedStory.value = null
    if (visibleCard !== null) playStory(visibleCard)
    return
  }

  pinnedStory.value = index
  revealedStory.value = index
}

function onCardEnter(index: number) {
  clearTimers()
  activeStory.value = index
  revealedStory.value = index
}

function onCardLeave(index: number) {
  if (pinnedStory.value !== null || visibleCard === index) return
  revealedStory.value = null
}

function scrollByCard(direction: -1 | 1) {
  const firstCard = cards.value[0]
  const distance = firstCard?.getBoundingClientRect().width ?? 320
  track.value?.scrollBy({ left: direction * (distance + 20), behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value || !track.value || !('IntersectionObserver' in window)) return

  observer = new IntersectionObserver((entries) => {
    const mostVisible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

    if (!mostVisible) return
    const index = Number((mostVisible.target as HTMLElement).dataset.storyIndex)
    if (!Number.isInteger(index) || index === visibleCard) return

    visibleCard = index
    playStory(index)
  }, { root: track.value, threshold: [0.65, 0.8, 1] })

  cards.value.forEach((card) => observer?.observe(card))
})

onBeforeUnmount(() => {
  clearTimers()
  observer?.disconnect()
})
</script>

<template>
  <section class="nm-showcase" aria-label="Company showcase">
    <header class="nm-showcase__intro">
      <h2>{{ props.title }}</h2>
      <p v-if="props.footnote" class="nm-showcase__footnote">
        <span class="nm-showcase__footnote-marker">[1]</span>
        {{ props.footnote }}
        <cite v-if="props.citation">— {{ props.citation }}</cite>
      </p>
    </header>

    <div class="nm-showcase__carousel">
      <button class="nm-showcase__arrow nm-showcase__arrow--previous" type="button" aria-label="Previous stories" @click="scrollByCard(-1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <div ref="track" class="nm-showcase__track" aria-label="Showcase stories">
        <article
          v-for="(story, index) in displayStories"
          :key="`${story.name}-${index}`"
          :ref="(element) => { if (element instanceof HTMLElement) cards[index] = element }"
          class="nm-showcase__slide"
          :data-story-index="index"
        >
          <button
            class="nm-showcase__card"
            type="button"
            :aria-label="`${story.name}: ${revealedStory === index ? 'showing now' : 'showing YC beginnings'}. Activate to toggle.`"
            :aria-pressed="pinnedStory === index"
            @pointerenter="onCardEnter(index)"
            @pointerleave="onCardLeave(index)"
            @focus="onCardEnter(index)"
            @blur="onCardLeave(index)"
            @click="toggleStory(index)"
          >
            <span class="nm-showcase__image nm-showcase__image--before" :style="{ backgroundImage: `url('${story.beforeImage}')` }" />
            <span class="nm-showcase__image nm-showcase__image--after" :class="{ 'is-visible': revealedStory === index }" :style="{ backgroundImage: `url('${story.afterImage}')` }" />
            <span class="nm-showcase__scrim" />
            <span class="nm-showcase__copy">
              <span class="nm-showcase__name">{{ story.name }}</span>
              <span class="nm-showcase__story">
                <span class="nm-showcase__story-text" :class="{ 'is-hidden': revealedStory === index }">{{ story.beforeText }}</span>
                <span class="nm-showcase__story-text nm-showcase__story-text--after" :class="{ 'is-visible': revealedStory === index }">{{ story.afterText }}</span>
              </span>
              <span class="nm-showcase__timeline" aria-hidden="true">
                <span class="nm-showcase__timeline-label">YC</span>
                <span class="nm-showcase__timeline-rail"><span class="nm-showcase__timeline-fill" :class="{ 'is-filled': revealedStory === index }" /></span>
                <span class="nm-showcase__timeline-label">Now</span>
              </span>
            </span>
          </button>
        </article>
      </div>
      <button class="nm-showcase__arrow nm-showcase__arrow--next" type="button" aria-label="Next stories" @click="scrollByCard(1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.nm-showcase {
  --showcase-ink: #16140f;
  position: relative;
  width: 100vw;
  margin: 4rem calc(50% - 50vw) 5rem;
  padding: clamp(3rem, 7vw, 6rem) 0;
  overflow: hidden;
  background: #faf9f6;
  color: var(--showcase-ink);
}

.nm-showcase__intro {
  width: min(85vw, 1000px);
  margin: 0 auto 2rem;
  text-align: center;
}

.nm-showcase__intro h2 {
  max-width: 950px;
  margin: 0 auto;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(2rem, 5vw + 1rem, 5.25rem);
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.nm-showcase__footnote {
  max-width: 420px;
  margin: 1.5rem auto 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(1rem, 2vw + 0.25rem, 1.125rem);
  font-style: italic;
  line-height: 1.6;
  text-align: left;
}

.nm-showcase__footnote-marker { font-style: normal; }
.nm-showcase__footnote cite { display: block; margin-top: 0.6rem; font-size: 0.95em; text-align: right; }

.nm-showcase__carousel { position: relative; }

.nm-showcase__track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 0 max(7.5vw, calc((100vw - 1000px) / 2));
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.nm-showcase__track::-webkit-scrollbar { display: none; }
.nm-showcase__slide { flex: 0 0 clamp(280px, 30vw, 360px); scroll-snap-align: center; }

.nm-showcase__card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 0;
  border-radius: 0.8rem;
  padding: 0;
  background: #242424;
  color: #fff;
  cursor: pointer;
  text-align: left;
  transition: transform 300ms ease, box-shadow 300ms ease;
}

.nm-showcase__card:hover,
.nm-showcase__card:focus-visible { transform: translateY(-3px); box-shadow: 0 16px 36px rgb(22 20 15 / 0.2); }
.nm-showcase__card:focus-visible { outline: 3px solid #2364e8; outline-offset: 4px; }

.nm-showcase__image,
.nm-showcase__scrim { position: absolute; inset: 0; display: block; }
.nm-showcase__image { background-position: center; background-repeat: no-repeat; background-size: cover; transition: opacity 700ms ease-in-out; }
.nm-showcase__image--before { opacity: 1; }
.nm-showcase__image--after { opacity: 0; }
.nm-showcase__image--after.is-visible { opacity: 1; }
.nm-showcase__scrim { background: linear-gradient(180deg, transparent 35%, rgb(0 0 0 / 0.18) 58%, rgb(0 0 0 / 0.78) 100%); }

.nm-showcase__copy {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.5rem;
  color: #fff;
  font-family: Outfit, Inter, ui-sans-serif, system-ui, sans-serif;
}

.nm-showcase__name { font-size: 1.25rem; font-weight: 400; letter-spacing: -0.02em; line-height: 1.3; }
.nm-showcase__story { position: relative; display: block; min-height: 3.7rem; font-size: 0.875rem; font-weight: 300; line-height: 1.4; }
.nm-showcase__story-text { display: block; transition: opacity 500ms ease, transform 500ms ease; }
.nm-showcase__story-text.is-hidden { transform: translateY(-0.5rem); opacity: 0; }
.nm-showcase__story-text--after { position: absolute; inset: 0; transform: translateY(0.5rem); opacity: 0; }
.nm-showcase__story-text--after.is-visible { transform: translateY(0); opacity: 0.96; }

.nm-showcase__timeline { display: flex; align-items: center; gap: 0.55rem; }
.nm-showcase__timeline-label { flex: none; color: rgb(255 255 255 / 0.86); font-size: 0.68rem; font-weight: 500; letter-spacing: 0.05em; }
.nm-showcase__timeline-rail { position: relative; flex: 1; height: 2px; overflow: hidden; border-radius: 2px; background: rgb(255 255 255 / 0.3); }
.nm-showcase__timeline-fill { position: absolute; inset: 0 auto 0 0; width: 100%; transform: scaleX(0); transform-origin: left center; border-radius: inherit; background: #fff; transition: transform 4.2s linear; }
.nm-showcase__timeline-fill.is-filled { transform: scaleX(1); }

.nm-showcase__arrow {
  position: absolute;
  z-index: 3;
  top: 50%;
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  transform: translateY(-50%);
  border: 1px solid rgb(22 20 15 / 0.12);
  border-radius: 999px;
  background: rgb(250 249 246 / 0.92);
  color: var(--showcase-ink);
  cursor: pointer;
  box-shadow: 0 2px 12px rgb(22 20 15 / 0.1);
}

.nm-showcase__arrow svg { width: 1.2rem; height: 1.2rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.nm-showcase__arrow--previous { left: max(1rem, calc((100vw - 1120px) / 2)); }
.nm-showcase__arrow--next { right: max(1rem, calc((100vw - 1120px) / 2)); }
.nm-showcase__arrow:hover { background: #fff; }
.nm-showcase__arrow:focus-visible { outline: 3px solid #2364e8; outline-offset: 3px; }

@media (max-width: 959px) {
  .nm-showcase { margin-top: 3rem; padding: 2.25rem 0 3rem; }
  .nm-showcase__intro { width: min(85vw, 500px); margin-bottom: 1.5rem; }
  .nm-showcase__intro h2 { font-size: 2rem; line-height: 1.2; }
  .nm-showcase__footnote { margin-top: 1.5rem; font-size: 1rem; }
  .nm-showcase__track { gap: 1.25rem; padding-inline: 7.5vw; }
  .nm-showcase__slide { flex-basis: min(85vw, 360px); }
  .nm-showcase__arrow { display: none; }
}

html.dark .nm-showcase {
  --showcase-ink: #f4f2ed;
  background: #101114;
}

@media (prefers-reduced-motion: reduce) {
  .nm-showcase__card,
  .nm-showcase__image,
  .nm-showcase__story-text,
  .nm-showcase__timeline-fill { transition: none; }
}
</style>
