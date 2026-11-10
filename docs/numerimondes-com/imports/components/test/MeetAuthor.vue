<template>
  <div class="not-vp-code-group" style="margin-top: 2.5rem">
    <article class="pcard" v-bind="$attrs" style="padding-bottom: 0.6rem">
      <div class="pcard__grid">
        <!-- Avatar -->
        <div class="pcard__avatar">
          <img :src="avatar" :alt="`${name} avatar`" loading="lazy" class="pcard__img" />
        </div>

        <!-- Body -->
        <div class="pcard__body">
          <div class="pcard__head">
            <h3 class="pcard__name">{{ name }}</h3>
            <span v-if="title" class="pcard__title">{{ title }}</span>
          </div>

          <p class="pcard__bio">
            {{ bio }}
          </p>

          <nav v-if="links && links.length" class="pcard__links" aria-label="Profile links">
            <template v-for="(link, i) in links" :key="i">
              <a
                :href="link.href"
                :target="link.target ?? '_blank'"
                :rel="link.rel ?? 'noopener noreferrer'"
                class="pcard__link"
              >
                {{ link.label }}
              </a>
              <span v-if="i < links.length - 1" class="pcard__sep" aria-hidden="true">|</span>
            </template>
          </nav>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: 'ATRON CALERY' },
  title: { type: String, default: 'CTO' },
  bio: {
    type: String,
    default:
      'Lorem ipsum dolor sit amet, cons tetur adipiscing elit. Orci commodo, elit sit enim blandit enim sit molestie aana.',
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&q=80',
  },
  links: {
    type: Array,
    default: () => [
      { label: 'Website', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'Dribbble', href: '#' },
    ],
  },
});
</script>

<style scoped>
/* .vitepress/theme/styles/profile-card.css */

.pcard {
  width: 100%;
  max-width: 678px;
}

.pcard__grid {
  display: grid;
  gap: 22px;
  align-items: stretch;
  padding: 1.2rem;

  /* desktop default */
  grid-template-columns: 160px 1fr;
}

.pcard__avatar {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  min-height: 160px;
}

.pcard__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* body */
.pcard__body {
  min-width: 0;
}

.pcard__head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap; /* title goes below name if too long */
  margin: 0 0 8px 0;
}

.pcard__name {
  margin: 0;
  font-size: 18px;
  font-weight: 500; /* mise en avant */
  letter-spacing: 0.02em;
  line-height: 1.15;
}

.pcard__title {
  font-size: 13.5px;
  font-weight: 400;
  opacity: 0.75;
  line-height: 1.15;
  white-space: normal;
  word-break: break-word;
}

.pcard__bio {
  margin: 0 0 14px 0;
  font-size: 13.5px;
  line-height: 1.55;
  text-align: justify;
}

.pcard__links {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  margin: 0;
}

.pcard__link {
  font-weight: 600;
  text-decoration: none;
}

.pcard__sep {
  user-select: none;
  opacity: 0.6;
}

/* MOBILE: avatar becomes small circle on top + title under name */
@media (max-width: 640px) {
  .pcard__grid {
    grid-template-columns: 1fr;
    gap: 14px;
    align-items: center;
  }

  .pcard__avatar {
    width: 72px;
    height: 72px;
    min-height: 0;
    border-radius: 999px;
    justify-self: center;
  }

  .pcard__head {
    justify-content: center;
    text-align: center;
    gap: 6px;
  }

  .pcard__name {
    width: 100%;
    text-align: center;
  }

  .pcard__title {
    width: 100%;
    text-align: center; /* passe sous le nom sur mobile */
  }

  .pcard__links {
    justify-content: center;
    width: 100%;
  }
}
</style>
