import mongoose, { Schema } from 'mongoose'

const dishSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  originalPrice: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  images: { type: String, required: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
}, {
  timestamps: true
})

export const Dishes = mongoose.model('Dishes', dishSchema)
