<script lang="ts">
import { defineComponent, Fragment, h, type PropType, type VNode } from 'vue'
import FeluqaButton from '../FeluqaButton.vue'
import reactImage0 from './assets/react-home/images/uwu.png';

const imageAssets = new Map<string, string>([
  ['/react-home/images/uwu.png', reactImage0],
])
function localizeReactAssets(value: string): string {
  for (const [source, local] of imageAssets) value = value.replaceAll(source, local)
  return value
}

type ReactDevIcon = 'arrow' | 'code' | 'framework' | 'native' | 'news'

type ReactDevAction = {
  sourceLabel: string
  label: string
  href: string
  icon?: ReactDevIcon
  style?: 'primary' | 'secondary' | 'cta'
}

type ReactDevText = {
  title?: string
  lead?: string
  detail?: string
  contentReplacements?: Record<string, string>
  actions?: ReactDevAction[]
}

type ReactDevHtmlNode =
  | { type: 'fragment'; children: ReactDevHtmlNode[] }
  | { type: 'element'; tag: string; attrs: Record<string, string | boolean>; children: ReactDevHtmlNode[] }
  | { type: 'text'; value: string }

const hero = {"type":"fragment","children":[{"type":"element","tag":"div","attrs":{"class":"mx-5 mt-12 lg:mt-24 mb-20 lg:mb-32 flex flex-col justify-center"},"children":[{"type":"element","tag":"div","attrs":{"class":"uwu-visible flex justify-center"},"children":[{"type":"element","tag":"img","attrs":{"alt":"logo by @sawaratsuki1004","data-nimg":"1","decoding":"async","height":"160","loading":"eager","src":"/react-home/images/uwu.png","style":"color:transparent","title":"logo by @sawaratsuki1004","width":"313"},"children":[]}]},{"type":"element","tag":"svg","attrs":{"class":"uwu-hidden mt-4 mb-3 text-brand dark:text-brand-dark w-24 lg:w-28 self-center text-sm me-0 flex origin-center transition-all ease-in-out","fill":"none","height":"100%","viewBox":"-10.5 -9.45 21 18.9","width":"100%","xmlns":"http://www.w3.org/2000/svg"},"children":[{"type":"element","tag":"circle","attrs":{"cx":"0","cy":"0","fill":"currentColor","r":"2"},"children":[]},{"type":"element","tag":"g","attrs":{"fill":"none","stroke":"currentColor","stroke-width":"1"},"children":[{"type":"element","tag":"ellipse","attrs":{"rx":"10","ry":"4.5"},"children":[]},{"type":"element","tag":"ellipse","attrs":{"rx":"10","ry":"4.5","transform":"rotate(60)"},"children":[]},{"type":"element","tag":"ellipse","attrs":{"rx":"10","ry":"4.5","transform":"rotate(120)"},"children":[]}]}]},{"type":"element","tag":"h1","attrs":{"class":"uwu-hidden text-5xl font-display lg:text-6xl self-center flex font-semibold leading-snug text-primary dark:text-primary-dark"},"children":[{"type":"text","value":"React"}]},{"type":"element","tag":"p","attrs":{"class":"text-4xl font-display max-w-lg md:max-w-full py-1 text-center text-secondary dark:text-primary-dark leading-snug self-center"},"children":[{"type":"text","value":"The library for web and native user interfaces"}]},{"type":"element","tag":"div","attrs":{"class":"mt-5 self-center flex gap-2 w-full sm:w-auto flex-col sm:flex-row"},"children":[{"type":"element","tag":"a","attrs":{"aria-label":"Learn React","class":"w-full sm:w-auto justify-center active:scale-[.98] transition-transform inline-flex font-bold items-center outline-none focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark leading-snug bg-link text-white dark:bg-brand-dark dark:text-gray-90 hover:bg-opacity-80 text-lg py-3 rounded-full px-4 sm:px-6","href":"https://react.dev/learn","target":"_self"},"children":[{"type":"text","value":"Learn React"}]},{"type":"element","tag":"a","attrs":{"aria-label":"API Reference","class":"w-full sm:w-auto justify-center active:scale-[.98] transition-transform inline-flex font-bold items-center outline-none focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark leading-snug text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 text-lg py-3 rounded-full px-4 sm:px-6","href":"https://react.dev/reference/react","target":"_self"},"children":[{"type":"text","value":"API Reference"}]}]}]}]} as ReactDevHtmlNode
function textContent(node: ReactDevHtmlNode): string {
  return node.type === 'text' ? node.value : node.children.map(textContent).join('')
}

function replaceElementText(root: ReactDevHtmlNode, tagName: string, replacement: string, last = false): void {
  const matches: ReactDevHtmlNode[] = []
  const visit = (node: ReactDevHtmlNode) => {
    if (node.type !== 'element') return
    if (node.tag === tagName) matches.push(node)
    node.children.forEach(visit)
  }
  visit(root)
  const node = last ? matches.at(-1) : matches[0]
  if (node?.type === 'element') node.children = [{ type: 'text', value: replacement }]
}

function replaceLead(root: ReactDevHtmlNode, replacement: string): void {
  let headingFound = false
  let leadFound = false
  const visit = (node: ReactDevHtmlNode): void => {
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

function iconNode(name: ReactDevIcon): VNode {
  const paths: Record<ReactDevIcon, string> = {
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

function renderNode(node: ReactDevHtmlNode, actions: ReactDevAction[]): VNode | string | null {
  if (node.type === 'text') return node.value
  if (node.type === 'fragment') {
    const children = node.children.map((child) => renderNode(child, actions)).filter((child): child is VNode | string => child !== null)
    return h(Fragment, null, children)
  }
  if (node.tag === 'a') {
    const label = textContent(node).replace(/\s+/g, ' ').trim()
    const action = actions.find((item) => item.sourceLabel === label || item.label === label)
    if (action) {
      const primary = action.style === 'primary'
      return h(FeluqaButton, {
        tag: 'a',
        href: action.href,
        size: 'lg',
        radius: 18,
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
  if (typeof attrs.src === 'string') attrs.src = localizeReactAssets(attrs.src)
  if (typeof attrs.href === 'string' && attrs.href.startsWith('/')) attrs.href = `https://react.dev${attrs.href}`
  const children = node.children.map((child) => renderNode(child, actions)).filter((child): child is VNode | string => child !== null)
  return h(node.tag, attrs, children)
}

function applyContentReplacements(root: ReactDevHtmlNode, replacements: Record<string, string>): void {
  if (root.type === 'text') {
    for (const [source, replacement] of Object.entries(replacements)) root.value = root.value.replaceAll(source, replacement)
    return
  }
  if (root.type === 'element') {
    for (const [name, value] of Object.entries(root.attrs)) {
      if (typeof value !== 'string') continue
      for (const [source, replacement] of Object.entries(replacements)) root.attrs[name] = value.replaceAll(source, replacement)
    }
  }
  root.children.forEach((child) => applyContentReplacements(child, replacements))
}

function renderReactDevBlock(source: ReactDevHtmlNode, text: ReactDevText, headingTag: 'h1' | 'h2' = 'h2'): VNode {
  const tree = JSON.parse(JSON.stringify(source)) as ReactDevHtmlNode
  if (text.contentReplacements) applyContentReplacements(tree, text.contentReplacements)
  if (text.title !== undefined) replaceElementText(tree, headingTag, text.title)
  if (text.lead !== undefined) replaceLead(tree, text.lead)
  if (text.detail !== undefined) replaceElementText(tree, 'p', text.detail, true)
  return h('div', { class: 'react-dev-block' }, renderNode(tree, text.actions ?? []))
}

export default defineComponent({
  name: 'ReactDevBlockHero',
  props: {
    title: { type: String, default: 'React' },
    lead: { type: String, default: 'The library for web and native user interfaces' },
    primaryLabel: { type: String, default: 'Learn React' },
    primaryHref: { type: String, default: 'https://react.dev/learn' },
    primaryIcon: String as PropType<ReactDevIcon>,
    secondaryLabel: { type: String, default: 'API Reference' },
    secondaryHref: { type: String, default: 'https://react.dev/reference/react' },
    secondaryIcon: String as PropType<ReactDevIcon>,
    contentReplacements: Object as PropType<Record<string, string>>,
  },
  setup(props) {
    return () => renderReactDevBlock(hero, {
      title: props.title, lead: props.lead,
      contentReplacements: props.contentReplacements,
      actions: [
        { sourceLabel: 'Learn React', label: props.primaryLabel, href: props.primaryHref, icon: props.primaryIcon, style: 'primary' },
        { sourceLabel: 'API Reference', label: props.secondaryLabel, href: props.secondaryHref, icon: props.secondaryIcon, style: 'secondary' },
      ],
    }, 'h1')
  }
})
</script>

<style>
.react-home{--docsearch-primary-color:#5468ff;--docsearch-text-color:#1c1e21;--docsearch-spacing:12px;--docsearch-highlight-color:var(--docsearch-primary-color);--docsearch-muted-color:#969faf;--docsearch-container-background:rgba(101,108,133,.8);--docsearch-logo-color:#5468ff;--docsearch-modal-width:560px;--docsearch-modal-height:600px;--docsearch-modal-background:#f5f6f7;--docsearch-modal-shadow:inset 1px 1px 0 0 hsla(0,0%,100%,.5),0 3px 8px 0 #555a64;--docsearch-searchbox-height:56px;--docsearch-searchbox-background:#ebedf0;--docsearch-searchbox-focus-background:#fff;--docsearch-searchbox-shadow:inset 0 0 0 2px var(--docsearch-primary-color);--docsearch-hit-height:56px;--docsearch-hit-color:#444950;--docsearch-hit-active-color:#fff;--docsearch-hit-background:#fff;--docsearch-hit-shadow:0 1px 3px 0 #d4d9e1;--docsearch-key-gradient:linear-gradient(-225deg,#d5dbe4,#f8f8f8);--docsearch-key-shadow:inset 0 -2px 0 0 #cdcde6,inset 0 0 1px 1px #fff,0 1px 2px 1px rgba(30,35,90,.4);--docsearch-key-pressed-shadow:inset 0 -2px 0 0 #cdcde6,inset 0 0 1px 1px #fff,0 1px 1px 0 rgba(30,35,90,.4);--docsearch-footer-height:44px;--docsearch-footer-background:#fff;--docsearch-footer-shadow:0 -1px 0 0 #e0e3e8,0 -3px 6px 0 rgba(69,98,155,.12)}html.dark .react-home{--docsearch-text-color:#f5f6f7;--docsearch-container-background:rgba(9,10,17,.8);--docsearch-modal-background:#15172a;--docsearch-modal-shadow:inset 1px 1px 0 0 #2c2e40,0 3px 8px 0 #000309;--docsearch-searchbox-background:#090a11;--docsearch-searchbox-focus-background:#000;--docsearch-hit-color:#bec3c9;--docsearch-hit-shadow:none;--docsearch-hit-background:#090a11;--docsearch-key-gradient:linear-gradient(-26.5deg,#565872,#31355b);--docsearch-key-shadow:inset 0 -2px 0 0 #282d55,inset 0 0 1px 1px #51577d,0 2px 2px 0 rgba(3,4,9,.3);--docsearch-key-pressed-shadow:inset 0 -2px 0 0 #282d55,inset 0 0 1px 1px #51577d,0 1px 1px 0 #0304094d;--docsearch-footer-background:#1e2136;--docsearch-footer-shadow:inset 0 1px 0 0 rgba(73,76,106,.5),0 -4px 8px 0 rgba(0,0,0,.2);--docsearch-logo-color:#fff;--docsearch-muted-color:#7f8497}@media (max-width:768px){.react-home{--docsearch-spacing:10px;--docsearch-footer-height:40px}}@keyframes fade-in{0%{opacity:0}to{opacity:1}}.react-home{--docsearch-modal-background:#fff;--docsearch-highlight-color:#087ea4;--docsearch-primary-color:#0074a6;--docsearch-container-background:rgba(52,58,70,.8);--docsearch-modal-shadow:none;--docsearch-searchbox-shadow:0 0 0 3px rgba(66,153,225,.5);--ifm-z-index-fixed:1000;--docsearch-hit-height:48px;--docsearch-searchbox-height:72px;--docsearch-footer-height:108px;--docsearch-icon-stroke-width:1.4;--hover-overlay:rgba(0,0,0,.05);--fds-animation-fade-in:cubic-bezier(0,0,1,1);--fds-animation-fade-out:cubic-bezier(0,0,1,1)}.react-home *,.react-home :after,.react-home :before{box-sizing:border-box;border:0 solid #e5e7eb}.react-home :after,.react-home :before{--tw-content:""}.react-home :host,.react-home{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}.react-home{margin:0;line-height:inherit}.react-home abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}.react-home h1,.react-home h2,.react-home h3,.react-home h4{font-size:inherit;font-weight:inherit}.react-home a{color:inherit;text-decoration:inherit}.react-home b,.react-home strong{font-weight:bolder}.react-home code,.react-home pre{font-family:Source Code Pro,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}.react-home small{font-size:80%}.react-home button,.react-home input,.react-home select{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}.react-home button,.react-home select{text-transform:none}.react-home [type=button],.react-home [type=reset],.react-home [type=submit],.react-home button{-webkit-appearance:button;background-color:transparent;background-image:none}.react-home :-moz-focusring{outline:auto}.react-home :-moz-ui-invalid{box-shadow:none}.react-home ::-webkit-inner-spin-button,.react-home ::-webkit-outer-spin-button{height:auto}.react-home [type=search]{-webkit-appearance:textfield;outline-offset:-2px}.react-home ::-webkit-search-decoration{-webkit-appearance:none}.react-home ::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}.react-home figure,.react-home h1,.react-home h2,.react-home h3,.react-home h4,.react-home p,.react-home pre{margin:0}.react-home input::-moz-placeholder,.react-home textarea::-moz-placeholder{opacity:1;color:#9ca3af}.react-home input:-ms-input-placeholder,.react-home textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}.react-home input::placeholder,.react-home textarea::placeholder{opacity:1;color:#9ca3af}.react-home [role=button],.react-home button{cursor:pointer}.react-home :disabled{cursor:default}.react-home img,.react-home svg{display:block;vertical-align:middle}.react-home img{max-width:100%;height:auto}.react-home [hidden]{display:none}@font-face{font-family:Source Code Pro;font-style:normal;font-weight:400;font-display:swap;src:url("./assets/react-home/fonts/Source-Code-Pro-Regular.woff2") format("woff2")}@font-face{font-family:Source Code Pro;font-style:normal;font-weight:700;font-display:swap;src:url("./assets/react-home/fonts/Source-Code-Pro-Bold.woff2") format("woff2")}@font-face{font-family:Optimistic Display;src:url("./assets/react-home/fonts/Optimistic_Display_W_Md.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}@font-face{font-family:Optimistic Display;src:url("./assets/react-home/fonts/Optimistic_Display_W_MdIt.woff2") format("woff2");font-weight:500;font-style:italic;font-display:swap}@font-face{font-family:Optimistic Display;src:url("./assets/react-home/fonts/Optimistic_Display_W_SBd.woff2") format("woff2");font-weight:600;font-style:normal;font-display:swap}@font-face{font-family:Optimistic Display;src:url("./assets/react-home/fonts/Optimistic_Display_W_SBdIt.woff2") format("woff2");font-weight:600;font-style:italic;font-display:swap}@font-face{font-family:Optimistic Display;src:url("./assets/react-home/fonts/Optimistic_Display_W_Bd.woff2") format("woff2");font-weight:700;font-style:normal;font-display:swap}@font-face{font-family:Optimistic Display;src:url("./assets/react-home/fonts/Optimistic_Display_W_BdIt.woff2") format("woff2");font-weight:700;font-style:italic;font-display:swap}@font-face{font-family:Optimistic Text;src:url("./assets/react-home/fonts/Optimistic_Text_W_Rg.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Optimistic Text;src:url("./assets/react-home/fonts/Optimistic_Text_W_It.woff2") format("woff2");font-weight:400;font-style:italic;font-display:swap}@font-face{font-family:Optimistic Text;src:url("./assets/react-home/fonts/Optimistic_Text_W_Md.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}@font-face{font-family:Optimistic Text;src:url("./assets/react-home/fonts/Optimistic_Text_W_MdIt.woff2") format("woff2");font-weight:500;font-style:italic;font-display:swap}@font-face{font-family:Optimistic Text;src:url("./assets/react-home/fonts/Optimistic_Text_W_Bd.woff2") format("woff2");font-weight:700;font-style:normal;font-display:swap}@font-face{font-family:Optimistic Text;src:url("./assets/react-home/fonts/Optimistic_Text_W_BdIt.woff2") format("woff2");font-weight:700;font-style:italic;font-display:swap}.react-home{color-scheme:light;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color:transparent}.react-home,.react-home{padding:0;margin:0}@media screen and (max-width:1023px){.react-home{overflow-x:hidden}}.react-home a>code{color:#087ea4!important;text-decoration:none!important}.react-home summary::-webkit-details-marker{display:none}.react-home *,.react-home :after,.react-home :before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.react-home ::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.react-home .mx-5{margin-left:1.25rem;margin-right:1.25rem}.react-home .mb-20{margin-bottom:5rem}.react-home .mb-3{margin-bottom:.75rem}.react-home .me-0{margin-inline-end:0}.react-home .mt-12{margin-top:3rem}.react-home .mt-4{margin-top:1rem}.react-home .mt-5{margin-top:1.25rem}.react-home .flex{display:flex}.react-home .inline-flex{display:inline-flex}.react-home .w-24{width:6rem}.react-home .w-full{width:100%}.react-home .max-w-lg{max-width:32rem}.react-home .origin-center{transform-origin:center}@keyframes circle{0%{transform:scale(0);stroke-width:16px}50%{transform:scale(.5);stroke-width:16px}to{transform:scale(1);stroke-width:0px}}@keyframes scale{0%{transform:scale(.8)}90%{transform:scale(1.05)}to{transform:scale(1)}}@keyframes marquee{0%{transform:translateX(0)}to{transform:translateX(-400%)}}@keyframes marquee2{0%{transform:translateX(400%)}to{transform:translateX(0)}}.react-home .flex-col{flex-direction:column}.react-home .items-center{align-items:center}.react-home .justify-center{justify-content:center}.react-home .gap-2{grid-gap:.5rem;gap:.5rem}.react-home .self-center{align-self:center}.react-home .rounded-full{border-radius:9999px}.react-home .bg-link{--tw-bg-opacity:1;background-color:rgb(8 126 164/var(--tw-bg-opacity))}.react-home .px-4{padding-left:1rem;padding-right:1rem}.react-home .py-1{padding-top:.25rem;padding-bottom:.25rem}.react-home .py-3{padding-top:.75rem;padding-bottom:.75rem}.react-home .text-center{text-align:center}.react-home .font-display{font-family:Optimistic Display,-apple-system,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.react-home .text-4xl{font-size:32px}.react-home .text-5xl{font-size:40px}.react-home .text-lg{font-size:17px}.react-home .text-sm{font-size:13px}.react-home .font-bold{font-weight:700}.react-home .font-semibold{font-weight:600}.react-home .leading-snug{line-height:1.375}.react-home .text-brand{--tw-text-opacity:1;color:rgb(8 126 164/var(--tw-text-opacity))}.react-home .text-primary{--tw-text-opacity:1;color:rgb(35 39 47/var(--tw-text-opacity))}.react-home .text-secondary{--tw-text-opacity:1;color:rgb(64 71 86/var(--tw-text-opacity))}.react-home .text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.react-home .shadow-secondary-button-stroke{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.react-home .shadow-secondary-button-stroke{--tw-shadow:inset 0 0 0 1px #bcc1cd;--tw-shadow-colored:inset 0 0 0 1px var(--tw-shadow-color)}.react-home .outline-none{outline:2px solid transparent}.react-home .outline-none{outline-offset:2px}.react-home .transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.react-home .transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.react-home .ease-in-out{transition-timing-function:cubic-bezier(.4,0,.2,1)}.react-home [class*=space-x-]:where([dir=rtl],[dir=rtl] *)>:not([hidden])~:not([hidden]){--tw-space-x-reverse:1}@keyframes fadein{0%{opacity:0}to{opacity:1}}@keyframes pulse-button{0%{transform:scale(.9)}70%{transform:scale(1)}to{transform:scale(.9)}}@keyframes pulse-shadow{0%{transform:scale(.65);opacity:1}70%{transform:scale(1);opacity:0}to{transform:scale(.65);opacity:0}}@keyframes progressbar{0%{width:0}to{width:100%}}.react-home .uwu-visible{display:none}.react-home .uwu .uwu-visible,.react-home .uwu-hidden{display:flex}.react-home .uwu .uwu-hidden{display:none}.react-home .hover\:bg-gray-40\/5:hover{background-color:rgba(120,131,155,.05)}.react-home .hover\:bg-opacity-80:hover{--tw-bg-opacity:0.8}.react-home .focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.react-home .focus\:outline-offset-2:focus{outline-offset:2px}.react-home .focus-visible\:outline:focus-visible{outline-style:solid}.react-home .focus-visible\:outline-link:focus-visible{outline-color:#087ea4}.react-home .active\:scale-\[\.98\]:active{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.react-home .active\:scale-\[\.98\]:active{--tw-scale-x:.98;--tw-scale-y:.98}.react-home .active\:bg-gray-40\/10:active{background-color:rgba(120,131,155,.1)}@keyframes shimmer{to{content:var(--tw-content);transform:translateX(100%)}}.react-home :is(html.dark .react-home .dark\:bg-brand-dark){--tw-bg-opacity:1;background-color:rgb(88 196 220/var(--tw-bg-opacity))}.react-home :is(html.dark .react-home .dark\:text-brand-dark){--tw-text-opacity:1;color:rgb(88 196 220/var(--tw-text-opacity))}.react-home :is(html.dark .react-home .dark\:text-gray-90){--tw-text-opacity:1;color:rgb(35 39 47/var(--tw-text-opacity))}.react-home :is(html.dark .react-home .dark\:text-primary-dark){--tw-text-opacity:1;color:rgb(246 247 249/var(--tw-text-opacity))}.react-home :is(html.dark .react-home .dark\:shadow-secondary-button-stroke-dark){--tw-shadow:inset 0 0 0 1px #4e5769;--tw-shadow-colored:inset 0 0 0 1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.react-home :is(html.dark .react-home .hover\:dark\:bg-gray-60\/5):hover{background-color:rgba(78,87,105,.05)}.react-home :is(html.dark .react-home .focus-visible\:dark\:focus\:outline-link-dark:focus):focus-visible{outline-color:#58c4dc}.react-home :is(html.dark .react-home .active\:dark\:bg-gray-60\/10):active{background-color:rgba(78,87,105,.1)}@media (min-width:640px){.react-home .sm\:w-auto{width:auto}.react-home .sm\:flex-row{flex-direction:row}.react-home .sm\:px-6{padding-left:1.5rem;padding-right:1.5rem}}@media (min-width:768px){.react-home .md\:max-w-full{max-width:100%}}@media (min-width:1024px){.react-home .lg\:mb-32{margin-bottom:8rem}.react-home .lg\:mt-24{margin-top:6rem}.react-home .lg\:w-28{width:7rem}@keyframes large-marquee{0%{transform:translateX(0)}to{transform:translateX(-200%)}}@keyframes large-marquee2{0%{transform:translateX(200%)}to{transform:translateX(0)}}.react-home .lg\:text-6xl{font-size:52px}}@keyframes cubeRotate{0%{transform:rotateX(-25.5deg) rotateY(45deg)}to{transform:rotateX(-25.5deg) rotateY(405deg)}}@keyframes fadeIn{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.react-home .react-dev-action { text-decoration: none; font-weight: 700; }
.react-home .react-dev-action--hero,
.react-home .react-dev-action--cta { box-sizing: border-box; min-height: 2.75rem; align-items: center; }
.react-home .react-dev-action--hero { width: 100%; flex: 0 0 auto; justify-content: center; }
.react-home .react-dev-action--cta { margin-top: 2.5rem; }
@media (min-width: 640px) {
  .react-home .react-dev-action--hero { width: max-content !important; flex: 0 0 auto; }
}
</style>
