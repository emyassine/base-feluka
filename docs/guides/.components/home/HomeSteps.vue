<script setup lang="ts">
import './home.css'

interface StepItem {
  index: string
  title: string
  description: string
}

interface TerminalLine {
  text: string
  tone?: 'prompt' | 'dim' | 'ok' | 'plain'
}

interface StepAction {
  label: string
  href: string
}

defineProps<{
  kicker: string
  title: string
  copy?: string
  steps: StepItem[]
  terminalLabel: string
  terminal: TerminalLine[]
  actions?: StepAction[]
}>()
</script>

<template>
  <section class="fh-section fh-steps" aria-labelledby="fh-steps-title">
    <div class="fh-container fh-steps__grid">
      <div class="fh-steps__copy">
        <p class="fh-kicker">{{ kicker }}</p>
        <h2 id="fh-steps-title" class="fh-heading">{{ title }}</h2>
        <p v-if="copy" class="fh-head__copy">{{ copy }}</p>

        <ol class="fh-steps__list">
          <li v-for="step in steps" :key="step.index" class="fh-steps__item">
            <span class="fh-steps__index" aria-hidden="true">{{ step.index }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ol>

        <div v-if="actions?.length" class="fh-actions">
          <a
            v-for="(action, index) in actions"
            :key="action.label"
            class="fh-button"
            :class="{ 'fh-button--primary': index === 0 }"
            :href="action.href"
          >
            {{ action.label }}
          </a>
        </div>
      </div>

      <figure class="fh-terminal">
        <figcaption class="fh-terminal__bar">
          <span class="fh-code__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="fh-terminal__label">{{ terminalLabel }}</span>
        </figcaption>
        <pre class="fh-terminal__body"><code><span
          v-for="(line, index) in terminal"
          :key="index"
          class="fh-terminal__line"
          :class="`fh-terminal__line--${line.tone ?? 'plain'}`"
        >{{ line.text }}<span v-if="index === terminal.length - 1" class="fh-terminal__cursor" aria-hidden="true">▌</span></span></code></pre>
      </figure>
    </div>
  </section>
</template>
