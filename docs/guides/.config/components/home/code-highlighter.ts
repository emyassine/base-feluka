import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import javascript from '@shikijs/langs/javascript'
import jsx from '@shikijs/langs/jsx'
import rust from '@shikijs/langs/rust'
import toml from '@shikijs/langs/toml'
import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'

let highlighter: ReturnType<typeof createHighlighterCore> | undefined

function getHighlighter(): ReturnType<typeof createHighlighter> {
  highlighter ??= createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: [rust, toml, javascript, jsx],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

const supportedLanguages = new Set(['rust', 'toml', 'javascript', 'jsx'])

function wrapCode(pre: string, source: string, language: string): string {
  const lineCount = source.split('\n').length
  const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1).join('\n')
  return `<div class="language-${language} vp-adaptive-theme line-numbers-mode" style="margin:0;border-radius:0"><div class="line-numbers-wrapper" style="white-space:pre;padding-top:0" aria-hidden="true">${lineNumbers}</div>${pre}</div>`
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

/** VitePress-shaped source shown during SSR and before client highlighting is ready. */
export function plainCode(source: string, requestedLanguage: string): string {
  const language = supportedLanguages.has(requestedLanguage) ? requestedLanguage : 'text'
  const lines = source.split('\n').map((line) => `<span class="line">${escapeHtml(line) || ' '}</span>`).join('')
  return wrapCode(`<pre class="vp-code" style="padding:0"><code>${lines}</code></pre>`, source, language)
}

/** Highlight injected source with the same Shiki themes VitePress uses for Markdown fences. */
export async function highlightCode(source: string, requestedLanguage: string): Promise<string> {
  const language = supportedLanguages.has(requestedLanguage) ? requestedLanguage : 'text'
  const engine = await getHighlighter()
  const html = engine.codeToHtml(source, {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
  }).replace('<pre class="shiki shiki-themes github-light github-dark"', '<pre class="vp-code shiki shiki-themes github-light github-dark"')
    .replace(/<pre class="vp-code shiki shiki-themes github-light github-dark" style="([^"]*)"/, '<pre class="vp-code shiki shiki-themes github-light github-dark" style="$1;padding:0"')
  return wrapCode(html, source, language)
}
