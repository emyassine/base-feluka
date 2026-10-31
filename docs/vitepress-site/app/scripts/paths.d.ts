export interface SpmpstPaths {
  root: string
  config: string
  guides: string
  collections: string
  resources: string
  sharedResources: string
  assets: string
  components: string
  diagrams: string
  hooks: string
  media: string
  schemas: string
  public: string
  icons: string
  flags: string
  mermaidConfig: string
  toolchain: string
  output: string
  configFiles: Record<string, string>
  finalOutput: string
  stage: string | null
  declaration: string
  appDirectory: string
  scratch: string
  generatedProject: string
  generatedGuides: string
  generatedMetadata: string
  vitepressCache: string
  mermaidCache: string
  buildLock: string
}
export type SitePaths = SpmpstPaths
export function resolveSitePaths(appDirectory: string): SpmpstPaths
