import BaseModel from './base'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  price           : { type: Schema.Types.Number, required: true },
  title           : { type: Schema.Types.String, required: true },
  city            : { type: Schema.Types.String, required: true },
  details         : { type: Schema.Types.String, required: true },
  rating          : { type: Schema.Types.Number, required: true },
  images          : [{ type: Schema.Types.String, required: true }],
  isRent          : { type: Schema.Types.Boolean, required: true },
  isNewStuff      : { type: Schema.Types.Boolean, required: true },
  priceNegotiating: { type: Schema.Types.Boolean, required: true },
  user            : {
    type: Schema.Types.ObjectId,
    ref : 'User',
  },
}, { timestamps: true, versionKey: false })

schema.loadClass(BaseModel)

global.Advertisement = mongoose.model('Advertisement', schema)