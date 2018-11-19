const Application = require('application')
const Attributes = require('application/attributes')
const Path = require('path')

const { BrowserWindow } = require('electron')

console.log(Application)

class Window {
  constructor(name) {
    this.attributes = new Attributes(Path.join('windows', name + '.yaml'), Application.attributes)
    this.instance = new BrowserWindow(this.attributes)

    this.instance.loadURL('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E')

    return new Promise((resolve, reject) => {
      this.instance.on('ready-to-show', () => {
        this.instance.show()
        resolve(this)
      })
    })
  }
}

module.exports = Window
