const fs = require('fs')
const Path = require('path')

const readdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (e, files) => {
      if (e) return reject(e)
      return resolve(files)
    })
  })
}

const stat = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (e, result) => {
      if (e) return reject(e)
      return resolve(result)
    })
  })
}


const tobuffer = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (e, result) => {
      if (e) return reject(e)
      return resolve(result)
    })
  })
}

const ExtensionHandler = {}

ExtensionHandler['.scss'] = (filename) => {
  return filename
}

class Assets {
  constructor() {
    console.log('Constructing assets')

    this.table = {}
    this.directory = Path.join(process.env.cwd, 'assets')

    this.read(this.directory)
    .then(async files => {
      for (let file of files) {
        let extension = Path.parse(file).ext

        let handler = ExtensionHandler[extension]
        let name = file.replace(this.directory, '').replace(/\\/g, '/')

        if (handler) {
          this.table[name] = handler(file)
        } else {
          this.table[name] = await tobuffer(file)
        }
      }

      Events.emit('assets')
    })
    .catch(e => {
      console.log('Assets e:', e)
    })
  }

  async read(path) {
    let result = []

    for (let filename of await readdir(path)) {
      let root = Path.join(path, filename)
      let entry = await stat(root)

      if (entry.isDirectory()) {
        result = result.concat(await this.read(root))
      } else {
        result.push(root)
      }
    }

    return result
  }
}

module.exports = new Assets
