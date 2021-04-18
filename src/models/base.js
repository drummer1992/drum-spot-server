import { notFoundAssert } from '../errors'
import { toSentenceCase } from '../utils/string'

class BaseModel {
  async fetch(props) {
    const entity = await this.constructor.findById(this._id, props)

    const entityName = toSentenceCase(this.constructor.collection.collectionName).slice(0, -1)

    notFoundAssert(entity, `${entityName} not found`)

    return entity
  }
}

export default BaseModel
