import BaseModel from './base'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  id    : { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId },
}, { timestamps: false, versionKey: false })

schema.index({ id: 1, userId: 1 }, { unique: true })

schema.loadClass(BaseModel)

global.Favorite = mongoose.model('Favorite', schema)