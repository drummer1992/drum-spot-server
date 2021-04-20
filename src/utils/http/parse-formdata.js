import path from 'path'
import formidable from 'formidable'
import { InvalidArgumentsError } from '../../errors'
import { isEmpty } from 'schema-validator/predicates'

const parseFields = fields => {
  try {
    const keys = Object.keys(fields)

    return keys.length
      ? fields = keys.reduce(
        (res, key) => ({ ...res, [key]: JSON.parse(fields[key]) }),
        {},
      )
      : fields
  } catch {
    return fields
  }
}

export const parseFormData = (req, destination) => new Promise((resolve, reject) => {
  const form = formidable({ uploadDir: path.resolve(__dirname, destination) })

  form.on('fileBegin', (name, file) => {
    file.path = form.uploadDir + '/' + file.name
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err.stack)

      return reject(new InvalidArgumentsError('Unable to parse form data'))
    }

    if (isEmpty(files)) {
      return reject(new InvalidArgumentsError('Empty form data provided'))
    }

    return resolve({
      files : Object.values(files).map(f => f.path),
      fields: parseFields(fields),
    })
  })
})
