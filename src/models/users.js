import mongoose, { Schema } from 'mongoose'

export const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ['ADMIN_ROLE', 'USER_ROLE', 'EMPLOYEE_ROLE'], default: 'USER_ROLE' }
})

export const User = mongoose.model('User', userSchema)
