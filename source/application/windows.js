const electron = require('electron')

// data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E

class Windows {
  constructor() {
    console.log('Constructing application windows')

    
  }

  onappready() {
    // let window = new electron.BrowserWindow({width: 800, height: 600})
    //
    // window.loadURL('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E')
  }
}

module.exports = new Windows
