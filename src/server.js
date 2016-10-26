process.env.VUE_ENV = 'server'

import fs from 'fs'
import express from 'express'
import { stripIndent } from 'common-tags'
import { createBundleRenderer } from 'vue-server-renderer'

// create the bundle renderer for server-side rendering
// NOTE: not sure why `./dist/` is required in this subpath,
// considering server.js (this file) is output to the `./dist/`
// folder when compiled by webpack - but leaving it out breaks things
const renderer = createBundleRenderer(
  fs.readFileSync('./dist/renderer.js', 'utf8')
)

const app = express()

const renderMarkup = ({ title, markup }) => stripIndent`
  <!doctype html>
  <html lang="en">
    <head>
      <title>${title || 'Hello World'}</title>
    </head>
    <body>
      ${markup}
      <script src="/vendor.js"></script>
      <script src="/bundle.js"></script>
    </body>
  </html>
`

const renderError = (error) => renderMarkup({
  markup: `<h2>500 Error: ${error.message}</h2><pre>${error.stack}</pre>`,
  title: 'Oops!'
})

// NOTE: not sure why `./dist/` is required in this subpath,
// considering server.js (this file) is output to the `./dist/`
// folder when compiled by webpack - but leaving it out breaks things
app.use(express.static('./dist/assets'))

// forward route handling to server-side bundle renderer
app.get('*', (req, res) => {
  renderer.renderToString({ url: req.url }, (error, markup) => {
    if (error) {
      res.status(500).send(renderError(error))
    } else {
      res.send(renderMarkup({ markup }))
    }
  })
})

app.listen(5000, () => console.log('listening on port 5000'))
