<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * Props forwarded to <Button>.
 * `tag` defaults to "a" so a link only needs `href` and `label`.
 */
type ProfileLink = {
  label: string
  href: string
  icon?: string
  tag?: string
  external?: boolean
  iconOnly?: boolean
}

type ProfileLogo = {
  src: string
  alt: string
  href?: string
}

type ProfileName = {
  label: string
  type?: 'geometric' | 'normal'
}

type ResponsiveWidth = {
  mobile?: string
  tablet?: string
  desktop?: string
}

const props = withDefaults(defineProps<{
  name: ProfileName
  role?: string
  image?: string
  hoverImage?: string
  imageAlt?: string
  widthOnParent?: ResponsiveWidth
  links?: ProfileLink[]
  logos?: ProfileLogo[]
}>(), {
  role: '',
  image: '',
  hoverImage: '',
  imageAlt: '',
  widthOnParent: () => ({ mobile: '100%', tablet: '100%', desktop: '100%' }),
  links: () => [],
  logos: () => [],
})

const slots = useSlots()

const initials = computed(() =>
  props.name.label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase(),
)

const label = computed(() => [props.name.label, props.role].filter(Boolean).join(', '))
const hasActions = computed(() => props.links.length > 0 || Boolean(slots.default))
</script>

<template>
  <article
    class="xd7n744kb"
    :aria-label="label"
    :style="{
      '--xvcj8tjf0-width-mobile': widthOnParent.mobile ?? '100%',
      '--xvcj8tjf0-width-tablet': widthOnParent.tablet ?? widthOnParent.mobile ?? '100%',
      '--xvcj8tjf0-width-desktop': widthOnParent.desktop ?? widthOnParent.tablet ?? widthOnParent.mobile ?? '100%',
    }"
  >
    <div class="xd7n744kb__card">
      <figure class="xd7n744kb__portrait">
        <div class="xd7n744kb__photo">
          <img
            v-if="image"
            class="xd7n744kb__image"
            :src="image"
            :alt="imageAlt || name.label"
            loading="lazy"
            decoding="async"
          />
          <img
            v-if="image && hoverImage"
            class="xd7n744kb__image xd7n744kb__image--hover"
            :src="hoverImage"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span v-if="!image" class="xd7n744kb__initials" aria-hidden="true">{{ initials }}</span>
        </div>
      </figure>

      <div class="xd7n744kb__identity">
        <div v-if="name.type !== 'normal'" class="xd7n744kb__nameplate">
          <p class="xd7n744kb__name">{{ name.label }}</p>
        </div>
        <h4 v-else class="xd7n744kb__name-normal">{{ name.label }}</h4>
        <p v-if="role" class="" style="margin-top:0!important;">{{ role }}</p>
      </div>

      <div v-if="hasActions" class="xd7n744kb__actions">
        <Button
          v-for="link in links"
          :key="link.href"
          :tag="link.tag ?? 'a'"
          :href="link.href"
          :label="link.label"
          :icon="link.icon"
          :aria-label="link.iconOnly ? link.label : undefined"
          :class="{ 'xd7n744kb__action--icon-only': link.iconOnly }"
          v-bind="link.iconOnly ? { 'x-tooltip.top': link.label } : {}"
          :target="link.external === false ? undefined : '_blank'"
          :rel="link.external === false ? undefined : 'noopener noreferrer'"
        />
        <slot />
      </div>

      <ul v-if="logos.length" class="xd7n744kb__logos" aria-label="Products">
        <li v-for="logo in logos" :key="logo.src">
          <a
            v-if="logo.href"
            :href="logo.href"
            :aria-label="logo.alt"
            v-bind="{ 'x-tooltip.top': logo.alt }"
          >
            <img :src="logo.src" :alt="logo.alt" loading="lazy" decoding="async" />
          </a>
          <img
            v-else
            :src="logo.src"
            :alt="logo.alt"
            v-bind="{ 'x-tooltip.top': logo.alt }"
            loading="lazy"
            decoding="async"
          />
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.xd7n744kb,
.xd7n744kb *,
.xd7n744kb *::before,
.xd7n744kb *::after {
  box-sizing: border-box;
}

/*
 * The badge sizes itself from the width of its own box (container queries),
 * not from the viewport, so it behaves the same in a narrow column,
 * a tablet layout or a wide content area.
 */
.xd7n744kb {
  container-type: inline-size;
  width: var(--xvcj8tjf0-width-mobile, 100%);
  max-width: 42rem;
  margin-block: var(--space-3, 24px);
  color: var(--text-primary);
  font-family: var(--sans, Arial, Helvetica, sans-serif);
}

@media (min-width: 641px) {
  .xd7n744kb {
    width: var(--xvcj8tjf0-width-tablet, 100%);
  }
}

@media (min-width: 1024px) {
  .xd7n744kb {
    width: var(--xvcj8tjf0-width-desktop, 100%);
  }
}

.xd7n744kb__card {
  /* Geometry, all derived from the container width. */
  --xvcj8tjf0-skew: clamp(6px, 2.4cqi, 20px);
  --xvcj8tjf0-stripe: clamp(4px, 1.2cqi, 7px);
  --xvcj8tjf0-gap: clamp(0.625rem, 3cqi, 1.5rem);
  --xvcj8tjf0-photo: clamp(6.5rem, 34cqi, 8.5rem);

  /* The panel stays "ink" in both themes, so everything inside is resolved in dark mode. */
  --xvcj8tjf0-ink: light-dark(#252a32, #1b222b);

  position: relative;
  display: grid;
  grid-template-areas:
    'portrait'
    'identity'
    'actions'
    'logos';
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  gap: var(--xvcj8tjf0-gap);
  padding:
    calc(var(--xvcj8tjf0-skew) + var(--xvcj8tjf0-gap))
    var(--xvcj8tjf0-gap)
    calc(var(--xvcj8tjf0-skew) + var(--xvcj8tjf0-stripe) + var(--xvcj8tjf0-gap));
  background: var(--surface);
  /* Sheared parallelogram: the "not a regular geometry" signature. */
  clip-path: polygon(0 var(--xvcj8tjf0-skew), 100% 0, 100% calc(100% - var(--xvcj8tjf0-skew)), 0 100%);
  text-align: center;
}

/* Brand stripe running parallel to the slanted bottom edge. */
.xd7n744kb__card::after {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: calc(var(--xvcj8tjf0-skew) + var(--xvcj8tjf0-stripe));
  background: var(--brand);
  clip-path: polygon(0 calc(100% - var(--xvcj8tjf0-stripe)), 100% 0, 100% var(--xvcj8tjf0-stripe), 0 100%);
  content: '';
  pointer-events: none;
}

/* Dark scheme for all content: --foreground, --muted, buttons etc. flip automatically. */
.xd7n744kb__portrait,
.xd7n744kb__identity,
.xd7n744kb__actions,
.xd7n744kb__logos {
  color-scheme: dark;
}

/* ---------- Portrait ---------- */

.xd7n744kb__portrait {
  grid-area: portrait;
  width: var(--xvcj8tjf0-photo);
  margin: 0;
  padding: 5px;
  background: var(--foreground);
  border-radius: 2px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.35);
  transform: rotate(-2deg);
  transition: transform var(--duration-normal, 300ms) var(--ease-out, ease-out);
}

.xd7n744kb__photo {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--surface-soft, var(--surface-soft));
}

.xd7n744kb__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}

.xd7n744kb__image--hover {
  opacity: 0;
  transition: opacity var(--duration-normal, 300ms) ease;
}

.xd7n744kb__initials {
  color: var(--brand);
  font-family: var(--display, var(--sans, Arial, Helvetica, sans-serif));
  font-size: calc(var(--xvcj8tjf0-photo) * 0.38);
  font-weight: 800;
  letter-spacing: -0.06em;
}

@media (hover: hover) {
  .xd7n744kb:hover .xd7n744kb__portrait {
    transform: rotate(0deg);
  }

  .xd7n744kb:hover .xd7n744kb__image--hover {
    opacity: 1;
  }
}

/* ---------- Identity ---------- */

.xd7n744kb__identity {
  grid-area: identity;
  display: grid;
  justify-items: inherit;
  gap: 0.6rem;
  min-width: 0;
  max-width: 100%;
}

.xd7n744kb__nameplate {
  --xvcj8tjf0-chamfer: clamp(8px, 2.4cqi, 14px);

  max-width: 100%;
  padding: 3px;
  background: var(--brand);
  clip-path: polygon(
    var(--xvcj8tjf0-chamfer) 0, calc(100% - var(--xvcj8tjf0-chamfer)) 0,
    100% var(--xvcj8tjf0-chamfer), 100% calc(100% - var(--xvcj8tjf0-chamfer)),
    calc(100% - var(--xvcj8tjf0-chamfer)) 100%, var(--xvcj8tjf0-chamfer) 100%,
    0 calc(100% - var(--xvcj8tjf0-chamfer)), 0 var(--xvcj8tjf0-chamfer)
  );
  transform: rotate(-1deg);
}

.xd7n744kb__name {
  --xvcj8tjf0-inner: calc(var(--xvcj8tjf0-chamfer) - 2px);

  margin: 0;
  padding: 0.5rem clamp(0.9rem, 4cqi, 1.5rem);
  background: var(--foreground);
  clip-path: polygon(
    var(--xvcj8tjf0-inner) 0, calc(100% - var(--xvcj8tjf0-inner)) 0,
    100% var(--xvcj8tjf0-inner), 100% calc(100% - var(--xvcj8tjf0-inner)),
    calc(100% - var(--xvcj8tjf0-inner)) 100%, var(--xvcj8tjf0-inner) 100%,
    0 calc(100% - var(--xvcj8tjf0-inner)), 0 var(--xvcj8tjf0-inner)
  );
  color: var(--brand-tertiary);
  font-family: var(--display, var(--sans, Arial, Helvetica, sans-serif));
  font-size: clamp(1.1rem, 5.2cqi, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.xd7n744kb__name-normal {
  margin: 0;
}

.xd7n744kb__actions :deep(.xd7n744kb__action--icon-only) {
  width: 2.5rem;
  min-width: 2.5rem;
  padding-inline: 0;
}

.xd7n744kb__actions :deep(.xd7n744kb__action--icon-only .button-content) {
  display: none;
}

.xd7n744kb__role {
  margin: 0;
  color: var(--muted);
  font-family: var(--mono, ui-monospace, monospace);
  font-size: clamp(0.8rem, 3cqi, 1rem);
  line-height: 1.4;
  text-wrap: balance;
}

/* ---------- Actions (Button) ---------- */

.xd7n744kb__actions {
  grid-area: actions;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-width: 0;
  max-width: 100%;
}

/* ---------- LogoCloud ---------- */

.xd7n744kb__logos {
  grid-area: logos;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem clamp(1rem, 5cqi, 2rem);
  width: 100%;
  margin: 0;
  border-top: 1px solid color-mix(in srgb, var(--foreground) 16%, transparent);
  list-style: none;
}

.xd7n744kb__logos li {
  display: flex;
  margin: 0;
  padding: 0;
}

.xd7n744kb__logos a {
  display: inline-flex;
  border-radius: var(--radius-sm, 4px);
}

.xd7n744kb__logos a:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}

.xd7n744kb__logos img {
  display: block;
  width: auto;
  max-width: 100%;
  height: clamp(1.75rem, 7cqi, 2.5rem);
  margin: 0;
  object-fit: contain;
}

/* ---------- Wide container: portrait beside the identity ---------- */

@container (min-width: 32rem) {
  .xd7n744kb__card {
    --xvcj8tjf0-photo: clamp(7.5rem, 24cqi, 10rem);

    grid-template-areas:
      'portrait identity'
      'portrait actions'
      'logos    logos';
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    align-items: center;
    justify-items: start;
    text-align: start;
    column-gap: calc(var(--xvcj8tjf0-gap) * 1.25);
  }

  .xd7n744kb__portrait {
    align-self: center;
  }

  .xd7n744kb__identity {
    align-self: end;
  }

  .xd7n744kb__actions {
    align-self: start;
    justify-content: flex-start;
  }

  .xd7n744kb__logos {
    justify-content: flex-start;
  }
}

/* ---------- Very narrow container: buttons stack full width ---------- */

@container (max-width: 20rem) {
  .xd7n744kb__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .xd7n744kb__portrait,
  .xd7n744kb__image--hover {
    transition: none;
  }
}
</style>
