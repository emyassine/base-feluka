
<script setup>
import { toRefs } from 'vue'

defineOptions({ name: 'Acomponent' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  introduction: {
    type: String,
    default: '',
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
</script>

<template>
  <section class="nm-about">
    <!-- Introduction -->
    <div class="nm-about-introduction">
      <h1 v-if="title" v-html="title"></h1>
      <p
        v-if="introduction"
        class="nm-about-dropcap"
        v-html="introduction"
      ></p>
    </div>

    <!-- Gallery -->
    <div v-if="gallery.length" class="nm-about-gallery">
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
    <div class="nm-about-content">
      <h2 v-if="sectionTitle" v-html="sectionTitle"></h2>

      <div class="nm-about-paragraphs">
        <p v-for="(paragraph, index) in paragraphs" :key="index">
          <span v-html="paragraph.before"></span>

          <span
            v-if="paragraph.image"
            class="nm-about-illustration"
            tabindex="0"
          >
            <img
              :src="paragraph.image.thumb || paragraph.image.src"
              :alt="paragraph.image.alt || ''"
              loading="lazy"
            />

            <span class="nm-about-illustration-preview">
              <img
                :src="paragraph.image.src"
                alt=""
                loading="lazy"
              />
              <span v-if="paragraph.image.caption">
                {{ paragraph.image.caption }}
              </span>
            </span>
          </span>

          <span v-html="paragraph.after"></span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nm-about {
  color: var(--vp-c-text-1);
  padding: 28px 0 100px;
  line-height: 1.52;
}

/* Shared editorial layout */
.nm-about-introduction,
.nm-about-content {
  width: min(100% - 40px, 544px);
  margin-inline: auto;
}

/* Introduction */
.nm-about-introduction {
  margin-bottom: 56px;
}

.nm-about-introduction h1 {
  margin: 0 0 28px;
}

.nm-about-introduction p {
  margin: 0;
}

/* Gallery */
.nm-about-gallery {
  width: 100%;
  margin: 0 !important;
}

/* Content */
.nm-about-content {
  margin-top: 0;
}

.nm-about-content h2 {
  margin: 0 0 24px;
  font-weight: 500;
}

.nm-about-paragraphs p {
  margin: 0 0 20px;
  line-height: 1.55;
}

/* Inline illustrations */
.nm-about-illustration {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 22px;
  margin-inline: 8px;
  vertical-align: middle;
  cursor: pointer;
  outline-offset: 3px;
}

.nm-about-illustration > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #d2ccc1;
  border-radius: var(--radius-md);
  transition: transform 160ms ease;
}

.nm-about-illustration:hover > img,
.nm-about-illustration:focus-visible > img {
  transform: scale(1.08);
}

.nm-about-illustration-preview {
  position: absolute;
  z-index: 20;
  top: calc(100% + 10px);
  left: 50%;
  width: 190px;
  padding: 5px;
  border-radius: var(--radius-md);
  background: #fff;
  box-shadow: 0 12px 36px rgb(0 0 0 / 0.18);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, -5px) scale(0.97);
  transition:
    opacity 160ms ease,
    transform 160ms ease,
    visibility 160ms ease;
}

.nm-about-illustration-preview img {
  display: block;
  width: 100%;
  aspect-ratio: 1.5 / 1;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.nm-about-illustration-preview > span {
  display: block;
  padding: 7px 4px 3px;
  color: #292929;
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
}

.nm-about-illustration:hover .nm-about-illustration-preview,
.nm-about-illustration:focus-visible .nm-about-illustration-preview {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0) scale(1);
}

/* Responsive */
@media (max-width: 700px) {
  .nm-about {
    padding-top: 28px;
  }

  .nm-about-introduction {
    margin-bottom: 0;
  }

  .nm-about-gallery {
    margin-bottom: 44px;
  }
}
</style>
