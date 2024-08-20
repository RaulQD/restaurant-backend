import mongoose, { Schema, Types } from 'mongoose'

const addressSchema = new Schema({
  street: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  user: { ref: 'User', type: Types.ObjectId }
})

addressSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id
  }
})

export const Address = mongoose.model('Address', addressSchema)
