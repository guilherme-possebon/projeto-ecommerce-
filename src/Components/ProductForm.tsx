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
  images?: File
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
  const [producturl, setProductUrl] = useState<string>('')
  const [goToProducts, setGoToProducts] = useState<boolean>(false)
  const [categories, setCategories] = useState([])

  const router = useRouter()
  {
    /* -----------------------------------------------Salvar Produto----------------------------------------------- */
  }
  async function saveProduct(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    const data = { title, description, price, producturl, category }

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
  const [file, setFile] = useState<ImageFile | undefined>()
  const [progress, setProgress] = useState<number>(0)

  const metadata = {
    contentType: 'image/jpeg'
  }

  {
    /* -----------------------------------------------Adicionar Foto----------------------------------------------- */
  }
  function addProductPhoto(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)

      // TODO Fazer para que seja possivel fazer upload mais de uma imagem por produto

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
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
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
            console.log('File available at', downloadURL)
            setProductUrl(downloadURL)
          })
        }
      )
    }
  }

  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    } else {
      axios.get('/api/products?id=' + id).then((response) => {
        const { producturl } = response.data
        setProductUrl(producturl)
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
              <option value={c._id}>{c.name}</option>
            ))}
        </select>
      </label>
      {/* -----------------------------------------------Fotos----------------------------------------------- */}
      <label htmlFor="Photo">
        Fotos
        <div className="mb-2 text-black">
          {producturl?.length === 0 ? (
            <>
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
                    onChange={addProductPhoto}
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              {/* -----------------------------------------------Fotos infos----------------------------------------------- */}
              <div className="image-infos">
                <img src={producturl} alt="" className="w-96" loading="lazy" />

                <div className="flex gap-4">
                  <a href={producturl} target="_blank">
                    Link da imagem
                  </a>
                  <label>
                    Trocar Imagem
                    <input
                      type="file"
                      name="image-file"
                      id="image-file"
                      accept="image/*"
                      onChange={addProductPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </>
          )}
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
