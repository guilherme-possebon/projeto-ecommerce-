import { model, Schema, models } from 'mongoose'

export interface ProductInterface {
  title: string
  description: string
  price: number
  _id: string
}

const ProductShema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }
})

export const Product = models.Product || model('Product', ProductShema)
