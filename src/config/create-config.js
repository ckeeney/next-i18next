import defaultConfig, { isServer } from './default-config'

export default (userConfig) => {

  let combinedConfig = {
    ...defaultConfig,
    ...userConfig,
  }

  if (!userConfig.fallbackLng) {
    combinedConfig.fallbackLng = process.env.NODE_ENV === 'production'
      ? combinedConfig.defaultLanguage
      : false
  }

  combinedConfig.allLanguages = combinedConfig.otherLanguages
    .concat([combinedConfig.defaultLanguage])

  combinedConfig.ns = [combinedConfig.defaultNS]

  combinedConfig.whitelist = combinedConfig.allLanguages

  if (isServer) {
    const fs = eval("require('fs')")
    const path = require('path')

    const getAllNamespaces = p => fs.readdirSync(p).map(file => file.replace('.json', ''))
    const { allLanguages, defaultLanguage, localePath } = combinedConfig

    combinedConfig = {
      ...combinedConfig,
      preload: allLanguages,
      ns: getAllNamespaces(path.join(process.cwd(), `${localePath}/${defaultLanguage}`)),
    }
  }

  return combinedConfig

}
