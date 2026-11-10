<template>
  <NDCHeader
    :title="resolvedTitle"
    :subtitle="resolvedSubtitle"
    :header-align="headerAlign"
    :header-class="computedHeaderClass"
  >
    <template #actions>
      <div class="docs-header__actions">
        <NDCButton variant="blackwhite" size="sm" icon="Share2" @click="handleShare">
          {{ shareLabel }}
        </NDCButton>

        <NDCDropdown :trigger-label="dropdownLabel" :items="resolvedProviders" placement="bottom-end" width="sm">
          <template #trigger>
            <NDCButton variant="blackwhite" size="sm" icon="ChevronDown">
              {{ dropdownLabel }}
            </NDCButton>
          </template>
        </NDCDropdown>

        <slot name="actions" />
      </div>
    </template>
  </NDCHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import NDCHeader from '../base/NDCHeader.vue';
import NDCButton from '../base/NDCButton.vue';
import NDCDropdown from '../base/NDCDropdown.vue';

type Provider = {
  id: string;
  label: string;
  description: string;
  href: string;
  color?: 'gray' | 'danger' | 'info' | 'primary' | 'success' | 'warning';
  onClick?: () => void;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    headerAlign?: 'center' | 'left';
    headerClass?: string;
    shareLabel?: string;
    dropdownLabel?: string;
    providers?: Provider[];
    promptTemplate?: string;
  }>(),
  {
    headerAlign: 'left',
    shareLabel: 'Share',
    dropdownLabel: 'Ask questions',
  }
);

const { frontmatter, page } = useData();

const computedHeaderClass = computed(() => {
  const classes = ['docs-page-header'];
  if (props.headerAlign === 'center') classes.push('docs-page-header--center');
  if (props.headerClass && props.headerClass.trim()) classes.push(props.headerClass);
  return classes.join(' ');
});

const resolvedTitle = computed(() => {
  return (
    props.title ||
    (frontmatter.value?.docTitle as string | undefined) ||
    (frontmatter.value?.title as string | undefined) ||
    (page.value?.title as string | undefined) ||
    ''
  );
});

const resolvedSubtitle = computed(() => {
  return (
    props.subtitle ||
    (frontmatter.value?.docSubTitle as string | undefined) ||
    (frontmatter.value?.description as string | undefined) ||
    ''
  );
});

const resolvedProviders = computed<Provider[]>(() => {
  if (props.providers?.length) return props.providers;
  return [
    {
      id: 'chatgpt',
      label: 'Open in ChatGPT',
      description: 'Ask questions about this page',
      href: 'https://chat.openai.com/',
      color: 'primary',
      onClick: () => openProvider('https://chat.openai.com/'),
    },
    {
      id: 'claude',
      label: 'Open in Claude',
      description: 'Ask questions about this page',
      href: 'https://claude.ai/',
      onClick: () => openProvider('https://claude.ai/'),
    },
    {
      id: 'perplexity',
      label: 'Open in Perplexity',
      description: 'Ask questions about this page',
      href: 'https://www.perplexity.ai/',
      onClick: () => openProvider('https://www.perplexity.ai/'),
    },
    {
      id: 'grok',
      label: 'Open in Grok',
      description: 'Ask questions about this page',
      href: 'https://x.com/i/grok',
      onClick: () => openProvider('https://x.com/i/grok'),
    },
  ];
});

const currentUrl = computed(() => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
});

const promptText = computed(() => {
  if (props.promptTemplate) {
    return props.promptTemplate
      .split('{title}')
      .join(resolvedTitle.value || '')
      .split('{url}')
      .join(currentUrl.value || '');
  }
  return [
    'Please answer questions about this page.',
    `Title: ${resolvedTitle.value || ''}`,
    `URL: ${currentUrl.value || ''}`,
  ].join('\n');
});

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

async function handleShare(): Promise<void> {
  if (typeof navigator === 'undefined') return;
  const url = currentUrl.value;
  const title = resolvedTitle.value;

  if (navigator.share && url) {
    try {
      await navigator.share({ title, url });
      return;
    } catch {
      // Fallback to clipboard.
    }
  }

  if (url) {
    await copyText(url);
  }
}

async function openProvider(href: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const prompt = promptText.value.trim();
  if (prompt) {
    await copyText(prompt);
  }

  if (href) window.open(href, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
.docs-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

:deep(.docs-page-header) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
}

:deep(.docs-page-header .marquee-header__content) {
  width: 100%;
  align-items: flex-start;
  text-align: left;
}

:deep(.docs-page-header .marquee-header__actions) {
  width: 100%;
  justify-content: flex-start;
  margin-left: 0;
}

:deep(.docs-page-header--center .marquee-header__content) {
  align-items: center;
  text-align: center;
}

:deep(.docs-page-header--center .marquee-header__actions) {
  justify-content: center;
}

@media (max-width: 720px) {
  :deep(.docs-page-header) {
    gap: 0.5rem;
  }

  .docs-header__actions {
    gap: 8px;
  }
}
</style>
