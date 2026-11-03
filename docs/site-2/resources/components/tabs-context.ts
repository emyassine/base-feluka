import type { ComputedRef, InjectionKey } from 'vue'

export type TabsMode = 'switch' | 'navigation'
export type TabsAlignment = 'start' | 'center' | 'end' | 'stretch'
export type TabsPreset = 'default' | 'rounded' | 'headless'

export interface TabsContext {
  id: string
  mode: ComputedRef<TabsMode>
  preset: ComputedRef<TabsPreset>
  activeValue: ComputedRef<string | undefined>
  select: (value: string) => void
  isActive: (value: string) => boolean
  tabId: (value: string) => string
  panelId: (value: string) => string
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('FeluqaTabs')

export function tabsKey(value: string): string {
  return encodeURIComponent(value).replace(/%/g, '_')
}
