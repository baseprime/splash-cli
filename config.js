const dotenv = require('dotenv')
const envConfig = dotenv.config()

Object.assign(process.env, envConfig.parsed || {})

function getEnv(key, defaultValue) {
    return 'undefined' !== typeof process.env[key] ? process.env[key] : defaultValue
}

const config = {
    PORT: getEnv('PORT', 3000),
    APP_NAME: getEnv('APP_NAME', 'CLI'),
}

exports = module.exports = {
    config,
    getEnv,
}
