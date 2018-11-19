const { app } = require('electron')

const Window = require('application/window')

class Boot {
  constructor() {
    console.log('Booting application')


    console.log(Window)

    app.on('ready', async () => {
      let window = await new Window('main')

      console.log(window)
    })

    //
    // Events.all('application', 'assets')
    // .then(() => {
    //   console.log('all ready')
    // })
    // .catch(e => {
    //
    // })
  }
}

module.exports = new Boot
