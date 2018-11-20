const Application = require('application')
const Attributes = require('application/attributes')
const Templates = require('application/templates')
const Assets = require('application/assets')
const Path = require('path')

const { BrowserWindow } = require('electron')
const Mustache = require('mustache')

const fs = require('fs')
const querystring = require('querystring')

class Window extends BrowserWindow {
  constructor(name, parent = null) {
    let attributes = new Attributes(Path.join('windows', name + '.yaml'), null || Application.attributes)

    attributes.parent = parent

    super(attributes)

    this.attributes = attributes

    this.template = Templates.get(attributes.template || name)

    this.view = {}

    this.view.attribute = this.attributes

    this.result = Mustache.render(this.template, this.view, Templates.partials)

    this.contents = this.webContents

    this.loadURL('data:text/html,' + querystring.escape(this.result))

    return new Promise((resolve) => {
      this.once('ready-to-show', () => {
        this.contents.insertCSS(Assets.table[attributes.css].toString())
        this.show()
        this.focus()
        resolve(this)
      })
    })
  }
}

module.exports = Window
