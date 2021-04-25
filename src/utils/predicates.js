import mongoose from 'mongoose'

export const isObjectId = value => mongoose.isValidObjectId(value)