import mongoose, { Schema, models, model } from 'mongoose'
import { Key } from 'react'

export interface CategoryInterface {
  id: Key | null | undefined
  name: string
  _id: string
  parent: string & { name: string; _id: string }
  parentCategory: string
  properties: { name: string; values: string }[]
}

const CategorySchema = new Schema({
  name: { type: String, require: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
  properties: { type: [{ type: Object }], default: undefined }
})

export const Category = models?.Category || model('Category', CategorySchema)
