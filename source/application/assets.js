const fs = require('fs')
const Path = require('path')

const Util = require('application/util')
const Templates = require('application/templates')
const Windows = require('application/windows')

const sass = require('sass')

const ExtensionHandler = {}

ExtensionHandler['.scss'] = (filename) => {
  return sass.renderSync({
    file: filename
  }).css.toString()
}

ExtensionHandler['.css'] = (filename) => {
  return fs.readFileSync(filename, 'utf8')
}

const express = require('express')
const http = require('http')
const application = express()

const server = http.createServer(application)

application.use('/static/style', (request, response) => {
  let name = request.url.substring(1)

  let filename = Path.parse(name)

  let handler = ExtensionHandler[filename.ext]

  if (!handler) {
    throw new Error(`should we handle '${filename.ext}'?`)
  }

  let result = handler(Path.join(process.env.cwd, 'assets', 'style', filename.dir, filename.base))

  response.status(200).end(result)
})

application.use('/static', express.static('assets'))

const Mustache = require('mustache')

let templates = express.Router()

templates.use((request, response) => {
  let name = request.url.substring(1)

  let window = Windows.reference[request.query.reference]

  if (!window) {
    throw new Error('We got no window to display, as this should crash our application')
  }

  let template = Templates.get(window.template)

  if (!template) {
    throw new Error('template not found for window')
  }

  response.status(200).end(Mustache.render(template, window.view, Templates.partials))
})

application.use('/template', templates)

server.listen(null, 'localhost', () => {
  let address = server.address()

  console.log('Assets listening on:', address)

  module.exports.address = address.address
  module.exports.port = address.port

  Events.emit('assets')
})
