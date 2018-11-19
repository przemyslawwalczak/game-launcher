const Mustache = require('mustache')
const Path = require('path')

class Templates {
  constructor() {
    this.directory = Path.join(process.env.cwd, 'templates')

    
// Mustache.render("{{title}} spends {{calc}}", view)
  }
}

module.exports = new Templates
