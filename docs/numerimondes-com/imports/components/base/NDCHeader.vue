<template>
  <div
    v-if="eyebrow || title || subtitle || hasActions"
    :class="['ndc-header-header', headerAlignClass, headerClass]"
    :style="headerStyle"
    v-bind="attrs"
  >
    <div class="ndc-header-header__content">
      <span v-if="eyebrow" :class="['eyebrow', eyebrowClass]" :style="{ ...eyebrowStyle, marginBottom: '0' }">
        {{ eyebrow }}
      </span>

      <h2 v-if="title" :class="['ndc-header-title', titleClass]" :style="{ ...titleStyle, paddingTop: '0' }">
        {{ title }}
      </h2>

      <p v-if="subtitle" class="subtitle" v-html="subtitle"></p>
    </div>

    <div
      v-if="hasActions"
      :class="['ndc-header-header__actions', actionsAlignClass, actionsClass]"
      :style="actionsStyle"
    >
      <slot name="actions">
        <NDCButton
          v-for="(action, i) in resolvedActions"
          :key="`action-${i}`"
          :class="[actionsButtonClass, action.buttonClass]"
          :style="[actionsButtonStyle, action.buttonStyle]"
          :tag="action.tag"
          :href="action.href"
          :variant="action.variant ?? 'blackwhite'"
          :size="action.size ?? 'md'"
          :rounded="action.rounded"
          :pill="action.pill ?? true"
          :block="action.block"
          :disabled="action.disabled"
          :icon="action.icon"
          :icon-position="action.iconPosition ?? 'right'"
          :type="action.type"
          v-bind="action.buttonAttrs"
        >
          {{ action.label }}
        </NDCButton>
      </slot>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import NDCButton from './NDCButton.vue';

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();
const slots = useSlots();

export interface MarqueeAction {
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
  tag?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  pill?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  buttonClass?: string;
  buttonStyle?: Record<string, any>;
  buttonAttrs?: Record<string, any>;
}

const props = withDefaults(
  defineProps<{
    // Header
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    headerAlign?: 'center' | 'left';

    // Actions
    actions?: MarqueeAction[];
    actionsAlign?: 'left' | 'right';
    actionsClass?: string;
    actionsStyle?: Record<string, any>;
    actionsButtonClass?: string;
    actionsButtonStyle?: Record<string, any>;

    // Legacy actions
    buttonLabel1?: string;
    buttonLabel2?: string;
    buttonIcon1?: string;
    buttonIcon2?: string;
    buttonIconPosition1?: 'left' | 'right';
    buttonIconPosition2?: 'left' | 'right';
    buttonHref1?: string;
    buttonHref2?: string;
    buttonVariant1?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
    buttonVariant2?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
    buttonSize1?: 'sm' | 'md' | 'lg';
    buttonSize2?: 'sm' | 'md' | 'lg';

    headerClass?: string;
    headerStyle?: Record<string, any>;
    eyebrowClass?: string;
    eyebrowStyle?: Record<string, any>;
    titleClass?: string;
    titleStyle?: Record<string, any>;
  }>(),
  {}
);

const resolvedActions = computed<MarqueeAction[]>(() => {
  if (props.actions?.length) return props.actions;
  const out: MarqueeAction[] = [];
  if (props.buttonLabel1) {
    out.push({
      label: props.buttonLabel1,
      icon: props.buttonIcon1,
      iconPosition: props.buttonIconPosition1,
      href: props.buttonHref1,
      variant: props.buttonVariant1,
      size: props.buttonSize1,
    });
  }
  if (props.buttonLabel2) {
    out.push({
      label: props.buttonLabel2,
      icon: props.buttonIcon2,
      iconPosition: props.buttonIconPosition2,
      href: props.buttonHref2,
      variant: props.buttonVariant2,
      size: props.buttonSize2,
    });
  }
  return out;
});

const hasActions = computed(() => resolvedActions.value.length > 0 || Boolean(slots.actions) || Boolean(slots.default));
const headerAlignClass = computed(() => ((props.headerAlign ?? 'center') === 'left' ? 'is-left' : 'is-center'));
const actionsAlignClass = computed(() =>
  (props.actionsAlign ?? 'right') === 'left' ? 'actions-left' : 'actions-right'
);
</script>

<style scoped>
/* Header */
.ndc-header-header {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.ndc-header-header.is-center {
  text-align: center;
}
.ndc-header-header.is-left {
  text-align: left;
  align-items: flex-start;
}
.ndc-header-header__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: inherit;
}
.ndc-header-header.is-left .ndc-header-header__content {
  align-items: flex-start;
}
.ndc-header-header__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.ndc-header-header.is-left .ndc-header-header__actions {
  margin-left: auto;
}
.ndc-header-header__actions.actions-right {
  justify-content: flex-end;
}
.ndc-header-header__actions.actions-left {
  justify-content: flex-start;
}
.ndc-header-title {
  margin: 0 !important;
  font-weight: 400 !important;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.15;
}

@media (max-width: 720px) {
  .ndc-header-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .ndc-header-header__content {
    align-items: flex-start;
  }
  .ndc-header-header.is-center .ndc-header-header__content {
    align-items: center;
  }
  .ndc-header-header__actions {
    justify-content: flex-start;
    margin-left: 0;
    gap: 8px;
  }
  .ndc-header-header.is-center .ndc-header-header__actions {
    justify-content: center;
  }
  .ndc-header-title {
    font-size: clamp(22px, 5vw, 30px);
    line-height: 1.2;
  }
  .subtitle {
    font-size: 14px !important;
    line-height: 1.45;
  }
}

.subtitle {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  max-width: 64ch;
  color: var(--vp-c-text-2);
}
</style>
