import mongoose, { Schema, model } from 'mongoose'
import { type Key } from 'react'

export interface CategoryInterface {
  id: Key | null | undefined
  name: string
  _id: string | boolean
  parent: string & { name: string; _id: string }
  parentCategory: string
  properties: Array<{ name: string; values: string }>
}

const CategorySchema = new Schema({
  name: { type: String, require: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
  properties: { type: [{ type: Object }], default: undefined }
})

export const Category = model('Category', CategorySchema)
