var pug = require('pug')
var env = process.env.NODE_ENV
var required_fields = require('../contact/validate_these_fields')
var render = pug.compileFile('assets/markup/index.pug', { pretty: false })

module.exports = serve_microsite

function serve_microsite (req, res, locals) {
  var xhr = req.headers['x-requested-with'] === 'XMLHttpRequest'

  locals = locals || {}
  locals.data = locals.data || {}
  locals.status = locals.status || 200
  locals.required_fields = {}
  required_fields.forEach(field => { locals.required_fields[field] = true })
  var status_code = locals.status
  var status_msg = locals.status && locals.status !== 200 ? locals.message : 'OK'

  if (xhr) {
    res.writeHead(status_code, status_msg, {
      'Content-Type': 'application/json'
    })
    res.end(locals)
  } else {
    var html = render(locals)
    res.writeHead(status_code, status_msg, {
      'Content-Type': 'text/html'
    })
    return res.end(html)
  }
}
