# UniversalMarquee Component - Usage Examples

## Basic Usage

```vue
<UniversalMarquee
  title="Industries we serve"
  eyebrow="Industries"
  :items="industries"
/>
```

## Multiple Rows with Different Directions

```vue
<UniversalMarquee
  title="Our Partners"
  :row-count="3"
  :items="partners"
/>
<!-- Row 1: left, Row 2: right, Row 3: left (auto-alternating) -->
```

## Manual Row Configuration

```vue
<UniversalMarquee
  title="Tech Stack"
  :items="technologies"
  :rows="[
    { speed: 30, direction: 'left', skew: 2 },
    { speed: 40, direction: 'right', skew: -2 },
    { speed: 35, direction: 'left', skew: 1 }
  ]"
/>
```

## Mobile-Only Skew (2 rows)

```vue
<UniversalMarquee
  title="Features"
  :row-count="2"
  :items="features"
  :skew-mobile="3"
  :skew-desktop="0"
/>
```

## Desktop-Only Skew

```vue
<UniversalMarquee
  title="Services"
  :items="services"
  :skew-mobile="0"
  :skew-desktop="-2"
/>
```

## Different Skew Per Device + Per Row

```vue
<UniversalMarquee
  :items="items"
  :rows="[
    { skewMobile: 4, skewDesktop: 0 },
    { skewMobile: -4, skewDesktop: 0 },
    { skewMobile: 0, skewDesktop: 2 }
  ]"
/>
```

## Custom Shapes

```vue
<!-- Pill (default) -->
<UniversalMarquee :items="items" item-shape="pill" />

<!-- Rounded -->
<UniversalMarquee :items="items" item-shape="rounded" />

<!-- Square -->
<UniversalMarquee :items="items" item-shape="square" />

<!-- Custom radius -->
<UniversalMarquee
  :items="items"
  item-shape="custom"
  item-border-radius="8px"
/>
```

## Fade Configuration

```vue
<!-- No fade -->
<UniversalMarquee :items="items" :fade="false" />

<!-- Custom fade color and range -->
<UniversalMarquee
  :items="items"
  :fade="{ enabled: true, color: '#1a1a1a', start: 2, end: 10 }"
/>

<!-- Per-row fade -->
<UniversalMarquee
  :items="items"
  :rows="[
    { fade: true, fadeColor: '#000', fadeStart: 0, fadeEnd: 8 },
    { fade: false }
  ]"
/>
```

## Custom Styling with Class Injection

```vue
<UniversalMarquee
  :items="items"
  root-class="my-marquee"
  header-class="custom-header"
  row-class="custom-row"
  item-class="glassmorphism"
  icon-class="icon-glow"
  item-title-class="font-bold"
/>
```

## Style Object Injection

```vue
<UniversalMarquee
  :items="items"
  :root-style="{ padding: '4rem 0' }"
  :header-style="{ marginBottom: '3rem' }"
  :list-style="{ gap: '24px' }"
  :icon-style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
  :item-title-style="{ color: '#fff', fontSize: '20px' }"
/>
```

## Per-Item Custom Styling

```vue
<UniversalMarquee
  :items="[
    {
      title: 'Premium',
      icon: 'Crown',
      class: 'premium-item',
      style: { background: 'gold', color: '#000' },
      iconClass: 'premium-icon',
      titleStyle: { fontWeight: 800 }
    },
    { title: 'Standard', icon: 'Star' }
  ]"
/>
```

## Responsive Heights

```vue
<UniversalMarquee
  :items="items"
  :item-height="56"
  :item-height-mobile="48"
  :item-height-desktop="64"
  :gap="16"
  :gap-mobile="12"
  :gap-desktop="20"
/>
```

## Background Options

```vue
<!-- Image -->
<UniversalMarquee
  :items="items"
  bg-image="/path/to/bg.png"
/>

<!-- Gradient -->
<UniversalMarquee
  :items="items"
  bg-gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
/>

<!-- Solid color -->
<UniversalMarquee
  :items="items"
  bg-color="#1a1a1a"
/>
```

## Custom Attributes (v-bind, x-data, etc.)

```vue
<UniversalMarquee
  :items="items"
  :root-attrs="{
    'data-section': 'partners',
    'x-data': '{ visible: true }',
    'x-show': 'visible'
  }"
  :rows="[
    {
      attrs: {
        'data-row': '1',
        'x-intersect': 'onIntersect'
      }
    }
  ]"
/>
```

## Custom Item Rendering with Slots

```vue
<UniversalMarquee :items="items">
  <template #item="{ item, index, row }">
    <div class="custom-item">
      <img :src="item.logo" :alt="item.title" />
      <span>{{ item.title }}</span>
      <span class="badge">{{ item.count }}</span>
    </div>
  </template>
</UniversalMarquee>
```

## Custom Icon Slot

```vue
<UniversalMarquee :items="items">
  <template #icon="{ item }">
    <img :src="item.customIcon" class="w-6 h-6" />
  </template>
</UniversalMarquee>
```

## Custom Header/Footer

```vue
<UniversalMarquee :items="items">
  <template #header>
    <div class="fancy-header">
      <h1>Custom Header</h1>
      <p>With any content</p>
    </div>
  </template>

  <template #footer>
    <button>View All</button>
  </template>
</UniversalMarquee>
```

## Alpine.js Integration (x-cloak, x-show, etc.)

```vue
<UniversalMarquee
  :items="items"
  :root-attrs="{
    'x-data': '{ show: false }',
    'x-init': '$nextTick(() => show = true)',
    'x-show': 'show',
    'x-cloak': true
  }"
/>
```

## Complex Real-World Example

```vue
<UniversalMarquee
  title="Global Partners"
  eyebrow="Trusted by 1000+ companies"

  :items="partners"

  :rows="[
    {
      speed: 35,
      direction: 'left',
      skewMobile: 3,
      skewDesktop: 0,
      fade: true,
      fadeColor: '#000',
      class: 'row-premium'
    },
    {
      speed: 45,
      direction: 'right',
      skewMobile: -3,
      skewDesktop: 0,
      fade: true
    },
    {
      speed: 40,
      direction: 'left',
      skewMobile: 0,
      skewDesktop: 1.5,
      fade: true,
      fadeStart: 5,
      fadeEnd: 12
    }
  ]"

  item-shape="rounded"
  item-background="rgba(255, 255, 255, 0.05)"
  item-border="1px solid rgba(255, 255, 255, 0.1)"

  :item-height="60"
  :item-height-mobile="50"
  :item-height-desktop="70"

  :gap="20"
  :gap-mobile="12"
  :gap-desktop="24"

  bg-gradient="linear-gradient(180deg, #000 0%, #1a1a1a 100%)"

  root-class="partners-section"
  header-class="text-center mb-8"
  item-class="partner-card"
  icon-class="partner-icon"

  :root-style="{ padding: '6rem 0' }"
  :icon-style="{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }"

  :root-attrs="{
    'data-section': 'partners',
    'x-data': '{ loaded: false }',
    'x-init': 'setTimeout(() => loaded = true, 100)',
    'x-show': 'loaded',
    'x-transition': true
  }"
>
  <template #item="{ item, index }">
    <div class="flex items-center gap-3">
      <img :src="item.logo" :alt="item.title" class="w-8 h-8 rounded-full" />
      <div>
        <h3 class="font-bold">{{ item.title }}</h3>
        <p class="text-xs opacity-70">{{ item.category }}</p>
      </div>
    </div>
  </template>
</UniversalMarquee>
```

## TypeScript Support

```typescript
import { MarqueeItem, MarqueeRow, FadeConfig } from './UniversalMarquee.vue';

const items: MarqueeItem[] = [
  {
    title: 'Tech',
    icon: 'Cpu',
    class: 'tech-item',
    style: { background: '#3b82f6' }
  }
];

const rows: MarqueeRow[] = [
  {
    speed: 40,
    direction: 'left',
    skew: 2,
    fade: true,
    fadeColor: '#000'
  }
];

const fadeConfig: FadeConfig = {
  enabled: true,
  color: '#1a1a1a',
  start: 0,
  end: 10
};
```

## CSS Custom Properties Available

The component exposes these CSS variables that can be overridden:

```css
.universal-marquee {
  --pad-x: 16px;
  --pad-x-mobile: 16px;
  --pad-x-desktop: 16px;
  --marquee-duration: 42s;
  --marquee-dir: normal;
  --skew-mobile: 0deg;
  --skew-desktop: 0deg;
  --item-h: 56px;
  --item-h-mobile: 56px;
  --item-h-desktop: 56px;
  --gap: 16px;
  --gap-mobile: 16px;
  --gap-desktop: 16px;
}
```
