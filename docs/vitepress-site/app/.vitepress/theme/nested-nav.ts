import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import { useRoute } from 'vitepress'

type MenuItem = {
  text: string
  link?: string
  activeMatch?: string
  target?: string
  rel?: string
  items?: MenuItem[]
}

export default defineComponent({
  name: 'SpmpstNestedNav',
  props: {
    item: { type: Object as PropType<MenuItem>, required: true },
  },
  setup(props) {
    const route = useRoute()
    const root = ref<HTMLElement>()
    const open = ref(false)
    const expanded = ref(new Set<string>())
    const isCurrent = (item: MenuItem) => {
      if (item.activeMatch) {
        try { return new RegExp(item.activeMatch).test(route.path) } catch { return false }
      }
      return Boolean(item.link && route.path === item.link)
    }
    const containsCurrent = (item: MenuItem): boolean => isCurrent(item) || Boolean(item.items?.some(containsCurrent))
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !root.value?.contains(event.target)) {
        open.value = false
        expanded.value = new Set()
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        open.value = false
        expanded.value = new Set()
      }
    }
    watch(() => route.path, () => {
      open.value = false
      expanded.value = new Set()
    })
    onMounted(() => {
      document.addEventListener('click', closeOnOutsideClick)
      document.addEventListener('keydown', closeOnEscape)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    })

    const renderItems = (items: MenuItem[], path = 'root'): any => h('ul', { class: 'spmpst-nav-list' }, items.map((item, index) => {
      const key = `${path}.${index}`
      const children = item.items ?? []
      const isExpanded = expanded.value.has(key)
      if (children.length) {
        return h('li', {
          class: ['spmpst-nav-entry', 'spmpst-nav-branch', containsCurrent(item) && 'is-active'],
          key,
          onMouseleave: () => {
            const next = new Set(expanded.value)
            for (const entry of next) if (entry === key || entry.startsWith(`${key}.`)) next.delete(entry)
            expanded.value = next
          },
          onFocusout: (event: FocusEvent) => {
            if (event.currentTarget instanceof HTMLElement && (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node))) {
              const next = new Set(expanded.value)
              for (const entry of next) if (entry === key || entry.startsWith(`${key}.`)) next.delete(entry)
              expanded.value = next
            }
          },
        }, [
          h('button', {
            class: ['spmpst-nav-row', 'spmpst-nav-branch-button', containsCurrent(item) && 'is-active'],
            type: 'button',
            'aria-expanded': String(isExpanded),
            onMouseenter: () => {
              const next = new Set(expanded.value)
              next.add(key)
              expanded.value = next
            },
            onFocus: () => {
              const next = new Set(expanded.value)
              next.add(key)
              expanded.value = next
            },
            onClick: () => {
              const next = new Set(expanded.value)
              if (next.has(key)) next.delete(key)
              else next.add(key)
              expanded.value = next
            },
          }, [
            h('span', { class: 'spmpst-nav-label', innerHTML: item.text }),
            h('span', { class: 'vpi-chevron-down text-icon', 'aria-hidden': 'true' }),
          ]),
          isExpanded ? renderItems(children, key) : null,
        ])
      }
      return h('li', { class: ['spmpst-nav-entry', isCurrent(item) && 'is-active'], key }, [
        h('a', {
          class: ['spmpst-nav-row', 'spmpst-nav-link', isCurrent(item) && 'is-active'],
          href: item.link,
          target: item.target,
          rel: item.rel,
          onClick: () => {
            open.value = false
            expanded.value = new Set()
          },
        }, [h('span', { class: 'spmpst-nav-label', innerHTML: item.text })]),
      ])
    }))

    return () => h('div', {
      ref: root,
      class: ['spmpst-nested-nav', open.value && 'is-open', containsCurrent(props.item) && 'is-active'],
      onMouseenter: () => { open.value = true },
      onMouseleave: () => {
        open.value = false
        expanded.value = new Set()
      },
      onFocusin: () => { open.value = true },
      onFocusout: (event: FocusEvent) => {
        if (event.relatedTarget instanceof Node && !root.value?.contains(event.relatedTarget)) {
          open.value = false
          expanded.value = new Set()
        }
      },
    }, [
      h('button', {
        class: ['spmpst-nested-nav-trigger', containsCurrent(props.item) && 'is-active'],
        type: 'button',
        'aria-haspopup': 'true',
        'aria-expanded': String(open.value),
        onClick: () => { open.value = !open.value },
      }, [
        h('span', { innerHTML: props.item.text }),
        h('span', { class: 'vpi-chevron-down text-icon', 'aria-hidden': 'true' }),
      ]),
      open.value ? h('div', { class: 'spmpst-nested-nav-panel' }, [renderItems(props.item.items ?? [])]) : null,
    ])
  },
})
