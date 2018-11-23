const Application = require('application')
const Attributes = require('application/attributes')
const Windows = require('application/windows')
const Assets = require('application/assets')
const Path = require('path')
const _ = require('lodash')

const { BrowserWindow } = require('electron')
const Mustache = require('mustache')

const fs = require('fs')
const querystring = require('querystring')
const URL = require('url')
const uuid = require('uuid')

class Window extends BrowserWindow {
  constructor(name, parent = null) {
    let attributes = new Attributes(Path.join('windows', name + '.yaml'), null || Application.attributes)
    let namespace = attributes.namespace || '@/' + name
    let state = Windows.state[namespace] || {}

    attributes.parent = parent

    let instate = attributes['use state'] || false

    // TODO: If the window appears in unseen section of the space. Move `this` window to the master screen at center!

    if (instate && (state.x || state.y)) {
      attributes.center = false
    }

    _.merge(attributes, state)

    super(attributes)

    this.namespace = namespace
    this.state = state
    this.attributes = attributes

    this.template = attributes.template || name

    this.view = {}

    this.view.attribute = this.attributes
    this.view.cwd = process.env.cwd

    this.contents = this.webContents

    this.reference = uuid.v4()

    let input = {}

    input.hostname = Assets.address
    input.port = Assets.port
    input.pathname = '/template/' + this.template
    input.protocol = 'http:'
    input.query = {
      reference: this.reference
    }

    Windows.reference[this.reference] = this

    this.loadURL(URL.format(input))

    this.on('move', (e) => {
      let [x, y] = this.getPosition()

      if (this.state.x !== x || this.state.y !== y) {
        this.state.x = x
        this.state.y = y

        Windows.store(this)
      }
    })

    this.on('maximize', () => {
      this.state.infullscreen = true
      Windows.store(this)
    })

    this.on('unmaximize', () => {
      this.state.infullscreen = false
      Windows.store(this)
    })

    this.on('closed', () => {
      delete Windows.reference[this.reference]
    })

    return new Promise((resolve) => {
      this.once('ready-to-show', () => {
        if (this.state.infullscreen) {
          this.maximize()
        } else {
          this.show()
        }

        this.focus()
        resolve(this)
      })
    })
  }
}

module.exports = Window
