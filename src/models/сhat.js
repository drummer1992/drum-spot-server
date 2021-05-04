import mongoose, { Schema } from 'mongoose'
import BaseModel from './base'

const chatMessageSchema = new Schema({
  text    : {
    type    : Schema.Types.String,
    required: true,
  },
  viewed  : {
    type   : Schema.Types.Boolean,
    default: false,
  },
  senderId: {
    type    : Schema.Types.ObjectId,
    required: true,
  },
  chatId  : {
    type    : Schema.Types.ObjectId,
    required: true,
  },
}, { timestamps: true, versionKey: false })

const chatSchema = new Schema({
  participants: [{
    type    : Schema.Types.ObjectId,
    ref     : 'User',
    required: true,
  }],
  messages    : [{
    type: Schema.Types.ObjectId,
    ref : 'ChatMessage',
  }],
}, { timestamps: true, versionKey: false })

class Chat extends BaseModel {
  hasUnreadMessages(userId) {
    return this.messages.some(msg => !msg.viewed && msg.senderId === userId)
  }
}

chatSchema.loadClass(Chat)
chatMessageSchema.loadClass(BaseModel)

global.Chat = mongoose.model('Chat', chatSchema)
global.ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)
