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

export async function highlightCodeWithShiki(source: string, language: string): Promise<string> {
  const engine = await getHighlighter()
  return engine.codeToHtml(source, {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
  }).replace('<pre class="shiki shiki-themes github-light github-dark"', '<pre class="vp-code shiki shiki-themes github-light github-dark"')
    .replace(/<pre class="vp-code shiki shiki-themes github-light github-dark" style="([^"]*)"/, '<pre class="vp-code shiki shiki-themes github-light github-dark" style="$1;padding:0"')
}
