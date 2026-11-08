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
  variant?: 'carousel' | 'stacked'
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

function smoothstep(value: number) {
  const progress = clamp(value, 0, 1)
  return progress * progress * (3 - 2 * progress)
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

function stackCardMetrics(index: number) {
  const readingLead = 0.28
  const transitionSpan = 1 - readingLead
  const arrivalProgress = index === 0
    ? 1
    : clamp((pos.value - index + 1 - readingLead) / transitionSpan, 0, 1)
  const arrival = smoothstep(arrivalProgress)
  const scaleProgress = smoothstep(clamp((pos.value - index - readingLead) / transitionSpan, 0, 1))
  const targetScale = 0.85 + index * 0.03
  const scale = 1 - scaleProgress * (1 - targetScale)

  return { arrival, scale }
}

function stackCardStyle(index: number) {
  const { arrival, scale } = stackCardMetrics(index)
  const rotation = (1 - arrival) * -1.25

  return {
    zIndex: index,
    opacity: 1,
    pointerEvents: index === active.value ? 'auto' : 'none',
    '--silk-counter-scale': String(1 / scale),
    transform: `perspective(1400px) translate3d(0, calc(${index * 36}px + ${(1 - arrival) * 60}svh), 0) scale(${scale}) rotateX(${rotation}deg)`,
  }
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
    class="feluqa-showcase"
    :class="{ 'feluqa-showcase--stacked': variant === 'stacked' }"
    :aria-label="labels.region"
    :style="{
      '--feluqa-showcase-before-color': labels.beforeColor ?? '#e5484d',
      '--feluqa-showcase-after-color': labels.afterColor ?? 'var(--feluqa-brand)',
    }"
  >
    <header class="feluqa-showcase__intro">
      <h2 v-html="title" />
      <p v-if="footnote" class="feluqa-showcase__footnote">
        <span v-if="footnoteMarker" class="feluqa-showcase__footnote-marker">{{ footnoteMarker }}</span>
        <span v-html="footnote" />
        <cite v-if="citation">— {{ citation }}</cite>
      </p>
    </header>

    <div class="feluqa-showcase__carousel">
      <div ref="scroller" class="feluqa-showcase__scroller" :aria-label="labels.stories">
        <article
          v-for="(story, index) in stories"
          :key="`${story.name}-${index}`"
          :ref="(element) => setCardRef(element, index)"
          class="feluqa-showcase__slide"
          :data-story-index="index"
          @pointerenter="animateStory(index)"
        >
          <div class="feluqa-showcase__card" :style="{ '--comparison-progress': `${progressFor(index)}%`, '--story-color': story.color }">
            <img
              class="feluqa-showcase__image feluqa-showcase__image--before"
              :src="story.beforeImage"
              :alt="fill(labels.altBefore, story.name)"
              loading="lazy"
              draggable="false"
            />
            <img
              class="feluqa-showcase__image feluqa-showcase__image--after"
              :src="story.afterImage"
              :alt="fill(labels.altAfter, story.name)"
              loading="lazy"
              draggable="false"
            />
            <span class="feluqa-showcase__scrim" />
            <div class="feluqa-showcase__timeline feluqa-showcase__timeline--overlay">
              <span class="feluqa-showcase__timeline-label" aria-hidden="true">{{ labels.timelineStart }}</span>
              <span class="feluqa-showcase__timeline-track">
                <span class="feluqa-showcase__timeline-rail">
                  <span class="feluqa-showcase__timeline-fill" />
                  <span class="feluqa-showcase__timeline-thumb" />
                </span>
                <input
                  class="feluqa-showcase__range"
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
              <span class="feluqa-showcase__timeline-label" aria-hidden="true">{{ labels.timelineEnd }}</span>
            </div>
          </div>
          <div v-if="index === (visibleCard ?? 0)" class="feluqa-showcase__copy">
            <span class="feluqa-showcase__name">{{ story.name }}</span>
            <span class="feluqa-showcase__description" v-html="story.description" />
            <div class="feluqa-showcase__mobile-captions">
              <div class="feluqa-showcase__mobile-caption">
                <span class="feluqa-showcase__mobile-caption-label">{{ labels.before }}</span>
                <p v-html="story.beforeText" />
              </div>
              <div class="feluqa-showcase__mobile-caption">
                <span class="feluqa-showcase__mobile-caption-label">{{ labels.after }}</span>
                <p v-html="story.afterText" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="variant !== 'stacked'" ref="stageTrack" class="feluqa-showcase__scrolltrack" :style="{ '--n': count }">
      <div class="feluqa-showcase__sticky">
        <div class="feluqa-showcase__stage" :style="{ '--story-color': stories[active]?.color ?? '#7c3aed' }">
          <figure class="feluqa-showcase__col">
            <div class="feluqa-showcase__frame">
              <img
                v-for="(story, index) in stories"
                :key="`before-${story.name}-${index}`"
                class="feluqa-showcase__layer"
                :class="{ 'is-active': index === active }"
                :src="story.beforeImage"
                :alt="fill(labels.altBefore, story.name)"
                loading="eager"
                decoding="async"
                draggable="false"
              />
            </div>
            <figcaption class="feluqa-showcase__label">{{ labels.before }}</figcaption>
            <div class="feluqa-showcase__captions">
              <p
                v-for="(story, index) in stories"
                :key="`before-text-${story.name}-${index}`"
                class="feluqa-showcase__caption"
                :class="{ 'is-active': index === active }"
              v-html="story.beforeText" />
            </div>
          </figure>

          <nav
            class="feluqa-showcase__names"
            :aria-label="labels.companies"
            tabindex="0"
            @keydown="onNamesKeydown"
          >
            <Transition name="feluqa-showcase-title" mode="out-in">
              <div :key="stories[active]?.name" class="feluqa-showcase__story-heading">
                <span class="feluqa-showcase__name-title">
                  {{ nameParts(stories[active]?.name ?? '').first }}<template v-if="nameParts(stories[active]?.name ?? '').second"><br />{{ nameParts(stories[active]?.name ?? '').second }}</template>
                </span>
                <p class="feluqa-showcase__story-description">
                  <span
                    v-for="(sentence, sentenceIndex) in descriptionSentences(stories[active]?.description ?? '')"
                    :key="sentenceIndex"
                    class="feluqa-showcase__story-sentence"
                  v-html="sentence" />
                </p>
              </div>
            </Transition>
          </nav>

          <figure class="feluqa-showcase__col">
            <div class="feluqa-showcase__frame">
              <img
                v-for="(story, index) in stories"
                :key="`after-${story.name}-${index}`"
                class="feluqa-showcase__layer"
                :class="{ 'is-active': index === active }"
                :src="story.afterImage"
                :alt="fill(labels.altAfter, story.name)"
                loading="eager"
                decoding="async"
                draggable="false"
              />
            </div>
            <figcaption class="feluqa-showcase__label">{{ labels.after }}</figcaption>
            <div class="feluqa-showcase__captions">
              <p
                v-for="(story, index) in stories"
                :key="`after-text-${story.name}-${index}`"
                class="feluqa-showcase__caption"
                :class="{ 'is-active': index === active }"
              v-html="story.afterText" />
            </div>
          </figure>
        </div>
      </div>
    </div>

    <div v-else ref="stageTrack" class="feluqa-showcase__stack-track" :style="{ '--n': count }">
      <div class="feluqa-showcase__stack-sticky">
        <div class="feluqa-showcase__stack-deck">
          <article
            v-for="(story, index) in stories"
            :key="`stack-${story.name}-${index}`"
            class="feluqa-showcase__stack-card"
            :class="{ 'is-active': index === active, 'is-past': index < active }"
            :aria-hidden="index !== active"
            :style="stackCardStyle(index)"
          >
            <figure class="feluqa-showcase__stack-side">
              <img :src="story.beforeImage" :alt="fill(labels.altBefore, story.name)" loading="lazy" draggable="false" />
              <figcaption><span>01</span>{{ labels.before }}</figcaption>
              <p v-html="story.beforeText" />
            </figure>
            <div class="feluqa-showcase__stack-copy">
              <span class="feluqa-showcase__stack-count">{{ String(index + 1).padStart(2, '0') }} <span>/ {{ String(count).padStart(2, '0') }}</span></span>
              <span class="feluqa-showcase__name-title">{{ story.name }}</span>
              <p class="feluqa-showcase__stack-description">
                <span
                  v-for="(sentence, sentenceIndex) in descriptionSentences(story.description)"
                  :key="sentenceIndex"
                  class="feluqa-showcase__story-sentence"
                  v-html="sentence" />
              </p>
            </div>
            <figure class="feluqa-showcase__stack-side">
              <img :src="story.afterImage" :alt="fill(labels.altAfter, story.name)" loading="lazy" draggable="false" />
              <figcaption><span>02</span>{{ labels.after }}</figcaption>
              <p v-html="story.afterText" />
            </figure>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feluqa-showcase {
  --scroll-per-item: 60svh;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 3rem calc(50% - 50vw) 4rem;
  padding: 2.25rem 0 0;
  overflow-x: clip;
  background: var(--feluqa-surface);
  color: var(--feluqa-text-primary);
  font-family: var(--feluqa-font-base);
  line-height: 24px;
}

.feluqa-showcase__intro { display: contents; }

.feluqa-showcase__intro h2 {
  order: 1;
  margin: 0 auto 1.5rem;
  font-family: var(--feluqa-font-heading, var(--feluqa-font-base));
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 32px;
  text-align: center;
}

.feluqa-showcase__footnote {
  order: 2;
  width: min(85vw, 32rem);
  margin: 1.5rem auto 3rem;
  font-family: inherit;
  font-style: italic;
  line-height: 24px;
  text-align: left;
}

.feluqa-showcase__footnote-marker { font-style: normal; }
.feluqa-showcase__footnote cite { display: block; margin-top: 0.6rem;  text-align: right; }

.feluqa-showcase__carousel { order: 3; display: block; }

.feluqa-showcase__scroller {
  display: flex;
  gap: 1.25rem;
  padding-inline: max(7.5vw, calc((100vw - min(85vw, 24rem)) / 2));
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.feluqa-showcase__scroller::-webkit-scrollbar { display: none; }

.feluqa-showcase__slide { flex: 0 0 min(85vw, 24rem); scroll-snap-align: center; scroll-snap-stop: always; }

.feluqa-showcase__card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 2px solid var(--story-color, #7c3aed);
  border-radius: var(--radius-md);
  background: #242424;
  color: #fff;
  isolation: isolate;
}

.feluqa-showcase__image,
.feluqa-showcase__scrim {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.feluqa-showcase__image { object-fit: cover; user-select: none; -webkit-user-drag: none; }
.feluqa-showcase__image--after { clip-path: inset(0 calc(100% - var(--comparison-progress, 0%)) 0 0); }

.feluqa-showcase__scrim {
  background: linear-gradient(180deg, transparent 35%, rgb(0 0 0 / 0.18) 58%, rgb(0 0 0 / 0.78) 100%);
  pointer-events: none;
}

.feluqa-showcase__copy {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0.25rem 1.5rem;
  font-family: var(--feluqa-font-base);
  color: var(--feluqa-text-primary);
}

.feluqa-showcase__name {  font-weight: 600; letter-spacing: -0.01em; line-height: 24px; }
.feluqa-showcase__description { max-width: 42rem; font-weight: 400; line-height: 1.4; }
.feluqa-showcase__mobile-captions { display: grid; gap: 0.85rem; }
.feluqa-showcase__mobile-caption-label { display: block; color: var(--feluqa-showcase-before-color); font-weight: 700; letter-spacing: 0.08em; line-height: 1.4; text-transform: uppercase; }
.feluqa-showcase__mobile-caption:nth-child(2) .feluqa-showcase__mobile-caption-label { color: var(--feluqa-showcase-after-color); }
.feluqa-showcase__mobile-caption p { margin: 0.2rem 0 0; line-height: 1.5; }
.feluqa-showcase__timeline--overlay { position: absolute; inset: auto 0 0; z-index: 2; padding: 0 1rem 0.5rem; }

.feluqa-showcase__timeline { display: flex; align-items: center; gap: 0.75rem; }
.feluqa-showcase__timeline-label { flex: none; color: rgb(255 255 255 / 0.9); font-size: 14px; font-weight: 500; line-height: 20px; }
.feluqa-showcase__timeline-track { position: relative; display: flex; flex: 1; height: 1.75rem; align-items: center; }
.feluqa-showcase__timeline-rail { position: relative; display: block; width: 100%; height: 2px; border-radius: var(--radius-md); background: rgb(255 255 255 / 0.38); }
.feluqa-showcase__timeline-fill { position: absolute; inset: 0 auto 0 0; width: var(--comparison-progress, 0%); border-radius: inherit; background: #fff; }

.feluqa-showcase__timeline-thumb {
  position: absolute;
  top: 50%;
  left: var(--comparison-progress, 0%);
  width: 0.8rem;
  height: 0.8rem;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--feluqa-surface);
  box-shadow: 0 1px 5px rgb(0 0 0 / 0.5);
}

.feluqa-showcase__range {
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

.feluqa-showcase__timeline-track:focus-within .feluqa-showcase__timeline-thumb { outline: 3px solid #fff; outline-offset: 3px; }

.feluqa-showcase__scrolltrack { display: none; }
.feluqa-showcase__scrolltrack,
.feluqa-showcase__stack-track { order: 4; }
.feluqa-showcase__stack-track { display: none; }

@media (min-width: 640px) {
  .feluqa-showcase__scroller {
    gap: 1.5rem;
    padding-inline: max(8vw, calc((100vw - min(60vw, 24rem)) / 2));
  }
  .feluqa-showcase__slide { flex-basis: min(60vw, 24rem); }
}

@media (min-width: 1024px) {
  .feluqa-showcase {
    --scroll-per-item: 60svh;
    margin: 4rem calc(50% - 50vw) 5rem;
  }

  .feluqa-showcase--stacked { --scroll-per-item: 100svh; }

  .feluqa-showcase__intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: min(85vw, 1000px);
    margin: 0 auto 5.5rem;
  }

  .feluqa-showcase__intro h2 {
    order: 0;
    width: auto;
    max-width: 950px;
    margin: 0 auto;
    font-size: 24px;
    line-height: 32px;
  }

  .feluqa-showcase__footnote { order: 0; width: auto; max-width: 420px; margin: 1.5rem auto 0; font-size: 16px; }

  .feluqa-showcase__carousel { display: none; }

  .feluqa-showcase__stack-track {
    display: block;
    height: calc(100svh + (var(--n) - 1) * var(--scroll-per-item));
  }
  .feluqa-showcase__stack-sticky {
    position: sticky;
    top: 0;
    display: grid;
    height: 100svh;
    place-items: start center;
    padding-top: 16svh;
    box-sizing: border-box;
    overflow: hidden;
    isolation: isolate;
  }
  .feluqa-showcase__stack-deck {
    position: relative;
    z-index: 1;
    width: min(96vw, 1440px);
    height: min(60svh, 560px);
    border-radius: var(--radius-md);
  }
  .feluqa-showcase__stack-card::before {
    position: absolute;
    z-index: 0;
    inset: 0;
    border-radius: inherit;
    background: #141d2a url('/images/home/showcase-silk.webp') center / 100% 100% no-repeat;
    content: '';
    pointer-events: none;
    transform: scale(var(--silk-counter-scale, 1));
    transform-origin: top center;
  }
  .feluqa-showcase__stack-card {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.75fr) minmax(0, 1fr);
    align-items: center;
    gap: clamp(1.25rem, 3vw, 2.75rem);
    padding: clamp(1.25rem, 3vw, 2.5rem);
    border: 1px solid rgb(210 222 237 / 0.18);
    border-radius: var(--radius-md);
    color: #f3f6fa;
    overflow: hidden;
    background: #141d2a;
    box-shadow: 0 30px 90px rgb(0 0 0 / 0.42), inset 0 1px rgb(255 255 255 / 0.055);
    pointer-events: none;
    transform-origin: top center;
  }
  .feluqa-showcase__stack-card.is-active { border-color: rgb(210 222 237 / 0.26); pointer-events: auto; }
  .feluqa-showcase__stack-side,
  .feluqa-showcase__stack-copy { position: relative; z-index: 1; }
  .feluqa-showcase__stack-side { min-width: 0; margin: 0; }
  .feluqa-showcase__stack-side img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: var(--radius-md); }
  .feluqa-showcase__stack-side figcaption { display: flex; align-items: center; gap: 0.55rem; margin-top: 1rem; color: #b7c5d5; font-size: 0.76rem; font-weight: 650; letter-spacing: 0.12em; text-transform: uppercase; }
  .feluqa-showcase__stack-side figcaption span { color: #77889d; font-variant-numeric: tabular-nums; }
  .feluqa-showcase__stack-side:last-child figcaption { color: #a9c4df; }
  .feluqa-showcase__stack-side p { margin: 0.55rem 0 0; color: #d0d8e2; font-size: 0.94rem; line-height: 1.55; }
  .feluqa-showcase__stack-copy { text-align: center; }
  .feluqa-showcase__stack-count { display: block; margin-bottom: 1rem; color: #adc4dd; font-size: 0.78rem; font-variant-numeric: tabular-nums; font-weight: 650; letter-spacing: 0.14em; }
  .feluqa-showcase__stack-count span { color: #7f8da0; font-weight: 500; }
  .feluqa-showcase__stack-copy .feluqa-showcase__name-title { font-size: clamp(1.25rem, 2vw, 1.75rem); }
  .feluqa-showcase__stack-copy p { margin: 1rem 0 0; color: #b9c4d1; line-height: 1.6; }

  .feluqa-showcase__scrolltrack {
    display: block;
    height: calc(100svh + (var(--n) - 1) * var(--scroll-per-item));
  }

  .feluqa-showcase__sticky {
    position: sticky;
    top: 0;
    height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feluqa-showcase__stage {
    --item-h: clamp(3.5rem, 5.5vw, 5rem);
    display: grid;
    width: min(94vw, 1180px, calc(2.8 * (100svh - 9rem) + 5rem));
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 1fr);
    align-items: center;
    gap: 2.5rem;
  }

  .feluqa-showcase__col { display: flex; min-width: 0; flex-direction: column; gap: 1rem; margin: 0; }

  .feluqa-showcase__col .feluqa-showcase__frame { order: 2; }
  .feluqa-showcase__col .feluqa-showcase__label { order: 1; }
  .feluqa-showcase__col .feluqa-showcase__captions { order: 3; }

  .feluqa-showcase__label {
    font-family: inherit;
    font-size: 16px;
    font-weight: 500;
    font-style: italic;
    line-height: 24px;
    text-align: center;
    text-transform: uppercase;
  }

  .feluqa-showcase__col:first-child .feluqa-showcase__label { color: var(--feluqa-showcase-before-color); }
  .feluqa-showcase__col:last-child .feluqa-showcase__label { color: var(--feluqa-showcase-after-color); }

  .feluqa-showcase__frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 3px solid var(--story-color, #7c3aed);
    border-radius: var(--radius-md);
    background: #242424;
    box-shadow: 0 10px 40px rgb(22 20 15 / 0.14);
  }

  .feluqa-showcase__layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 650ms cubic-bezier(0.22, 1, 0.36, 1);
    user-select: none;
  }

.feluqa-showcase__layer.is-active { opacity: 1; }

  .feluqa-showcase__captions {
    display: grid;
    font-family: inherit;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }

  .feluqa-showcase__caption { grid-area: 1 / 1; margin: 0; opacity: 0; transition: opacity 300ms ease; }
  .feluqa-showcase__caption.is-active { opacity: 1; }

  .feluqa-showcase__names {
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

  .feluqa-showcase__story-heading { width: 100%; margin-inline: auto; text-align: center; }

  .feluqa-showcase__names:focus-visible { outline: 2px solid #2364e8; outline-offset: 4px; border-radius: var(--radius-md); }

  .feluqa-showcase__name-title {
    display: block;
    width: 100%;
    max-width: 100%;
    color: inherit;
    font-family: var(--feluqa-font-heading, var(--feluqa-font-base));
    font-size: clamp(1.25rem, 2.2vw, 1.75rem);
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.05;
    overflow-wrap: break-word;
    text-align: center;
    white-space: normal;
  }

  .feluqa-showcase__story-description {
    max-width: 34rem;
    margin: 1rem auto 0;
    color: var(--feluqa-text-secondary);
    font-size: var(--feluqa-font-size, 14px);
    line-height: 1.5;
    text-align: center;
    overflow-wrap: anywhere;
  }

  .feluqa-showcase__story-sentence { display: block; }
  .feluqa-showcase__story-sentence + .feluqa-showcase__story-sentence { margin-top: 0.4em; }

  .feluqa-showcase-title-enter-active,
  .feluqa-showcase-title-leave-active { transition: opacity 360ms ease-in-out, transform 360ms ease-in-out; }
  .feluqa-showcase-title-enter-from { opacity: 0; transform: translateY(0.35em); }
  .feluqa-showcase-title-leave-to { opacity: 0; transform: translateY(-0.35em); }
}

@media (prefers-reduced-motion: reduce) {
  .feluqa-showcase__layer,
  .feluqa-showcase__caption,
  .feluqa-showcase__stack-card { transition: none; }
}
</style>
