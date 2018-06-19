import { FacegramConfig } from './FacegramConfig'
import { IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { FacegramService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { ServiceManager } from './ServiceManager'
import { ExchangeManager } from './ExchangeManager'
import DashboardServer from './dashboard/DashboardServer'

export class Facegram {
  config: FacegramConfig
  exchangeManager: ExchangeManager
  serviceManager = new ServiceManager()
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IFacegramMessage>
  dashboardServer = new DashboardServer()

  constructor() {
    this.config = new FacegramConfig()
  }

  async startBridge() {
    if (!this.config.configExists()) {
      // TODO: when dashboard config editor is finished start it even when config exists
      await this.dashboardServer.start()
    } else {
      const threadConnections = this.config.getThreadConnections()
      this.threadConnectionsManager = new ThreadConnectionsManager(
        threadConnections,
      )
      this.exchangeManager = new ExchangeManager(
        this.threadConnectionsManager,
        this.serviceManager,
      )
      this.registerServices()
      await this.serviceManager.initiateServices()
    }
  }

  async stopBridge() {
    await this.serviceManager.terminateServices()
  }

  registerServices() {
    // Get services from config/loadedServices and register then in service manager
    this.config.getLoadedServices().forEach(moduleName => {
      const service = new (require('./services/' + moduleName) as any).default(
        this.config.getConfigForServiceName(
          moduleName.substr(0, moduleName.indexOf('/')),
        ),
        this.exchangeManager,
        this.threadConnectionsManager,
      )
      this.serviceManager.registerService(service)
    })
  }
}
