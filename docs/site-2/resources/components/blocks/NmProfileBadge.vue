<script setup lang="ts">
import { computed } from 'vue'

type ProfileLink = {
  label: string
  href: string
  icon?: string
  external?: boolean
}

type ProfileLogo = {
  src: string
  alt: string
  href?: string
}

const props = withDefaults(defineProps<{
  name: string
  role?: string
  image?: string
  hoverImage?: string
  imageAlt?: string
  skills?: string[]
  links?: ProfileLink[]
  logos?: ProfileLogo[]
}>(), {
  role: '',
  image: '',
  hoverImage: '',
  imageAlt: '',
  skills: () => [],
  links: () => [],
  logos: () => [],
})

const initials = computed(() => props.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? '').join('').toUpperCase())
</script>

<template>
  <article class="nm-profile-badge" :aria-label="[name, role].filter(Boolean).join(', ')">
    <div class="nm-profile-badge__frame">
      <div class="nm-profile-badge__main">
        <div class="nm-profile-badge__portrait-column">
          <div class="nm-profile-badge__portrait">
            <img v-if="image" class="nm-profile-badge__image" :src="image" :alt="imageAlt || name" loading="lazy" />
            <img v-if="hoverImage" class="nm-profile-badge__image nm-profile-badge__image--hover" :src="hoverImage" alt="" loading="lazy" />
            <span v-if="!image" class="nm-profile-badge__initials" aria-hidden="true">{{ initials }}</span>
          </div>
          <div v-if="logos.length" class="nm-profile-badge__logos" aria-label="Products">
            <template v-for="logo in logos" :key="logo.src">
              <a v-if="logo.href" :href="logo.href" :aria-label="logo.alt">
                <img :src="logo.src" :alt="logo.alt" loading="lazy" />
              </a>
              <span v-else>
                <img :src="logo.src" :alt="logo.alt" loading="lazy" />
              </span>
            </template>
          </div>
        </div>

        <div class="nm-profile-badge__content">
          <div class="nm-profile-badge__nameplate">
            <h2 class="nm-profile-badge__name">{{ name }}</h2>
          </div>
          <p v-if="role" class="nm-profile-badge__role">&lt;/ {{ role }} &gt;</p>
          <ul v-if="skills.length" class="nm-profile-badge__skills" aria-label="Areas of expertise">
            <li v-for="skill in skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
      </div>

      <nav v-if="links.length" class="nm-profile-badge__links" aria-label="Profile links">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          <span
            v-if="link.icon"
            class="nm-profile-badge__link-icon"
            :style="{ '--profile-link-icon': `url('${link.icon}')` }"
            aria-hidden="true"
          />
          {{ link.label }}
        </a>
      </nav>

    </div>
  </article>
</template>

<style scoped>
.nm-profile-badge,
.nm-profile-badge * {
  box-sizing: border-box;
}

.nm-profile-badge {
  display: inline-block;
  max-width: 100%;
  margin-block: 1.5rem;
  color: var(--vp-c-text-1);
  font-family: var(--sans, Arial, Helvetica, sans-serif);
  vertical-align: top;
}

.nm-profile-badge__frame {
  width: fit-content;
  max-width: min(650px, calc(100vw - 2 * var(--gutter, 24px)));
  padding: 10px 0;
  border-radius: 0 4px 0 0;
  background-color: var(--vp-c-bg);
  background-image:
    linear-gradient(95deg, #fff0 0 calc(100% - 22px), var(--vp-c-bg) calc(100% - 21px)),
    linear-gradient(185deg, #fff0 0 calc(100% - 29px), var(--vp-c-bg) calc(100% - 28px) 100%),
    linear-gradient(177deg, #fff0 0 calc(100% - 32px), var(--vp-c-bg) calc(100% - 31px) 100%),
    linear-gradient(185deg, #fff0 0 calc(100% - 40px), var(--vp-c-brand-1) calc(100% - 38px) calc(100% - 29px), #fff0 calc(100% - 28px) 100%),
    linear-gradient(177deg, #fff0 0 calc(100% - 40px), var(--vp-c-brand-1) calc(100% - 39px) calc(100% - 32px), #fff0 calc(100% - 31px) 100%),
    linear-gradient(177deg, #fff0 0 calc(100% - 40px), var(--vp-c-bg) calc(100% - 39px)),
    linear-gradient(185deg, #fff0 0 calc(100% - 31px), var(--vp-c-bg) calc(100% - 30px)),
    linear-gradient(95deg, #fff0 0 calc(100% - 31px), var(--vp-c-bg) calc(100% - 30px)),
    linear-gradient(178deg, var(--vp-c-bg) 0 40px, var(--vp-c-text-1) 41px 100px, #fff0 0 100%),
    linear-gradient(95deg, #fff0 37px, var(--vp-c-text-1) 38px calc(100% - 31px), #fff0 calc(100% - 30px));
}

.nm-profile-badge__main {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  align-items: center;
  width: fit-content;
  max-width: 100%;
}

.nm-profile-badge__portrait-column {
  width: 230px;
  max-width: 100%;
  padding-block: 12px;
}

.nm-profile-badge__portrait {
  position: relative;
  display: grid;
  width: 160px;
  height: 160px;
  margin-inline-start: 20px;
  overflow: hidden;
  place-items: center;
  border-radius: 1px;
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 10px var(--vp-c-text-1), 0 0 0 20px var(--vp-c-bg);
  transform: rotate(-2deg);
  transition: transform 250ms ease;
}

.nm-profile-badge:hover .nm-profile-badge__portrait {
  transform: rotate(0deg);
}

.nm-profile-badge__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nm-profile-badge__image--hover {
  opacity: 0;
  transition: opacity 250ms ease;
}

.nm-profile-badge:hover .nm-profile-badge__image--hover {
  opacity: 1;
}

.nm-profile-badge__initials {
  color: var(--vp-c-brand-1);
  font-family: var(--display, Arial, Helvetica, sans-serif);
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.1em;
}

.nm-profile-badge__content {
  min-width: 0;
  padding-inline-end: 16px;
  text-align: center;
}

.nm-profile-badge__nameplate {
  width: fit-content;
  max-width: 100%;
  padding: 3px;
  background: var(--vp-c-brand-1);
  clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
  transform: rotate(-1deg);
}

.nm-profile-badge__name {
  display: block;
  max-width: 100%;
  margin: 0;
  padding: 10px 18px 16px;
  border: 0;
  background: var(--vp-c-bg);
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  color: var(--vp-c-brand-1);
  font-family: var(--display, var(--sans, Arial, Helvetica, sans-serif));
  font-size: clamp(1.45rem, 4vw, 1.9rem);
  font-weight: 700;
  line-height: 1.2;
}
.nm-profile-badge__role {
  width: 100%;
  margin: 0;
  padding: 24px 0 28px;
  color: var(--vp-c-bg);
  font-size: clamp(0.9rem, 2.5vw, 1.15rem);
  max-width: 100%;
  line-height: 1.35;
  transform: rotate(-2deg);
}

.nm-profile-badge__skills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.15rem 0.55rem;
  max-width: 100%;
  margin: 0;
  padding: 0 8px 14px;
  color: var(--vp-c-brand-1);
  font-family: var(--display, var(--sans, Arial, Helvetica, sans-serif));
  font-size: clamp(0.92rem, 2.8vw, 1.2rem);
  line-height: 1.65;
  list-style: none;
}

.nm-profile-badge__skills li + li::before {
  margin-inline-end: 0.55rem;
  content: '•';
}

.nm-profile-badge__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.6rem 1.1rem;
  min-height: 80px;
  margin: 0 18px 10px 58px;
  padding: 10px 12px;
}

.nm-profile-badge__links a {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--vp-c-bg);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transform: rotate(-2deg);
  transition: color 180ms ease, transform 180ms ease;
}

.nm-profile-badge__links a:nth-child(even) {
  transform: rotate(2deg);
}

.nm-profile-badge__links a:hover,
.nm-profile-badge__links a:focus-visible {
  color: var(--vp-c-brand-1);
  transform: translateY(-2px) rotate(0deg);
}

.nm-profile-badge__link-icon {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background: currentColor;
  -webkit-mask: var(--profile-link-icon) center / contain no-repeat;
  mask: var(--profile-link-icon) center / contain no-repeat;
}

.nm-profile-badge__logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1.1rem;
  padding: 12px 6px;
}

.nm-profile-badge__logos a,
.nm-profile-badge__logos > span {
  display: inline-flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.nm-profile-badge__logos img {
  display: block;
  width: auto;
  max-width: min(100%, 104px);
  height: 42px;
  object-fit: contain;
}

@media (max-width: 560px) {
  .nm-profile-badge__frame {
    width: 100%;
  }

  .nm-profile-badge__main {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .nm-profile-badge__portrait-column {
    width: 100%;
    padding-block: 12px 22px;
  }

  .nm-profile-badge__portrait {
    margin-inline: auto;
  }

  .nm-profile-badge__content {
    width: 100%;
    padding-inline: 12px;
  }

  .nm-profile-badge__role,
  .nm-profile-badge__skills {
    margin-inline: auto;
  }

  .nm-profile-badge__name {
    font-size: clamp(1rem, 6vw, 1.45rem);
  }

  .nm-profile-badge__links {
    margin-inline: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nm-profile-badge__portrait,
  .nm-profile-badge__image--hover,
  .nm-profile-badge__links a {
    transition: none;
  }
}
</style>
