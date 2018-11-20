const fs = require('fs')
const Path = require('path')

const Util = require('application/util')
const sass = require('sass')

const ExtensionHandler = {}

ExtensionHandler['.scss'] = (filename) => {
  return sass.renderSync({
    file: filename
  }).css
}

class Assets {
  constructor() {
    console.log('Constructing assets')

    this.table = {}
    this.directory = Path.join(process.env.cwd, 'assets')

    Util.recursively(this.directory)
    .then(async files => {
      for (let file of files) {
        let extension = Path.parse(file).ext

        let handler = ExtensionHandler[extension]
        let name = file.replace(Path.join(this.directory, Path.sep), '').replace(/\\/g, '/')

        if (handler) {
          this.table[name] = handler(file)
        } else {
          this.table[name] = await Util.tobuffer(file)
        }
      }

      Events.emit('assets')
    })
    .catch(e => {
      console.log('Assets e:', e)
    })
  }
}

module.exports = new Assets
