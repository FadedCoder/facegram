import PluginState from './PluginState'
import PluginManager from './PluginManager'
import Plugin from './Plugin'
import PluginContext from './PluginContext'
import log from 'npmlog'
import PluginConfig from './PluginConfig'

type PluginConstructor = {
  new (ctx: PluginContext<any>): Plugin<any>
}
/*
PluginInstance is used by the core to manage the plugin.
*/
export default class PluginInstance {
  constructor(
    public pluginManager: PluginManager,
    public config: PluginConfig<any>,
  ) {}
  /**
   * Initializes the plugin using a constructor.
   */
  async initialize(pluginConstructor: PluginConstructor) {
    this.pluginContext = new PluginContext(this)
    this.state = PluginState.INITIALIZING
    try {
      this.pluginObject = new pluginConstructor(this.pluginContext)
    } catch (e) {
      this.state = PluginState.ERROR
      log.error(
        'plugin',
        `An error has occured while constructing plugin ${
          this.config.name
        } (from package ${this.config.package})`,
        e,
      )
      return
    }
    try {
      await this.pluginObject.initialize()
      this.state = PluginState.RUNNING
    } catch (e) {
      this.state = PluginState.ERROR
      log.error(
        'plugin',
        `An error has occured while initializing plugin ${
          this.config.name
        } (from package ${this.config.package})`,
        e,
      )
      return
    }
  }

  async dispose() {
    try {
      this.state = PluginState.DISPOSING
      await this.pluginObject.dispose()
      this.state = PluginState.DISPOSED
    } catch (e) {
      this.state = PluginState.ERROR
      log.error(
        'plugin',
        `An error has occured while disposing plugin ${
          this.config.name
        } (from package ${this.config.package})`,
        e,
      )
      return
    }
  }
  state: PluginState = PluginState.READY
  pluginObject: Plugin<any>
  pluginContext: PluginContext<any>
}
