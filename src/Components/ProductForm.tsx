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
  _id?: string
  images?: File
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images
}: ExistingType) {
  const [title, setTitle] = useState(existingTitle)
  const [description, setDescription] = useState(existingDescription)
  const [price, setPrice] = useState(existingPrice)
  const [goToProducts, setGoToProducts] = useState(false)

  const router = useRouter()

  async function saveProduct(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    const data = { title, description, price }

    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id })
    } else {
      //create
      await axios.post('/api/products', data)
    }
    setGoToProducts(true)
  }

  if (goToProducts) {
    router.push('/products')
  }

  return (
    <form onSubmit={saveProduct}>
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
      <label htmlFor="Photo">Photos</label>
      <div className="mb-2">
        <label className="w-24 h-24 border text-center flex flex-col items-center justify-center text-gray-500 gap-1 text-sm rounded-lg bg-gray-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
          <input type="file" name="image-file" id="image-file" className='hidden' />
        </label>
        {!images && <div>No photos in this produtcs</div>}
      </div>
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
