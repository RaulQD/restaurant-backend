import mongoose, { Schema, Types } from 'mongoose'

const orderSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      dishId: { type: Types.ObjectId, ref: 'Dishes', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  orderStatus: {
    type: String,
    enum: ['pendiente', 'procesada', 'enviada', 'entregada', 'cancelada'],
    default: 'pendiente'
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Estado del pago
  paymentDetails: { // Detalles del pago de Mercado Pago
    paymentId: { type: String },
    paymentType: { type: String },
    status: { type: String },
    statusDetail: { type: String }
  },
  deliveryAddress: {
    street: String,
    number: String,
    provinces: String,
    department: String,
    district: String
  }
}, {
  timestamps: true
})

export const Orders = mongoose.model('Orders', orderSchema)
