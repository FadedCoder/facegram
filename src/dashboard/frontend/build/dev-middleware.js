const middleware = require('webpack-dev-middleware')
const compiler = webpack(require('./webpack.dev.conf'))

module.exports = middleware(compiler, {
  // webpack-dev-middleware options
})
