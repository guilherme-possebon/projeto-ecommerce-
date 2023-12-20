import mongoose, { Schema, model, models } from 'mongoose'
import { type Key } from 'react'

export interface CategoryInterface {
  id: Key | null | undefined
  name: string
  _id: string
  parent: { name: string; _id: string; properties: string[] }
  parentCategory: string
  properties: Array<{ name: string; values: string[] }>
}

const CategorySchema = new Schema({
  name: { type: String, require: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
  properties: { type: [{ type: Object }], default: undefined }
})

export const Category = models?.Category || model('Category', CategorySchema)
