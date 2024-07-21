import mongoose, { Schema } from 'mongoose'

export const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  available: { type: Boolean, default: true }
}, {
  timestamps: true
})

export const Category = mongoose.model('Category', categorySchema)
