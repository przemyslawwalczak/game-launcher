const EventEmitter = require('events')

class Events extends EventEmitter {
  constructor() {
    super()
  }

  async all(...events) {
    return new Promise((resolve, reject) => {
      for (let event of events) {
        let listener = () => {
          events.splice(events.indexOf(event), 1)
          if (events.length === 0) {
            resolve()
          }
        }

        this.once(event, listener)
      }
    })
  }
}

module.exports = new Events
