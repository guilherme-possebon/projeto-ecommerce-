import Layout from '@/Components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { CategoryInterface } from '../../models/Category'

export default function CategoriesPage() {
  const [editedCategory, setEditedCategory] =
    useState<CategoryInterface | null>(null)

  const [name, setName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState<CategoryInterface[]>([])

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data)
    })
  })

  async function saveCategory(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (name.length == 0) {
      alert('Nome invalido')
      return
    }
    let data = {}

    if (parentCategory.length == 0) {
      data = { name }
    } else {
      data = { name, parentCategory }
    }

    if (editedCategory) {
      await axios.put('/api/categories', { ...data, _id: editedCategory._id })
      setEditedCategory(null)
    } else {
      await axios.post('/api/categories', data)
    }
    setName('')
    setParentCategory('')
  }

  function editCategory(category: CategoryInterface) {
    setEditedCategory(category)
    setName(category.name)
    if (category.parent?._id != undefined) {
      setParentCategory(category.parent?._id)
    } else {
      setParentCategory('')
    }
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Editing category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          placeholder={'Category name'}
          className="mb-0"
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option>No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className="btn-primary mr-1"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button className="btn-primary">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  )
}
