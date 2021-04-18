import BaseModel from './base'
import mongoose, { Schema } from 'mongoose'
import { Gender, Role } from '../constants/user'
import { generateHash, generateSalt } from '../utils/crypto'

const schema = new Schema({
  role             : {
    type: Schema.Types.String,
    enum: Object.values(Role),
  },
  yearCommercialExp: {
    type   : Schema.Types.Number,
    default: 0,
  },
  countOfJobs      : {
    type   : Schema.Types.Number,
    default: 0,
  },
  phone            : {
    type     : Schema.Types.String,
    maxLength: 30,
  },
  name             : {
    type     : Schema.Types.String,
    maxLength: 80,
  },
  facebookId       : {
    type     : Schema.Types.String,
    maxLength: 30,
    index    : {
      unique                 : true,
      partialFilterExpression: { facebookId: { $type: 'string' } },
    },
  },
  googleId         : {
    type     : Schema.Types.String,
    maxLength: 30,
    index    : {
      unique                 : true,
      partialFilterExpression: { googleId: { $type: 'string' } },
    },
  },
  gender           : {
    type   : Schema.Types.String,
    enum   : Object.values(Gender),
    default: Gender.MALE,
  },
  dob              : {
    type: Schema.Types.Date,
  },
  email            : {
    type     : Schema.Types.String,
    maxLength: 250,
    index    : {
      unique                 : true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
  },
  imageURL         : {
    type: Schema.Types.String,
  },
  hash             : {
    type  : Schema.Types.String,
    select: false,
  },
  salt             : {
    type  : Schema.Types.String,
    select: false,
  },
  lastSeen         : {
    type   : Schema.Types.Date,
    default: Date.now,
  },
  isActive         : {
    type   : Schema.Types.Boolean,
    default: true,
  },
}, { timestamps: true, versionKey: false })

class UserModel extends BaseModel {
  async setPassword(password) {
    this.salt = generateSalt()
    this.hash = await generateHash(password, this.salt)
  }

  async validatePassword(password) {
    return this.hash === await generateHash(password, this.salt)
  }
}

schema.loadClass(UserModel)

global.User = mongoose.model('User', schema)
