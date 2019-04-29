const path = require('path')

let env = process.env.NODE_ENV || 'development'

const CONFIG = {
  production:{

  },
  development:{

  }
}

let config = Object.assign({}, CONFIG[env], {
  env,
  path_base: path.resolve(__dirname, '..'),
})

config.globals = {
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
}

module.exports = config