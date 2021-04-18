import BaseModel from './base'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  imageURL      : Schema.Types.String,
  name          : { type: Schema.Types.String, maxLength: 80 },
  hash          : { type: Schema.Types.String, select: false },
  salt          : { type: Schema.Types.String, select: false },
  isActive      : { type: Schema.Types.Boolean, default: true },
  lastSeen      : { type: Schema.Types.Date, default: Date.now },
  facebookId    : {
    type     : Schema.Types.String,
    maxLength: 30,
    index    : {
      unique                 : true,
      partialFilterExpression: { facebookId: { $type: 'string' } },
    },
  },
  email         : {
    type     : Schema.Types.String,
    maxLength: 250,
    index    : {
      unique                 : true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
  },
  advertisements: [{
    type: Schema.Types.ObjectId,
    ref : 'Advertisement',
  }],
}, { timestamps: true, versionKey: false })

schema.loadClass(BaseModel)

global.User = mongoose.model('User', schema)
