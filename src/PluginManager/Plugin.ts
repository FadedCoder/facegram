import PluginContext from './PluginContext'

export default interface Plugin<TConfig> {
  readonly pluginTypeName: string
  constructor(ctx: PluginContext<TConfig>)
  initialize(): Promise<void>
  dispose(): Promise<void>
}
