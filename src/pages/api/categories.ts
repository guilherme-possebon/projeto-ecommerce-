import type { NextApiRequest, NextApiResponse } from 'next'
import { Category, CategoryInterface } from '../../../models/Category'
import { mongooseConnect } from '../../../lib/mongoose'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  await mongooseConnect()

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'))
  }

  if (method === 'POST') {
    // Create
    const { name, parentCategory }: CategoryInterface = req.body
    const categoryDoc = await Category.create({ name, parent: parentCategory })
    res.json(categoryDoc)
  }

  if (method === 'DELETE') {
    // Deleta o produto
    if (req.query?.id) {
      await Category.deleteOne({ _id: req.query?.id })
      res.json(true)
    }
  }
}
