<script lang="ts">
import { defineComponent, Fragment, h, type PropType, type VNode } from 'vue'
import FeluqaButton from '../FeluqaButton.vue'
import { localizeReactAssets } from './react-home-assets'
import hero from './react-blocks/hero.json'
import components from './react-blocks/components.json'
import markup from './react-blocks/markup.json'
import interactivity from './react-blocks/interactivity.json'
import framework from './react-blocks/framework.json'
import platforms from './react-blocks/platforms.json'
import updates from './react-blocks/updates.json'
import community from './react-blocks/community.json'

type IconName = 'arrow' | 'code' | 'framework' | 'native' | 'news'
type Action = {
  sourceLabel: string
  label: string
  href: string
  icon?: IconName
  style?: 'primary' | 'secondary' | 'cta'
}
type HtmlNode = { type: 'fragment'; children: HtmlNode[] } | { type: 'element'; tag: string; attrs: Record<string, string | boolean>; children: HtmlNode[] } | { type: 'text'; value: string }
type BlockName = 'hero' | 'components' | 'markup' | 'interactivity' | 'framework' | 'platforms' | 'updates' | 'community'

const contentByBlock: Record<BlockName, HtmlNode> = { hero, components, markup, interactivity, framework, platforms, updates, community }

function textContent(node: HtmlNode): string {
  return node.type === 'text' ? node.value : node.children.map(textContent).join('')
}

function replaceElementText(root: HtmlNode, tagName: string, replacement: string, last = false): void {
  const matches: HtmlNode[] = []
  const visit = (node: HtmlNode) => {
    if (node.type === 'element') {
      if (node.tag === tagName) matches.push(node)
      node.children.forEach(visit)
    }
  }
  visit(root)
  const node = last ? matches.at(-1) : matches[0]
  if (node?.type === 'element') node.children = [{ type: 'text', value: replacement }]
}

function replaceLead(root: HtmlNode, replacement: string): void {
  let headingFound = false
  let leadFound = false
  const visit = (node: HtmlNode): void => {
    if (node.type !== 'element' || leadFound) return
    if (node.tag === 'h1' || node.tag === 'h2') headingFound = true
    else if (headingFound && node.tag === 'p') {
      node.children = [{ type: 'text', value: replacement }]
      leadFound = true
      return
    }
    node.children.forEach(visit)
  }
  visit(root)
}

function iconNode(name: IconName): VNode {
  const paths: Record<IconName, string> = {
    arrow: 'M4 12h15M13 5l7 7-7 7',
    code: 'm8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14',
    framework: 'M12 4v6m8 2h-6m-2 8v-6m-8-2h6',
    native: 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 14h4',
    news: 'M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h5',
  }
  const children: VNode[] = [h('path', { d: paths[name] })]
  if (name === 'framework') children.unshift(h('circle', { cx: '12', cy: '12', r: '8' }), h('circle', { cx: '12', cy: '12', r: '2' }))
  if (name === 'news') children[0] = h('path', { d: 'M4 4h16v16H4z' }), children.push(h('path', { d: 'M8 8h8m-8 4h8m-8 4h5' }))
  return h('svg', { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, children)
}

export default defineComponent({
  name: 'ReactDevMarkup',
  props: {
    block: { type: String as PropType<BlockName>, required: true },
    title: String,
    lead: String,
    detail: String,
    actions: { type: Array as PropType<Action[]>, default: () => [] },
  },
  setup(props) {
    function renderNode(node: HtmlNode, actions: Action[]): VNode | string | null {
      if (node.type === 'text') return node.value
      if (node.type === 'fragment') {
        const children = node.children.map((child) => renderNode(child, actions)).filter((child): child is VNode | string => child !== null)
        return h(Fragment, null, children)
      }
      if (node.tag === 'a') {
        const label = textContent(node).replace(/\s+/g, ' ').trim()
        const action = actions.find((item) => item.sourceLabel === label)
        if (action) {
          const primary = action.style === 'primary'
          return h(FeluqaButton, {
            tag: 'a',
            href: action.href,
            size: 'lg',
            radius: 999,
            color: primary ? 'primary' : 'gray',
            outlined: !primary,
            iconPosition: action.style === 'cta' ? 'before' : 'after',
            class: action.style === 'cta' ? 'react-dev-action react-dev-action--cta' : 'react-dev-action react-dev-action--hero',
            'aria-label': action.label,
          }, {
            default: () => action.label,
            ...(action.icon ? { icon: () => iconNode(action.icon!) } : {}),
          })
        }
      }
      const attrs = { ...node.attrs }
      if (attrs.src && typeof attrs.src === 'string') attrs.src = localizeReactAssets(attrs.src)
      if (attrs.href && typeof attrs.href === 'string' && attrs.href.startsWith('/')) attrs.href = `https://react.dev${attrs.href}`
      const children = node.children.map((child) => renderNode(child, actions)).filter((child): child is VNode | string => child !== null)
      return h(node.tag, attrs, children)
    }

    return () => {
      const tree = JSON.parse(JSON.stringify(contentByBlock[props.block])) as HtmlNode
      const titleTag = props.block === 'hero' ? 'h1' : 'h2'
      if (props.title !== undefined) replaceElementText(tree, titleTag, props.title)
      if (props.lead !== undefined) replaceLead(tree, props.lead)
      if (props.detail !== undefined) replaceElementText(tree, 'p', props.detail, true)
      return h('div', { class: 'react-dev-block' }, renderNode(tree, props.actions))
    }
  },
})
</script>

<style>
.react-dev-action { text-decoration: none; font-weight: 700; }
.react-dev-action--hero { width: 100%; justify-content: center; }
.react-dev-action--cta { margin-top: 2.5rem; }
@media (min-width: 640px) { .react-dev-action--hero { width: auto; } }
</style>
