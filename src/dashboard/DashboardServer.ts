import express from 'express'
import log from 'npmlog'
import http from 'http'

export default class DashboardServer {
  app: express.Application
  nativeServer: http.Server
  async start() {
    this.app = express()
    if (process.env.DASHBOARD_DEV) {
      log.info('dashboard', 'Dashboard will be running in dev mode')
      this.app.use(require('./frontend/build/dev-middleware'))
    } else {
      throw new Error('Dashboard build mode not yet')
    }
    await new Promise(res => this.app.listen(44444, 'localhost', res))
    log.info('dashboard', 'Dashboard is listening on http://localhost:44444')
  }

  async stop() {
    this.nativeServer.close()
    log.info('dashboard', 'Dashboard stopped')
  }
}
