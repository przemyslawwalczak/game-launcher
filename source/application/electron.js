const { app } = require('electron')
const Windows = require('application/windows')

class Electron {
  constructor() {
    app.on('ready', () => {
      Events.emit('electron-ready')
    })

    app.on('window-all-closed', () => {
      if (Windows.locked) {
        Events.once('windows-state-stored', () => {
          app.quit()
        })
      } else {
        app.quit()
      }
    })

    app.on('activate', () => {
      Events.emit('electron-ready')
    })
  }
}

module.exports = new Electron
