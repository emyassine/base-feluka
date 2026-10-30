export interface LoadedSiteModel {
  model: Record<string, any>
  targets: Record<string, any>
  sources: string[]
  warnings: string[]
  defaultLanguage: string
}
export function loadSiteModelSync(layout: Record<string, any>, options?: { strictI18n?: boolean }): LoadedSiteModel
