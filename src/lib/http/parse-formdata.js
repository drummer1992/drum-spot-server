import path from 'path'
import fs from 'fs/promises'
import formidable from 'formidable'
import { InvalidArgumentsError } from '../../errors'
import { isEmpty } from 'schema-validator/predicates'
import { logWithContext } from '../context'

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

const parse = (req, destination) => new Promise((resolve, reject) => {
  const form = formidable({ uploadDir: path.resolve(__dirname, destination) })

  form.on('fileBegin', (name, file) => {
    file.path = form.uploadDir + '/' + file.name
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err.stack)

      return reject(new InvalidArgumentsError('Unable to parse form data'))
    }

    if (isEmpty(files) && isEmpty(fields)) {
      return reject(new InvalidArgumentsError('Empty form data provided'))
    }

    const parsed = parseFields(fields)

    logWithContext.info(parsed.body)

    return resolve({
      files : Object.values(files).map(f => f.path),
      fields: parsed,
    })
  })
})

export const parseFormData = async (req, destination) => {
  await fs.mkdir(destination, { recursive: true })

  return parse(req, destination)
}
