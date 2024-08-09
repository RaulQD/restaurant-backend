import { Schema } from 'mongoose'

export const employeeSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  image: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})
