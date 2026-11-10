<template>
  <section class="ndc-hero" v-bind="$attrs" ref="rootRef">
    <div class="ndc-hero__inner">
      <p v-if="eyebrow" class="eyebrow" v-html="renderedEyebrow"></p>

      <h1 class="ndc-hero__title" style="font-weight: 400 !important; color: unset !important">
        <slot name="title">
          <span v-html="renderedTitle"></span>
        </slot>
      </h1>

      <p v-if="subtitle" class="subtitle" v-html="renderedSubtitle"></p>
      <div>
        <div class="ndc-hero__actions">
          <NDCButton
            v-if="primaryHref && primaryText"
            :href="primaryHref"
            variant="pure-gray"
            :icon="primaryIcon"
            :icon-position="primaryIconPosition"
            :size="buttonSize"
            scaleOnHover="true"
            :pill="true"
            style="opacity: inherit !important"
          >
            {{ primaryText }}
          </NDCButton>

          <NDCButton
            v-if="secondaryHref && secondaryText"
            :href="secondaryHref"
            variant="pure-blackwhite"
            :icon="secondaryIcon"
            :icon-position="secondaryIconPosition"
            :size="buttonSize"
            scaleOnHover="true"
            :pill="true"
            style="opacity: inherit !important"
          >
            {{ secondaryText }}
          </NDCButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });
type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;

  primaryText?: string;
  primaryHref?: string;
  primaryIcon?: any;
  primaryIconPosition?: 'left' | 'right';

  secondaryText?: string;
  secondaryHref?: string;
  secondaryIcon?: any;

  secondaryIconPosition?: 'left' | 'right';

  buttonSize?: 'sm' | 'md' | 'lg';
};

const props = withDefaults(defineProps<Props>(), {
  eyebrow: '',
  title: '',
  subtitle: '',
  primaryIconPosition: 'right',
  secondaryIconPosition: 'right',
  buttonSize: 'md',
});

const attrs = useAttrs();
const rootRef = ref<HTMLElement | null>(null);
const timers: number[] = [];

type ArrayConfig = { texts: string[]; duration: number; pause: number; effect: 'typewriter' | 'none' };

const parseTextList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(item => String(item)).filter(Boolean);
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }
  return [trimmed].filter(Boolean);
};

const parseDuration = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const arrayConfigs = computed(() => {
  const configs = new Map<number, ArrayConfig>();

  const ensure = (id: number) => {
    if (!configs.has(id)) configs.set(id, { texts: [], duration: 1200, pause: 700, effect: 'none' });
    return configs.get(id)!;
  };

  for (const [key, value] of Object.entries(attrs)) {
    let match = key.match(/^array-(\d+)-(text|duration|pause|effect)$/);
    if (!match) {
      match = key.match(/^array(\d+)(Text|Duration|Pause|Effect)$/);
    }
    if (!match) continue;

    const id = Number(match[1]);
    const kind = match[2].toLowerCase();
    const cfg = ensure(id);

    if (kind === 'text') cfg.texts = parseTextList(value);
    if (kind === 'duration') cfg.duration = parseDuration(value, cfg.duration);
    if (kind === 'pause') cfg.pause = parseDuration(value, cfg.pause);
    if (kind === 'effect') cfg.effect = String(value).toLowerCase() === 'typewriter' ? 'typewriter' : 'none';
  }

  return configs;
});

const replaceArrays = (value: string) =>
  value.replace(/<array-(\d+)><\/array-\1>/g, (match, id, offset, full) => {
    const before = full.slice(0, offset);
    const after = full.slice(offset + match.length);
    const isInline = before.trim().length > 0 || after.trim().length > 0;
    return `<span class="vp-home-typing${isInline ? ' vp-home-typing--inline' : ''}" data-array-id="${id}"></span>`;
  });

const renderedEyebrow = computed(() => replaceArrays(props.eyebrow || ''));
const renderedTitle = computed(() => replaceArrays(props.title || ''));
const renderedSubtitle = computed(() => replaceArrays(props.subtitle || ''));

const startTyping = () => {
  const root = rootRef.value;
  if (!root) return;

  const spans = Array.from(root.querySelectorAll<HTMLElement>('[data-array-id]'));
  for (const span of spans) {
    const id = Number(span.dataset.arrayId || 0);
    const cfg = arrayConfigs.value.get(id);
    if (!cfg || !cfg.texts.length) continue;

    const maxLen = Math.max(...cfg.texts.map(text => text.length), 1);
    const isInline = span.classList.contains('vp-home-typing--inline');

    // For block-level spans, reserve max width to prevent layout jumps
    if (!isInline) {
      span.style.setProperty('--vp-typing-max-width', `${maxLen}ch`);
    }

    let index = 0;
    let charIndex = 0;
    let deleting = false;

    const setText = (text: string) => {
      span.textContent = text;
      span.style.setProperty('--vp-typing-steps', `${Math.max(1, text.length)}`);
      span.style.setProperty('--vp-typing-width', `${Math.max(1, text.length)}ch`);
    };

    const nextDelay = (fullText: string) => {
      const len = Math.max(1, fullText.length);
      return Math.max(24, Math.floor(cfg.duration / len));
    };

    const runTypewriter = () => {
      const fullText = cfg.texts[index];
      const stepDelay = nextDelay(fullText);

      if (!deleting) {
        charIndex = Math.min(fullText.length, charIndex + 1);
        setText(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          deleting = true;
          const hold = Math.max(150, cfg.pause);
          const timer = window.setTimeout(runTypewriter, hold);
          timers.push(timer);
          return;
        }
        const timer = window.setTimeout(runTypewriter, stepDelay);
        timers.push(timer);
        return;
      }

      charIndex = Math.max(0, charIndex - 1);
      setText(fullText.slice(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        index = (index + 1) % cfg.texts.length;
        const hold = Math.max(120, Math.floor(cfg.pause / 2));
        const timer = window.setTimeout(runTypewriter, hold);
        timers.push(timer);
        return;
      }
      const timer = window.setTimeout(runTypewriter, Math.max(18, Math.floor(stepDelay * 0.7)));
      timers.push(timer);
    };

    const applyStatic = () => {
      const text = cfg.texts[index];
      setText(text);
    };

    if (cfg.effect === 'typewriter') {
      setText('');
      runTypewriter();
    } else {
      applyStatic();
      if (cfg.texts.length > 1) {
        const scheduleNext = () => {
          const delay = Math.max(150, cfg.duration + cfg.pause);
          const timer = window.setTimeout(() => {
            index = (index + 1) % cfg.texts.length;
            applyStatic();
            scheduleNext();
          }, delay);
          timers.push(timer);
        };
        scheduleNext();
      }
    }
  }
};

onMounted(() => {
  startTyping();
});

onBeforeUnmount(() => {
  for (const timer of timers) window.clearInterval(timer);
});
</script>

<style scoped>
.ndc-hero {
  padding-top: 3rem;
  padding-bottom: 2.5rem;
  display: flex;
  justify-content: center;
}

.ndc-hero__inner {
  width: 100%;
  max-width: 980px;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ndc-hero__title {
  margin: 0;
  letter-spacing: -0.04em;
  font-size: clamp(40px, 5.2vw, 64px);
  line-height: 1.03;
  max-width: 22ch;
  /* Prevent vertical jump when inline spans animate */
  white-space: nowrap;
}

.ndc-hero__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 520px) {
  .ndc-hero {
    padding-top: 5rem;
    padding-bottom: 5rem;
    min-height: 460px;
  }

  .ndc-hero__title {
    white-space: normal;
  }

  .ndc-hero__actions {
    gap: 10px;
  }
}
</style>
