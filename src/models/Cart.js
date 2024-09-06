import mongoose, { Schema, Types } from 'mongoose'

const cartSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  items: [
    {
      dishId: { type: Types.ObjectId, ref: 'Dishes', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
}, {
  timestamps: true,
  versionKey: false
})

export const Cart = mongoose.model('Cart', cartSchema)
