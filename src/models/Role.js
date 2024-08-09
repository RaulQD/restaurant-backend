import mongoose, { Schema } from 'mongoose'

const roleSchema = new Schema({
  name: { type: String, required: true, trim: true }
})

roleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id
    delete ret.createdAt
    delete ret.updatedAt
  }
})

export const Role = mongoose.model('Role', roleSchema)
