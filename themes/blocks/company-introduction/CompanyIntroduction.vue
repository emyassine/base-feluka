
<script setup>
import { computed, toRefs } from 'vue'

defineOptions({ name: 'CompanyIntroduction' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  introduction: {
    type: String,
    default: '',
  },
  introductionSpacing: {
    type: [String, Number],
    default: null,
  },
  introductionTitleSpacing: {
    type: [String, Number],
    default: null,
  },
  gallery: {
    type: Array,
    default: () => [],
  },
  sectionTitle: {
    type: String,
    default: '',
  },
  paragraphs: {
    type: Array,
    default: () => [],
  },
})

const { title, introduction, gallery, sectionTitle, paragraphs } = toRefs(props)
const introductionStyle = computed(() => {
  const style = {}
  if (props.introductionSpacing !== null) {
    style['--feluqa-about-introduction-spacing'] = typeof props.introductionSpacing === 'number'
      ? `${props.introductionSpacing}px`
      : props.introductionSpacing
  }
  if (props.introductionTitleSpacing !== null) {
    style['--feluqa-about-introduction-title-spacing'] = typeof props.introductionTitleSpacing === 'number'
      ? `${props.introductionTitleSpacing}px`
      : props.introductionTitleSpacing
  }
  return Object.keys(style).length ? style : undefined
})
</script>

<template>
  <section class="feluqa-about">
    <!-- Introduction -->
    <div
      v-if="title || introduction"
      class="feluqa-about-introduction"
      :style="introductionStyle"
    >
      <h2 v-if="title" class="scroll-reveal" v-html="title"></h2>
      <p
        v-if="introduction"
        class="feluqa-about-dropcap scroll-reveal"
        v-html="introduction"
      ></p>
    </div>

    <!-- Gallery -->
    <div v-if="gallery.length" class="feluqa-about-gallery">
      <BounceCards
        :images="gallery.map((image) => image.src)"
        :alts="gallery.map((image) => image.alt || '')"
        container-width="100%"
        :container-height="320"
        card-width="180px"
        aspect-ratio="1:1"
        hover-push="140px"
        expanded-width="82%"
        expanded-height="90%"
        mobile-expanded-width="94%"
        mobile-expanded-height="88%"
        :expanded-z-index="40"
        overflow-mode="visible"
        enable-hover
      />
    </div>

    <!-- Content -->
    <div class="feluqa-about-content">
      <h3 v-if="sectionTitle" class="scroll-reveal" v-html="sectionTitle"></h3>

      <div class="feluqa-about-paragraphs">
        <p v-for="(paragraph, index) in paragraphs" :key="index" class="scroll-reveal">
          <span v-html="paragraph.before"></span>

          <span
            v-if="paragraph.image"
            class="inline-image-preview"
            tabindex="0"
            :data-preview-caption="paragraph.image.caption"
            :data-preview-src="paragraph.image.src"
          >
            <img
              :src="paragraph.image.thumb || paragraph.image.src"
              :alt="paragraph.image.alt || ''"
              loading="lazy"
            />
          </span>

          <span v-html="paragraph.after"></span>
        </p>
      </div>
      <div v-if="$slots.actions" class="feluqa-about-actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.feluqa-about {
  color: var(--feluqa-text-primary);
  padding: 28px 0 100px;
  line-height: 1.52;
}

/* Shared editorial layout */
.feluqa-about-introduction,
.feluqa-about-content {
  width: min(100% - 40px, 544px);
  margin-inline: auto;
}

/* Introduction */
.feluqa-about-introduction {
  margin-bottom: var(--feluqa-about-introduction-spacing, 56px);
}

.feluqa-about-introduction :is(h1, h2, h3) {
  margin: 0 0 var(--feluqa-about-introduction-title-spacing, 28px);
}

.feluqa-about-introduction p {
  margin: 0;
}

/* Gallery */
.feluqa-about-gallery {
  width: 100%;
  margin: 0 !important;
}

/* Content */
.feluqa-about-content {
  margin-top: 0;
}

.feluqa-about-content h2 {
  margin: 0 0 24px;
  font-weight: 500;
}

.feluqa-about-paragraphs p {
  margin: 0 0 20px;
  line-height: 1.55;
}

/* Responsive */
@media (max-width: 700px) {
  .feluqa-about {
    padding-top: 28px;
  }

  .feluqa-about-introduction {
    margin-bottom: 0;
  }

  .feluqa-about-gallery {
    margin-bottom: 44px;
  }
}
</style>
