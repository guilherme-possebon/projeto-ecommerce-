import { model, Schema, models } from 'mongoose'


export interface ProductInterface {
  title: string
  description: string
  price: number | string
  _id: string
  urlwoh: string
}

const ProductShema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  urlwoh: { type: String, required: true}
})

export const Product = models.Product || model('Product', ProductShema)
