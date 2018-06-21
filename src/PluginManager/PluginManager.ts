import log from 'npmlog'
import { Facegram } from './../Facegram'
import PluginInstance from './PluginInstance'
import PluginConfig from './PluginConfig'

export default class PluginManager {
  loadedPlugins: PluginInstance[] = []

  constructor(public facegram: Facegram) {}

  async loadPluginsFromConfig() {
    const pluginsConfig: PluginConfig<
      any
    >[] = this.facegram.config.getPluginsConfig()

    for (const pc of pluginsConfig) {
      let pkg
      try {
        pkg = require(pc.package)
        if (typeof pkg.default !== 'function') {
          throw new Error("Plugin's default export must be a constructor")
        }
      } catch (e) {
        log.error(`Failed to load plugin package ${pc.package}`, e)
        continue
      }
      const inst = new PluginInstance(this, pc)
      this.loadedPlugins.push(inst)
      await inst.initialize()
    }
  }
}
