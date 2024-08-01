import mongoose, { Schema } from 'mongoose'

export const clientSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  image: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

export const Client = mongoose.model('Client', clientSchema)
