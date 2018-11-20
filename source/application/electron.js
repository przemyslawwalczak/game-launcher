const { app } = require('electron')

class Electron {
  constructor() {
    app.on('ready', () => {
      Events.emit('electron-ready')
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      Events.emit('electron-ready')
    })
  }
}

module.exports = new Electron
