const YAML = require('js-yaml')
const _ = require('lodash')
const Path = require('path')
const fs = require('fs')

class Attributes {
  constructor(path, parent = {}) {
    if (typeof parent === 'object') {
      _.merge(this, _.cloneDeep(parent))
    }

    _.merge(this, YAML.safeLoad(fs.readFileSync(Path.join(process.env.cwd, path), 'utf8')))
  }
}

module.exports = Attributes
