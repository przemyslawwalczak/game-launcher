const Mustache = require('mustache')
const Path = require('path')
const Util = require('application/util')
const fs = require('fs')

class Templates {
  constructor() {
    this.directory = Path.join(process.env.cwd, 'templates')

    this.partials = {}

    Util.recursively(this.directory)
    .then(templates => {
      for (let template of templates) {
        let name = template.replace(Path.join(this.directory, Path.sep), '').replace(/\\/g, '/')

        let o = Path.parse(name)

        this.partials[Path.join(o.dir, o.name).replace(/\\/g, '/')] = fs.readFileSync(template, 'utf8')
      }

      Events.emit('templates')
    })
    .catch(e => {
      console.log(e)
    })
  }

  get(name) {
    return this.partials[name]
  }
}

module.exports = new Templates
