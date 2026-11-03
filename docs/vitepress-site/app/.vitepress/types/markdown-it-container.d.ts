declare module 'markdown-it-container' {
  import MarkdownIt = require('markdown-it')

  const markdownItContainer: MarkdownIt.PluginWithOptions<string>
  export default markdownItContainer
}
