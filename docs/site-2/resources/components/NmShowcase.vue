<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface ShowcaseStory {
  name: string
  description: string
  color: string
  beforeImage: string
  afterImage: string
  beforeText: string
  afterText: string
}

export interface ShowcaseLabels {
  region: string
  before: string
  beforeColor?: string
  after: string
  afterColor?: string
  timelineStart: string
  timelineEnd: string
  companies: string
  stories: string
  compare: string
  altBefore: string
  altAfter: string
}

const props = defineProps<{
  title: string
  stories: ShowcaseStory[]
  labels: ShowcaseLabels
  footnote?: string
  footnoteMarker?: string
  citation?: string
}>()

const REST_ZONE = 0.05
const AUTOPLAY_DURATION = 4200

const count = computed(() => props.stories.length)

const stageTrack = ref<HTMLElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
const cards = ref<HTMLElement[]>([])
const pos = ref(0)
const storyProgress = ref<number[]>([])
const manuallyControlled = ref<boolean[]>([])
const prefersReducedMotion = ref(false)

const active = computed(() => Math.round(pos.value))

let scrollFrame = 0
let carouselFrame = 0
let animationFrame = 0
let animatedStory: number | null = null
const visibleCard = ref<number | null>(null)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function fill(template: string, name: string) {
  return template.replace('{name}', name)
}

function nameParts(name: string) {
  const andIndex = name.indexOf(' and ')
  if (andIndex < 0) return { first: name, second: '' }
  return {
    first: name.slice(0, andIndex),
    second: name.slice(andIndex + 1),
  }
}

function descriptionSentences(description: string) {
  return description.match(/[^.]+(?:\.|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [description]
}

function stageMetrics() {
  const element = stageTrack.value
  if (!element) return null
  const rect = element.getBoundingClientRect()
  if (rect.height === 0) return null
  return { rect, total: Math.max(1, rect.height - window.innerHeight) }
}

function updateFromScroll() {
  scrollFrame = 0
  const metrics = stageMetrics()
  if (!metrics) return
  const raw = clamp(-metrics.rect.top / metrics.total, 0, 1)
  const eased = clamp((raw - REST_ZONE) / (1 - REST_ZONE * 2), 0, 1)
  pos.value = eased * Math.max(0, count.value - 1)
}

function requestScrollUpdate() {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(updateFromScroll)
}

function scrollToIndex(index: number) {
  const metrics = stageMetrics()
  if (!metrics) return
  const last = Math.max(1, count.value - 1)
  const raw = REST_ZONE + (index / last) * (1 - REST_ZONE * 2)
  window.scrollTo({
    top: window.scrollY + metrics.rect.top + raw * metrics.total,
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
  })
}

function onNamesKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault()
    scrollToIndex(Math.min(count.value - 1, active.value + 1))
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollToIndex(Math.max(0, active.value - 1))
  }
}

function progressFor(index: number) {
  return storyProgress.value[index] ?? 0
}

function setProgress(index: number, value: number) {
  const next = [...storyProgress.value]
  next[index] = clamp(value, 0, 100)
  storyProgress.value = next
}

function stopAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = 0
  animatedStory = null
}

function animateStory(index: number) {
  if (prefersReducedMotion.value || manuallyControlled.value[index]) return
  stopAnimation()
  if (progressFor(index) >= 100) setProgress(index, 0)

  const startProgress = progressFor(index)
  const startTime = performance.now()
  animatedStory = index

  const step = (now: number) => {
    if (animatedStory !== index) return
    const fraction = Math.min(1, (now - startTime) / AUTOPLAY_DURATION)
    setProgress(index, startProgress + (100 - startProgress) * fraction)
    if (fraction < 1) {
      animationFrame = requestAnimationFrame(step)
    } else {
      animationFrame = 0
      animatedStory = null
      if (window.matchMedia('(max-width: 1023px)').matches && count.value > 1) {
        const nextIndex = (index + 1) % count.value
        scrollCarouselToIndex(nextIndex)
      }
    }
  }

  animationFrame = requestAnimationFrame(step)
}

function onRangeInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  stopAnimation()
  manuallyControlled.value[index] = true
  setProgress(index, Number(input.value))
}

function setCardRef(element: unknown, index: number) {
  if (element) cards.value[index] = element as HTMLElement
}

function updateActiveCarouselCard() {
  carouselFrame = 0
  const viewport = scroller.value
  if (!viewport || !cards.value.length || window.matchMedia('(min-width: 1024px)').matches) return

  const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
  let closestIndex = -1
  let closestDistance = Number.POSITIVE_INFINITY

  cards.value.forEach((card, index) => {
    if (!card) return
    const rect = card.getBoundingClientRect()
    const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  if (closestIndex < 0 || closestIndex === visibleCard.value) return
  visibleCard.value = closestIndex
  animateStory(closestIndex)
}

function requestActiveCarouselUpdate() {
  if (carouselFrame) return
  carouselFrame = requestAnimationFrame(updateActiveCarouselCard)
}

function scrollCarouselToIndex(index: number) {
  const viewport = scroller.value
  const card = cards.value[index]
  if (!viewport || !card) return

  const viewportRect = viewport.getBoundingClientRect()
  const cardRect = card.getBoundingClientRect()
  const delta = cardRect.left + cardRect.width / 2 - (viewportRect.left + viewport.clientWidth / 2)
  viewport.scrollTo({
    left: viewport.scrollLeft + delta,
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
  })
}

function onWindowResize() {
  requestScrollUpdate()
  requestActiveCarouselUpdate()
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  window.addEventListener('resize', onWindowResize, { passive: true })
  scroller.value?.addEventListener('scroll', requestActiveCarouselUpdate, { passive: true })
  updateFromScroll()
  requestActiveCarouselUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestScrollUpdate)
  window.removeEventListener('resize', onWindowResize)
  scroller.value?.removeEventListener('scroll', requestActiveCarouselUpdate)
  if (scrollFrame) cancelAnimationFrame(scrollFrame)
  if (carouselFrame) cancelAnimationFrame(carouselFrame)
  stopAnimation()
})
</script>

<template>
  <section
    class="nm-showcase"
    :aria-label="labels.region"
    :style="{
      '--nm-showcase-before-color': labels.beforeColor ?? '#e5484d',
      '--nm-showcase-after-color': labels.afterColor ?? 'var(--vp-c-brand-1)',
    }"
  >
    <header class="nm-showcase__intro">
      <h2>{{ title }}</h2>
      <p v-if="footnote" class="nm-showcase__footnote">
        <span v-if="footnoteMarker" class="nm-showcase__footnote-marker">{{ footnoteMarker }}</span>
        {{ footnote }}
        <cite v-if="citation">— {{ citation }}</cite>
      </p>
    </header>

    <div class="nm-showcase__carousel">
      <div ref="scroller" class="nm-showcase__scroller" :aria-label="labels.stories">
        <article
          v-for="(story, index) in stories"
          :key="`${story.name}-${index}`"
          :ref="(element) => setCardRef(element, index)"
          class="nm-showcase__slide"
          :data-story-index="index"
          @pointerenter="animateStory(index)"
        >
          <div class="nm-showcase__card" :style="{ '--comparison-progress': `${progressFor(index)}%`, '--story-color': story.color }">
            <img
              class="nm-showcase__image nm-showcase__image--before"
              :src="story.beforeImage"
              :alt="fill(labels.altBefore, story.name)"
              loading="lazy"
              draggable="false"
            />
            <img
              class="nm-showcase__image nm-showcase__image--after"
              :src="story.afterImage"
              :alt="fill(labels.altAfter, story.name)"
              loading="lazy"
              draggable="false"
            />
            <span class="nm-showcase__scrim" />
            <div class="nm-showcase__timeline nm-showcase__timeline--overlay">
              <span class="nm-showcase__timeline-label" aria-hidden="true">{{ labels.timelineStart }}</span>
              <span class="nm-showcase__timeline-track">
                <span class="nm-showcase__timeline-rail">
                  <span class="nm-showcase__timeline-fill" />
                  <span class="nm-showcase__timeline-thumb" />
                </span>
                <input
                  class="nm-showcase__range"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  :value="progressFor(index)"
                  :aria-label="fill(labels.compare, story.name)"
                  :aria-valuetext="progressFor(index) < 50 ? labels.before : labels.after"
                  @input="onRangeInput(index, $event)"
                />
              </span>
              <span class="nm-showcase__timeline-label" aria-hidden="true">{{ labels.timelineEnd }}</span>
            </div>
          </div>
          <div v-if="index === (visibleCard ?? 0)" class="nm-showcase__copy">
            <span class="nm-showcase__name">{{ story.name }}</span>
            <span class="nm-showcase__description">{{ story.description }}</span>
            <div class="nm-showcase__mobile-captions">
              <div class="nm-showcase__mobile-caption">
                <span class="nm-showcase__mobile-caption-label">{{ labels.before }}</span>
                <p>{{ story.beforeText }}</p>
              </div>
              <div class="nm-showcase__mobile-caption">
                <span class="nm-showcase__mobile-caption-label">{{ labels.after }}</span>
                <p>{{ story.afterText }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div ref="stageTrack" class="nm-showcase__scrolltrack" :style="{ '--n': count }">
      <div class="nm-showcase__sticky">
        <div class="nm-showcase__stage" :style="{ '--story-color': stories[active]?.color ?? '#7c3aed' }">
          <figure class="nm-showcase__col">
            <div class="nm-showcase__frame">
              <img
                v-for="(story, index) in stories"
                :key="`before-${story.name}-${index}`"
                class="nm-showcase__layer"
                :class="{ 'is-active': index === active }"
                :src="story.beforeImage"
                :alt="fill(labels.altBefore, story.name)"
                loading="eager"
                decoding="async"
                draggable="false"
              />
            </div>
            <figcaption class="nm-showcase__label">{{ labels.before }}</figcaption>
            <div class="nm-showcase__captions">
              <p
                v-for="(story, index) in stories"
                :key="`before-text-${story.name}-${index}`"
                class="nm-showcase__caption"
                :class="{ 'is-active': index === active }"
              >{{ story.beforeText }}</p>
            </div>
          </figure>

          <nav
            class="nm-showcase__names"
            :aria-label="labels.companies"
            tabindex="0"
            @keydown="onNamesKeydown"
          >
            <Transition name="nm-showcase-title" mode="out-in">
              <div :key="stories[active]?.name" class="nm-showcase__story-heading">
                <span class="nm-showcase__name-title">
                  {{ nameParts(stories[active]?.name ?? '').first }}<template v-if="nameParts(stories[active]?.name ?? '').second"><br />{{ nameParts(stories[active]?.name ?? '').second }}</template>
                </span>
                <p class="nm-showcase__story-description">
                  <span
                    v-for="(sentence, sentenceIndex) in descriptionSentences(stories[active]?.description ?? '')"
                    :key="sentenceIndex"
                    class="nm-showcase__story-sentence"
                  >{{ sentence }}</span>
                </p>
              </div>
            </Transition>
          </nav>

          <figure class="nm-showcase__col">
            <div class="nm-showcase__frame">
              <img
                v-for="(story, index) in stories"
                :key="`after-${story.name}-${index}`"
                class="nm-showcase__layer"
                :class="{ 'is-active': index === active }"
                :src="story.afterImage"
                :alt="fill(labels.altAfter, story.name)"
                loading="eager"
                decoding="async"
                draggable="false"
              />
            </div>
            <figcaption class="nm-showcase__label">{{ labels.after }}</figcaption>
            <div class="nm-showcase__captions">
              <p
                v-for="(story, index) in stories"
                :key="`after-text-${story.name}-${index}`"
                class="nm-showcase__caption"
                :class="{ 'is-active': index === active }"
              >{{ story.afterText }}</p>
            </div>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nm-showcase {
  --scroll-per-item: 60svh;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 3rem calc(50% - 50vw) 4rem;
  padding: 2.25rem 0 0;
  overflow-x: clip;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
  line-height: 24px;
}

.nm-showcase__intro { display: contents; }

.nm-showcase__intro h2 {
  order: 1;
  margin: 0 auto 1.5rem;
  font-family: var(--vp-font-family-heading, var(--vp-font-family-base));
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 32px;
  text-align: center;
}

.nm-showcase__footnote {
  order: 2;
  width: min(85vw, 32rem);
  margin: 1.5rem auto 3rem;
  font-family: inherit;
  font-style: italic;
  line-height: 24px;
  text-align: left;
}

.nm-showcase__footnote-marker { font-style: normal; }
.nm-showcase__footnote cite { display: block; margin-top: 0.6rem;  text-align: right; }

.nm-showcase__carousel { order: 3; display: block; }

.nm-showcase__scroller {
  display: flex;
  gap: 1.25rem;
  padding-inline: 7.5vw;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.nm-showcase__scroller::-webkit-scrollbar { display: none; }

.nm-showcase__slide { flex: 0 0 min(85vw, 24rem); scroll-snap-align: center; scroll-snap-stop: always; }

.nm-showcase__card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 2px solid var(--story-color, #7c3aed);
  border-radius: 0.8rem;
  background: #242424;
  color: #fff;
  isolation: isolate;
}

.nm-showcase__image,
.nm-showcase__scrim {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.nm-showcase__image { object-fit: cover; user-select: none; -webkit-user-drag: none; }
.nm-showcase__image--after { clip-path: inset(0 calc(100% - var(--comparison-progress, 0%)) 0 0); }

.nm-showcase__scrim {
  background: linear-gradient(180deg, transparent 35%, rgb(0 0 0 / 0.18) 58%, rgb(0 0 0 / 0.78) 100%);
  pointer-events: none;
}

.nm-showcase__copy {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0.25rem 1.5rem;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}

.nm-showcase__name {  font-weight: 600; letter-spacing: -0.01em; line-height: 24px; }
.nm-showcase__description { max-width: 42rem; font-weight: 400; line-height: 1.4; }
.nm-showcase__mobile-captions { display: grid; gap: 0.85rem; }
.nm-showcase__mobile-caption-label { display: block; color: var(--nm-showcase-before-color); font-weight: 700; letter-spacing: 0.08em; line-height: 1.4; text-transform: uppercase; }
.nm-showcase__mobile-caption:nth-child(2) .nm-showcase__mobile-caption-label { color: var(--nm-showcase-after-color); }
.nm-showcase__mobile-caption p { margin: 0.2rem 0 0; line-height: 1.5; }
.nm-showcase__timeline--overlay { position: absolute; inset: auto 0 0; z-index: 2; padding: 0 1rem 0.5rem; }

.nm-showcase__timeline { display: flex; align-items: center; gap: 0.75rem; }
.nm-showcase__timeline-label { flex: none; color: rgb(255 255 255 / 0.9); font-size: 14px; font-weight: 500; line-height: 20px; }
.nm-showcase__timeline-track { position: relative; display: flex; flex: 1; height: 1.75rem; align-items: center; }
.nm-showcase__timeline-rail { position: relative; display: block; width: 100%; height: 2px; border-radius: 2px; background: rgb(255 255 255 / 0.38); }
.nm-showcase__timeline-fill { position: absolute; inset: 0 auto 0 0; width: var(--comparison-progress, 0%); border-radius: inherit; background: #fff; }

.nm-showcase__timeline-thumb {
  position: absolute;
  top: 50%;
  left: var(--comparison-progress, 0%);
  width: 0.8rem;
  height: 0.8rem;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 5px rgb(0 0 0 / 0.5);
}

.nm-showcase__range {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0.001;
  cursor: ew-resize;
  touch-action: pan-y;
}

.nm-showcase__timeline-track:focus-within .nm-showcase__timeline-thumb { outline: 3px solid #fff; outline-offset: 3px; }

.nm-showcase__scrolltrack { display: none; }

@media (min-width: 640px) {
  .nm-showcase__scroller { gap: 1.5rem; padding-inline: 8vw; }
  .nm-showcase__slide { flex-basis: min(60vw, 24rem); }
}

@media (min-width: 1024px) {
  .nm-showcase {
    --scroll-per-item: 60svh;
    margin: 4rem calc(50% - 50vw) 5rem;
  }

  .nm-showcase__intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: min(85vw, 1000px);
    margin: 0 auto 5.5rem;
  }

  .nm-showcase__intro h2 {
    order: 0;
    width: auto;
    max-width: 950px;
    margin: 0 auto;
    font-size: 24px;
    line-height: 32px;
  }

  .nm-showcase__footnote { order: 0; width: auto; max-width: 420px; margin: 1.5rem auto 0; font-size: 16px; }

  .nm-showcase__carousel { display: none; }

  .nm-showcase__scrolltrack {
    display: block;
    height: calc(100svh + (var(--n) - 1) * var(--scroll-per-item));
  }

  .nm-showcase__sticky {
    position: sticky;
    top: 0;
    height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nm-showcase__stage {
    --item-h: clamp(3.5rem, 5.5vw, 5rem);
    display: grid;
    width: min(94vw, 1180px, calc(2.8 * (100svh - 9rem) + 5rem));
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 1fr);
    align-items: center;
    gap: 2.5rem;
  }

  .nm-showcase__col { display: flex; min-width: 0; flex-direction: column; gap: 1rem; margin: 0; }

  .nm-showcase__col .nm-showcase__frame { order: 2; }
  .nm-showcase__col .nm-showcase__label { order: 1; }
  .nm-showcase__col .nm-showcase__captions { order: 3; }

  .nm-showcase__label {
    font-family: inherit;
    font-size: 16px;
    font-weight: 500;
    font-style: italic;
    line-height: 24px;
    text-align: center;
    text-transform: uppercase;
  }

  .nm-showcase__col:first-child .nm-showcase__label { color: var(--nm-showcase-before-color); }
  .nm-showcase__col:last-child .nm-showcase__label { color: var(--nm-showcase-after-color); }

  .nm-showcase__frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 3px solid var(--story-color, #7c3aed);
    border-radius: 1rem;
    background: #242424;
    box-shadow: 0 10px 40px rgb(22 20 15 / 0.14);
  }

  .nm-showcase__layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 650ms cubic-bezier(0.22, 1, 0.36, 1);
    user-select: none;
  }

.nm-showcase__layer.is-active { opacity: 1; }

  .nm-showcase__captions {
    display: grid;
    font-family: inherit;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }

  .nm-showcase__caption { grid-area: 1 / 1; margin: 0; opacity: 0; transition: opacity 300ms ease; }
  .nm-showcase__caption.is-active { opacity: 1; }

  .nm-showcase__names {
    position: relative;
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: var(--item-h);
    align-items: center;
    justify-content: center;
    text-align: center;
    outline: none;
  }

  .nm-showcase__story-heading { width: 100%; margin-inline: auto; text-align: center; }

  .nm-showcase__names:focus-visible { outline: 2px solid #2364e8; outline-offset: 4px; border-radius: 0.5rem; }

  .nm-showcase__name-title {
    display: block;
    width: 100%;
    max-width: 100%;
    color: inherit;
    font-family: var(--vp-font-family-heading, var(--vp-font-family-base));
    font-size: clamp(1.25rem, 2.2vw, 1.75rem);
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.05;
    overflow-wrap: break-word;
    text-align: center;
    white-space: normal;
  }

  .nm-showcase__story-description {
    max-width: 34rem;
    margin: 1rem auto 0;
    color: var(--vp-c-text-2);
    font-size: var(--vp-font-size-base, 14px);
    line-height: 1.5;
    text-align: center;
    overflow-wrap: anywhere;
  }

  .nm-showcase__story-sentence { display: block; }
  .nm-showcase__story-sentence + .nm-showcase__story-sentence { margin-top: 0.4em; }

  .nm-showcase-title-enter-active,
  .nm-showcase-title-leave-active { transition: opacity 360ms ease-in-out, transform 360ms ease-in-out; }
  .nm-showcase-title-enter-from { opacity: 0; transform: translateY(0.35em); }
  .nm-showcase-title-leave-to { opacity: 0; transform: translateY(-0.35em); }
}

@media (prefers-reduced-motion: reduce) {
  .nm-showcase__layer,
  .nm-showcase__caption { transition: none; }
}
</style>
