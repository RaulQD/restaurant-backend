import { Schema, Types } from 'mongoose'

const orderSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  items: { type: Array, required: true },
  amoount: { type: Number, required: true }
})
