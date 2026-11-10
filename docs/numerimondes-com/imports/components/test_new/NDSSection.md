# Example

```html
<NDSSection
  eyebrow="SCHEMAS"
  title="Rate limiting"
  description="Prevent abuse by limiting the number of requests per period"
  icon="lucide:shield"
  :aside="false"
  :collapsible="true"
  :persist-collapsed="true"
  id="rate-limiting"
  :after-header="[
    { label: 'Docs', href: '/docs', variant: 'blackwhite', icon: 'lucide:arrow-up-right' }
  ]"
  :footer="[
    { label: 'Save', variant: 'primary', icon: 'lucide:check' },
    { label: 'Cancel', variant: 'secondary' }
  ]"
>
  <div style="display:grid; gap: 12px; grid-template-columns: repeat(var(--nds-section-columns), minmax(0, 1fr));">
    <input class="" style="padding: 12px;">Any content</input>
    <input class="" style="padding: 12px;">Any content</input>
  </div>
</NDSSection>
```
