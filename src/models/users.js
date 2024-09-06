import mongoose, { Schema, Types } from 'mongoose'

const userSchema = new Schema({
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dni: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  address: [{
    type: Types.ObjectId,
    ref: 'Address'
  }],
  // cart: [{
  //   dishId: { type: Types.ObjectId, ref: 'Dishes' },
  //   quantity: {
  //     type: Number, required: true, min: 1
  //   }
  // }],
  image: { type: String },
  roles: [{ ref: 'Role', type: Types.ObjectId }]
}, {
  timestamps: true
})

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id
    delete ret.password
  }
})

export const User = mongoose.model('User', userSchema)
