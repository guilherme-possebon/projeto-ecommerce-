import { model, Schema, models } from 'mongoose'

export interface ProductInterface {
  title: string
  description: string
  price: number | string
  _id: string
  producturl: string
}

const ProductShema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  producturl: { type: String, required: false}
})

export const Product = models.Product || model('Product', ProductShema)
