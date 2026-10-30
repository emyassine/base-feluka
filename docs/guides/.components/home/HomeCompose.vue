<script setup lang="ts">
import './home.css'

interface CodeLine {
  text: string
  tone?: 'comment' | 'attribute' | 'string' | 'function' | 'plain'
}

interface ComposeStage {
  index: string
  title: string
  description: string
  chips: string[]
}

withDefaults(
  defineProps<{
    kicker: string
    title: string
    copy?: string
    codeLabel: string
    code: CodeLine[]
    codeFoot?: string
    stages: ComposeStage[]
    note?: string
    linkLabel?: string
    linkHref?: string
  }>(),
  {
  },
)
</script>

<template>
  <section class="fh-band fh-compose" aria-labelledby="fh-compose-title">
    <div class="fh-container fh-compose__grid">
      <div class="fh-compose__copy">
        <p class="fh-kicker fh-kicker--onDark">{{ kicker }}</p>
        <h2 id="fh-compose-title" class="fh-heading fh-heading--onDark">{{ title }}</h2>
        <p v-if="copy" class="fh-compose__lead">{{ copy }}</p>

        <ol class="fh-stages">
          <li v-for="stage in stages" :key="stage.index" class="fh-stages__row">
            <span class="fh-stages__index" aria-hidden="true">{{ stage.index }}</span>
            <div class="fh-stages__body">
              <h3>{{ stage.title }}</h3>
              <p>{{ stage.description }}</p>
              <ul v-if="stage.chips.length" class="fh-chips">
                <li v-for="chip in stage.chips" :key="chip">{{ chip }}</li>
              </ul>
            </div>
          </li>
        </ol>

        <p v-if="note" class="fh-compose__note">{{ note }}</p>
        <a v-if="linkLabel && linkHref" class="fh-link fh-link--onDark" :href="linkHref">
          {{ linkLabel }}
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <figure class="fh-code">
        <figcaption class="fh-code__bar">
          <span class="fh-code__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="fh-code__label">{{ codeLabel }}</span>
        </figcaption>
        <pre class="fh-code__body"><code><span
          v-for="(line, index) in code"
          :key="index"
          class="fh-code__line"
          :class="`fh-code__line--${line.tone ?? 'plain'}`"
        >{{ line.text }}</span></code></pre>
        <div v-if="codeFoot" class="fh-code__foot">{{ codeFoot }}</div>
      </figure>
    </div>
  </section>
</template>
