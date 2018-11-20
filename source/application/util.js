const Path = require('path')
const fs = require('fs')

class Util {
  static async readdir(path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (e, files) => {
        if (e) return reject(e)
        return resolve(files)
      })
    })
  }

  static async stat(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (e, result) => {
        if (e) return reject(e)
        return resolve(result)
      })
    })
  }


  static async tobuffer(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (e, result) => {
        if (e) return reject(e)
        return resolve(result)
      })
    })
  }

  static async recursively(path) {
    let result = []

    for (let filename of await this.readdir(path)) {
      let root = Path.join(path, filename)
      let entry = await this.stat(root)

      if (entry.isDirectory()) {
        result = result.concat(await this.recursively(root))
      } else {
        result.push(root)
      }
    }

    return result
  }
}

console.log(Util)

module.exports = Util
