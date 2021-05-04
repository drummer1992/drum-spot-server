import mongoose from 'mongoose'

export const isObjectId = value => mongoose.isValidObjectId(value)
export const isEqualObjectIds = (a, b) => a && b && (a.toString() === b.toString())