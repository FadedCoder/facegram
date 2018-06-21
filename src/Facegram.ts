import { FacegramConfig } from './FacegramConfig'
import { IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { FacegramService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { ExchangeManager } from './ExchangeManager'
import PluginManager from './PluginManager/PluginManager';

export class Facegram {
  config: FacegramConfig
  exchangeManager: ExchangeManager
  pluginManager = new PluginManager()
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IFacegramMessage>

  constructor() {
    this.config = new FacegramConfig()
    const threadConnections = this.config.getThreadConnections()
    this.threadConnectionsManager = new ThreadConnectionsManager(
      threadConnections,
    )
    this.exchangeManager = new ExchangeManager(
      this.threadConnectionsManager,
      this.serviceManager,
    )
  }

  async startBridge() {
    this.registerServices()
    await this.serviceManager.initiateServices()
  }

  async stopBridge() {
    await this.serviceManager.terminateServices()
  }

  registerServices() {
    // Get services from config/loadedServices and register then in service manager
    this.config.getLoadedServices().forEach((moduleName) => {
      const service = new (require('./services/' + moduleName) as any).default(
        this.config.getConfigForServiceName(moduleName.substr(0, moduleName.indexOf('/'))), this.exchangeManager, this.threadConnectionsManager)
      this.serviceManager.registerService(service)
    })
  }
}
