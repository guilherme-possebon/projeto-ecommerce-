import type { NextApiRequest, NextApiResponse } from 'next'
import { Category, type CategoryInterface } from '../../../models/Category'
import { mongooseConnect } from '../../../lib/mongoose'
import { isAdminRequest } from './auth/[...nextauth]'
import mongoose from 'mongoose'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongooseConnect()
    await isAdminRequest(req, res)

    const { method } = req

    if (method === 'GET') {
      const categories = await Category.find().populate('parent')

      res.json(categories)
    } else if (method === 'POST') {
      const { name, parentCategory, properties }: CategoryInterface = req.body

      const parentToUpdate =
        parentCategory && parentCategory.length > 0
          ? new mongoose.Types.ObjectId(parentCategory)
          : undefined

      try {
        const createdCategory = await Category.create({
          name,
          parent: parentToUpdate,
          properties
        })

        console.log(createdCategory, 'createdCategory')
        res.json(createdCategory)
      } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Validation Error' })
      }
    } else if (method === 'PUT') {
      const { name, parentCategory, properties, _id }: CategoryInterface =
        req.body

      const parentToUpdate =
        parentCategory && parentCategory.length > 0
          ? new mongoose.Types.ObjectId(parentCategory)
          : undefined

      const categoryDoc = await Category.updateOne(
        { _id },
        {
          name,
          parent: parentToUpdate,
          properties
        }
      )

      res.json(categoryDoc)
    } else if (method === 'DELETE') {
      const deletedCategoryId = req.query?._id
      await Category.deleteOne({ _id: deletedCategoryId })
      res.json('ok')
    } else {
      res.status(405).json({ error: 'Method Not Allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
