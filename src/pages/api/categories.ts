import type { NextApiRequest, NextApiResponse } from 'next'
import { Category, CategoryInterface } from '../../../models/Category'
import { mongooseConnect } from '../../../lib/mongoose'
import { isAdminRequest } from './auth/[...nextauth]'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  await mongooseConnect()
  await isAdminRequest(req, res)

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'))
  }

  if (method === 'POST') {
    // Create
    const { name, parentCategory, properties }: CategoryInterface = req.body
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties
    })
    res.json(categoryDoc)
  }
  if (method === 'PUT') {
    const { name, parentCategory, properties, _id }: CategoryInterface =
      req.body
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties
      }
    )
    res.json(categoryDoc)
  }

  if (method === 'DELETE') {
    const { _id } = req.query
    await Category.deleteOne({ _id })
    res.json('ok')
  }
}
