import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface ExistingType {
  existingTitle?: object | string
  title?: string
  existingDescription?: object | string
  description?: string
  existingPrice?: object | string
  price?: string
}


export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice
}:ExistingType) {

  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice ||'')
  const [goToProducts, setGoToProducts] = useState(false)
  const router = useRouter()

  async function createProduct(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    const data = { title, description, price }
    await axios.post('/api/products', data)
    setGoToProducts(true)
  }
  if (goToProducts) {
    router.push('/products')
  }

  return (
    <form onSubmit={createProduct}>
      <label htmlFor="product-name">
        Product name
        <input
          type="text"
          name="product-name"
          id="product-name"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label htmlFor="description">
        Description
        <textarea
          name="description"
          id="description"
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
      </label>
      <label htmlFor="price">
        Price (in R$)
        <input
          type="text"
          name="price"
          id="price"
          placeholder="price"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
      </label>
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  )
}
