import mongoose, { Schema } from 'mongoose'

export const statusDishes = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}
export const availableDishes = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
}
const dishSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  originalPrice: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  images: { type: String },
  status: { type: String, enum: Object.values(statusDishes), default: statusDishes.ACTIVE },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
}, {
  timestamps: true
})

/* This code snippet is setting options for the JSON representation of the `dishSchema` when it is
converted to JSON. Here's what each option does: */
dishSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id
    delete ret.createdAt
    delete ret.updatedAt
  }
})

export const Dishes = mongoose.model('Dishes', dishSchema)
