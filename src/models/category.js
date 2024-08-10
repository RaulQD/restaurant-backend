import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  available: { type: Boolean, default: true }
}, {
  timestamps: true
})

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id
    delete ret.createdAt
    delete ret.updatedAt
  }
})

export const Category = mongoose.model('Category', categorySchema)
