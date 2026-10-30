import { join, resolve } from 'node:path'

export function createPreparationContext(siteDirectory, sourceState, contentState) {
  return { siteDirectory, ...sourceState, ...contentState }
}

export function assertIndexPath(ctx) {
  const configuredIndex = resolve(ctx.configDirectory, ctx.config.indexPath)
  const configuredIndexOutput = join(ctx.outputDirectory, ...(ctx.prefixDefaultLanguage ? [ctx.defaultLanguage.toLowerCase()] : []), 'index.md')
  if (!ctx.routeMap.has(configuredIndex) || ctx.routeMap.get(configuredIndex) !== configuredIndexOutput) {
    throw new Error(`indexPath must point to the guides root index, which is compiled to index.md: ${ctx.config.indexPath}`)
  }
}
