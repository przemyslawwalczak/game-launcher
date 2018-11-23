const { app } = require('electron')

const Window = require('application/window')

class Boot {
  constructor() {
    console.log('Booting application')

    Events.all('electron-ready', 'templates', 'assets', 'windows')
    .then(() => {
      new Window('main')
      .then(window => {

      })
      .catch(e => {
        console.log(e)
      })
    })
  }
}

module.exports = new Boot
