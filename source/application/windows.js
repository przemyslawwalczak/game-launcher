const electron = require('electron')
const storage = require('node-persist')

class Windows {
  constructor() {
    this.reference = {}
    this.state = {}

    this.restore()
    .then(() => {
      console.log('Done restoring windowses')
    })
    .catch(e => {
      console.log('Windows could not be restored due:', e)
    })

    this.locked = false

    this.queue = []
  }

  store(window) {
    this.state[window.namespace] = window.state

    if (this.locked) {
      if (this.queue.indexOf(window) === -1) {
        this.queue.push(window)
      }
      return
    }

    this.locked = true

    storage.setItem('window-states', this.state)
    .then(result => {
      this.locked = false

      if (this.queue.length) {
        this.store.apply(this, this.queue.splice(0, 1))
      }

      Events.emit('windows-state-stored')
    })
    .catch(e => {
      console.log(e)
    })
  }

  async restore() {
    await storage.init()

    this.state = await storage.getItem('window-states') || {}

    Events.emit('windows')
  }

}

module.exports = new Windows
