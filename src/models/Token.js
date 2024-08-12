import mongoose, { Schema } from 'mongoose'

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  expiresAt: {
    type: Date,
    default: Date.now(),
    expires: '10m' // EXPIRA EN 10 MINUTOS
  }
})

export const Token = mongoose.model('Token', tokenSchema)
