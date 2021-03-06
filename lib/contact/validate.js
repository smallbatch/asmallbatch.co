var required_fields = require('./validate_these_fields')

module.exports = validate

function validate (body) {
  return new Promise(function (resolve, reject) {
    if (!body) { return resolve(body) }

    var errors = validation(body)
    if (!errors) { return resolve(body) }

    return reject({
      status: 400,
      message: 'There are errors in your form submission. Please review the fields below.',
      data: body,
      errors: errors
    })
  })
}

function validation (body) {
  if (required_fields.length === 0) { return }

  var errors = {}
  required_fields.forEach(field => {
    field = field.trim()
    if (typeof body[field] !== 'string' || body[field].length === 0) {
      errors[field] = 'A value is required for this field.'
      return
    }

    if (field === 'email') {
      var email_error = validate_email(body[field])
      if (email_error) { errors[field] = 'A valid email address is required.' }
      return
    }
  })

  if (Object.keys(errors).length === 0) { return null }
  return errors
}

function validate_email (value) {
  return (!value.match(/^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5}$/))
}
