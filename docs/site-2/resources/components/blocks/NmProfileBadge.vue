<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * Props forwarded to <FeluqaButton>.
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

const props = withDefaults(defineProps<{
  name: ProfileName
  role?: string
  image?: string
  hoverImage?: string
  imageAlt?: string
  widthOnParent?: string
  links?: ProfileLink[]
  logos?: ProfileLogo[]
}>(), {
  role: '',
  image: '',
  hoverImage: '',
  imageAlt: '',
  widthOnParent: '100%',
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
  <article class="nm-profile-badge" :aria-label="label" :style="{ width: widthOnParent }">
    <div class="nm-profile-badge__card">
      <figure class="nm-profile-badge__portrait">
        <div class="nm-profile-badge__photo">
          <img
            v-if="image"
            class="nm-profile-badge__image"
            :src="image"
            :alt="imageAlt || name.label"
            loading="lazy"
            decoding="async"
          />
          <img
            v-if="image && hoverImage"
            class="nm-profile-badge__image nm-profile-badge__image--hover"
            :src="hoverImage"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span v-if="!image" class="nm-profile-badge__initials" aria-hidden="true">{{ initials }}</span>
        </div>
      </figure>

      <div class="nm-profile-badge__identity">
        <div v-if="name.type !== 'normal'" class="nm-profile-badge__nameplate">
          <p class="nm-profile-badge__name">{{ name.label }}</p>
        </div>
        <h4 v-else class="nm-profile-badge__name-normal">{{ name.label }}</h4>
        <p v-if="role" class="" style="margin-top:0!important;">{{ role }}</p>
      </div>

      <div v-if="hasActions" class="nm-profile-badge__actions">
        <FeluqaButton
          v-for="link in links"
          :key="link.href"
          :tag="link.tag ?? 'a'"
          :href="link.href"
          :label="link.label"
          :icon="link.icon"
          :aria-label="link.iconOnly ? link.label : undefined"
          :class="{ 'nm-profile-badge__action--icon-only': link.iconOnly }"
          v-bind="link.iconOnly ? { 'x-tooltip.top': link.label } : {}"
          :target="link.external === false ? undefined : '_blank'"
          :rel="link.external === false ? undefined : 'noopener noreferrer'"
        />
        <slot />
      </div>

      <ul v-if="logos.length" class="nm-profile-badge__logos" aria-label="Products">
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
.nm-profile-badge,
.nm-profile-badge *,
.nm-profile-badge *::before,
.nm-profile-badge *::after {
  box-sizing: border-box;
}

/*
 * The badge sizes itself from the width of its own box (container queries),
 * not from the viewport, so it behaves the same in a narrow column,
 * a tablet layout or a wide content area.
 */
.nm-profile-badge {
  container-type: inline-size;
  width: 100%;
  max-width: 42rem;
  margin-block: var(--space-3, 24px);
  color: var(--vp-c-text-1);
  font-family: var(--sans, Arial, Helvetica, sans-serif);
}

.nm-profile-badge__card {
  /* Geometry, all derived from the container width. */
  --nm-skew: clamp(6px, 2.4cqi, 20px);
  --nm-stripe: clamp(4px, 1.2cqi, 7px);
  --nm-gap: clamp(0.625rem, 3cqi, 1.5rem);
  --nm-photo: clamp(6.5rem, 34cqi, 8.5rem);

  /* The panel stays "ink" in both themes, so everything inside is resolved in dark mode. */
  --nm-ink: light-dark(#252a32, #1b222b);

  position: relative;
  display: grid;
  grid-template-areas:
    'portrait'
    'identity'
    'actions'
    'logos';
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  gap: var(--nm-gap);
  padding:
    calc(var(--nm-skew) + var(--nm-gap))
    var(--nm-gap)
    calc(var(--nm-skew) + var(--nm-stripe) + var(--nm-gap));
  background: color-mix(in srgb, var(--vp-c-text-3) 9%, transparent);
  /* Sheared parallelogram: the "not a regular geometry" signature. */
  clip-path: polygon(0 var(--nm-skew), 100% 0, 100% calc(100% - var(--nm-skew)), 0 100%);
  text-align: center;
}

/* Brand stripe running parallel to the slanted bottom edge. */
.nm-profile-badge__card::after {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: calc(var(--nm-skew) + var(--nm-stripe));
  background: var(--vp-c-brand-1);
  clip-path: polygon(0 calc(100% - var(--nm-stripe)), 100% 0, 100% var(--nm-stripe), 0 100%);
  content: '';
  pointer-events: none;
}

/* Dark scheme for all content: --foreground, --muted, buttons etc. flip automatically. */
.nm-profile-badge__portrait,
.nm-profile-badge__identity,
.nm-profile-badge__actions,
.nm-profile-badge__logos {
  color-scheme: dark;
}

/* ---------- Portrait ---------- */

.nm-profile-badge__portrait {
  grid-area: portrait;
  width: var(--nm-photo);
  margin: 0;
  padding: 5px;
  background: var(--foreground);
  border-radius: 2px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.35);
  transform: rotate(-2deg);
  transition: transform var(--duration-normal, 300ms) var(--ease-out, ease-out);
}

.nm-profile-badge__photo {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--surface-soft, var(--vp-c-bg-soft));
}

.nm-profile-badge__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}

.nm-profile-badge__image--hover {
  opacity: 0;
  transition: opacity var(--duration-normal, 300ms) ease;
}

.nm-profile-badge__initials {
  color: var(--vp-c-brand-1);
  font-family: var(--display, var(--sans, Arial, Helvetica, sans-serif));
  font-size: calc(var(--nm-photo) * 0.38);
  font-weight: 800;
  letter-spacing: -0.06em;
}

@media (hover: hover) {
  .nm-profile-badge:hover .nm-profile-badge__portrait {
    transform: rotate(0deg);
  }

  .nm-profile-badge:hover .nm-profile-badge__image--hover {
    opacity: 1;
  }
}

/* ---------- Identity ---------- */

.nm-profile-badge__identity {
  grid-area: identity;
  display: grid;
  justify-items: inherit;
  gap: 0.6rem;
  min-width: 0;
  max-width: 100%;
}

.nm-profile-badge__nameplate {
  --nm-chamfer: clamp(8px, 2.4cqi, 14px);

  max-width: 100%;
  padding: 3px;
  background: var(--vp-c-brand-1);
  clip-path: polygon(
    var(--nm-chamfer) 0, calc(100% - var(--nm-chamfer)) 0,
    100% var(--nm-chamfer), 100% calc(100% - var(--nm-chamfer)),
    calc(100% - var(--nm-chamfer)) 100%, var(--nm-chamfer) 100%,
    0 calc(100% - var(--nm-chamfer)), 0 var(--nm-chamfer)
  );
  transform: rotate(-1deg);
}

.nm-profile-badge__name {
  --nm-inner: calc(var(--nm-chamfer) - 2px);

  margin: 0;
  padding: 0.5rem clamp(0.9rem, 4cqi, 1.5rem);
  background: var(--foreground);
  clip-path: polygon(
    var(--nm-inner) 0, calc(100% - var(--nm-inner)) 0,
    100% var(--nm-inner), 100% calc(100% - var(--nm-inner)),
    calc(100% - var(--nm-inner)) 100%, var(--nm-inner) 100%,
    0 calc(100% - var(--nm-inner)), 0 var(--nm-inner)
  );
  color: var(--vp-c-brand-3);
  font-family: var(--display, var(--sans, Arial, Helvetica, sans-serif));
  font-size: clamp(1.1rem, 5.2cqi, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.nm-profile-badge__name-normal {
  margin: 0;
}

.nm-profile-badge__actions :deep(.nm-profile-badge__action--icon-only) {
  width: 2.5rem;
  min-width: 2.5rem;
  padding-inline: 0;
}

.nm-profile-badge__actions :deep(.nm-profile-badge__action--icon-only .button-content) {
  display: none;
}

.nm-profile-badge__role {
  margin: 0;
  color: var(--muted);
  font-family: var(--mono, ui-monospace, monospace);
  font-size: clamp(0.8rem, 3cqi, 1rem);
  line-height: 1.4;
  text-wrap: balance;
}

/* ---------- Actions (FeluqaButton) ---------- */

.nm-profile-badge__actions {
  grid-area: actions;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-width: 0;
  max-width: 100%;
}

/* ---------- Logos ---------- */

.nm-profile-badge__logos {
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

.nm-profile-badge__logos li {
  display: flex;
  margin: 0;
  padding: 0;
}

.nm-profile-badge__logos a {
  display: inline-flex;
  border-radius: var(--radius-sm, 4px);
}

.nm-profile-badge__logos a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.nm-profile-badge__logos img {
  display: block;
  width: auto;
  max-width: 100%;
  height: clamp(1.75rem, 7cqi, 2.5rem);
  margin: 0;
  object-fit: contain;
}

/* ---------- Wide container: portrait beside the identity ---------- */

@container (min-width: 32rem) {
  .nm-profile-badge__card {
    --nm-photo: clamp(7.5rem, 24cqi, 10rem);

    grid-template-areas:
      'portrait identity'
      'portrait actions'
      'logos    logos';
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    align-items: center;
    justify-items: start;
    text-align: start;
    column-gap: calc(var(--nm-gap) * 1.25);
  }

  .nm-profile-badge__portrait {
    align-self: center;
  }

  .nm-profile-badge__identity {
    align-self: end;
  }

  .nm-profile-badge__actions {
    align-self: start;
    justify-content: flex-start;
  }

  .nm-profile-badge__logos {
    justify-content: flex-start;
  }
}

/* ---------- Very narrow container: buttons stack full width ---------- */

@container (max-width: 20rem) {
  .nm-profile-badge__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nm-profile-badge__portrait,
  .nm-profile-badge__image--hover {
    transition: none;
  }
}
</style>
