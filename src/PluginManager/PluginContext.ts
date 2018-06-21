import PluginInstance from './PluginInstance'

/*
PluginContext is used by the plkugin to interact with the core.
*/
export default class PluginContext<TConfig> {
  constructor(private instance: PluginInstance) {}
  getConfig(): TConfig {
    return this.instance.config as any
  }
}
