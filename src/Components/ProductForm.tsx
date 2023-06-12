import axios from 'axios'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../services/firebase'
export interface ExistingType {
  title?: string
  description?: string
  price?: string
  _id?: string
  images?: File[]
  url?: string
  category?: string
}
export interface ImageFile extends File {
  name: string
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  category: assignedCategory
}: ExistingType) {
  // ------------------Produto------------------
  const [title, setTitle] = useState(existingTitle || '')
  const [category, setCategory] = useState(assignedCategory || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const [productUrls, setProductUrls] = useState<string[]>([])
  const [goToProducts, setGoToProducts] = useState<boolean>(false)
  const [categories, setCategories] = useState([])

  const router = useRouter()
  {
    /* -----------------------------------------------Salvar Produto----------------------------------------------- */
  }
  async function saveProduct(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    const data = { title, description, price, productUrls, category }

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

  // ------------------Imagem------------------
  const [files, setFiles] = useState<ImageFile[]>([])
  const [progress, setProgress] = useState<number>(0)

  const metadata = {
    contentType: 'image/jpeg'
  }

  {
    /* -----------------------------------------------Adicionar Foto----------------------------------------------- */
  }
  function addProductPhoto(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files)
      setFiles(selectedFiles)

      selectedFiles.forEach((selectedFile) => {
        const storageRef = ref(storage, selectedFile.name)
        const uploadTask = uploadBytesResumable(
          storageRef,
          selectedFile,
          metadata
        )

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgress(progress)
          },
          (error) => {
            switch (error.code) {
              case 'storage/unauthorized':
                break
              case 'storage/canceled':
                break
              case 'storage/unknown':
                break
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProductUrls((prevProductUrls) => [
                ...prevProductUrls,
                downloadURL
              ])
            })
          }
        )
      })
    }
  }

  function deleteImage(index: number) {
    const updatedUrls = productUrls.filter((url, i) => i !== index)
    setProductUrls(updatedUrls)

    const updatedFiles = files.filter((file, i) => i !== index)
    setFiles(updatedFiles)
  }

  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    } else {
      axios.get('/api/products?id=' + id).then((response) => {
        const { productUrls } = response.data
        setProductUrls(productUrls)
      })
    }
  }, [id])

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data)
    })
  })

  return (
    <form onSubmit={saveProduct}>
      {/* -----------------------------------------------Nome do produto----------------------------------------------- */}
      <label htmlFor="product-name">
        Nome do produto
        <input
          type="text"
          name="product-name"
          id="product-name"
          placeholder="Nome do produto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      {/* -----------------------------------------------Categorias----------------------------------------------- */}
      <label htmlFor="Category-label">
        Categoria
        <select
          name="Category-label"
          id="Category-label"
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
        >
          <option value="">Sem categoria</option>
          {categories.length > 0 &&
            categories.map((c: { _id: string; name: string }) => (
              <option value={c._id} key={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </label>
      {/* -----------------------------------------------Fotos----------------------------------------------- */}
      <label htmlFor="Photo">
        Fotos
        <div className="mb-2 text-black">
          <div>
            {progress > 0
              ? `Upload ${progress.toFixed()}% concluido`
              : 'Fazer upload da imagem:'}
            <label>
              <input
                type="file"
                name="image-file"
                id="image-file"
                className="file-input"
                accept="image/*"
                multiple
                onChange={addProductPhoto}
              />
            </label>
          </div>

          {/* -----------------------------------------------Fotos infos----------------------------------------------- */}
          <div className="image-infos">
            {productUrls?.map((url, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-end "
              >
                <img
                  src={url}
                  alt={`Uploaded Image ${index + 1}`}
                  className="w-24 h-min"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => deleteImage(index)}
                  className="btn-default mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
                <a href={url} target="_blank" className="text-gray-400">
                  {index}
                </a>
              </div>
            ))}
          </div>
        </div>
      </label>
      {/* -----------------------------------------------Descrição----------------------------------------------- */}
      <label htmlFor="description">
        Descrição
        <textarea
          name="description"
          id="description"
          placeholder="Descrição"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
      </label>
      {/* -----------------------------------------------Preço----------------------------------------------- */}
      <label htmlFor="price">
        Preço (in R$)
        <input
          type="number"
          name="price"
          id="price"
          placeholder="Preço"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
      </label>
      <button className="btn-primary" type="submit">
        Salvar
      </button>
    </form>
  )
}
