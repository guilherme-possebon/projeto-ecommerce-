import axios from 'axios'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import Swal from 'sweetalert2'
import { storage } from '../../services/firebase'
import LoadingSvg from '@/../public/Loading.svg'
import { useProductContext } from '@/Context/ProductContext'
export interface ExistingType {
  title?: string
  description?: string
  price?: string
  _id?: string
  images?: File[]
  url?: string
  selectedCategory?: string
  productProperties?: ProductProperties
}
export interface ImageFile extends File {
  name: string
  lastModified: number
}

interface ProductProperties {
  [key: string]: string
}

interface Category {
  _id: string
  name: string
  properties: { name: string; values: string[] }[]
  parent: object & { name: string; properties: string[]; _id: string }
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  selectedCategory: assignedCategory,
  productProperties: assignedProperties
}: ExistingType) {
  // ------------------Produto------------------
  const [title, setTitle] = useState(existingTitle || '')
  const [selectedCategory, setSelectedCategory] = useState(
    assignedCategory || ''
  )
  const [productProperties, setProductProperties] = useState<ProductProperties>(
    assignedProperties || {}
  )
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')

  const [productUrls, setProductUrls] = useState<string[]>([])
  const [goToProducts, setGoToProducts] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { setProductSaved } = useProductContext()
  const { setProductCreated } = useProductContext()

  const router = useRouter()

  {
    /* -----------------------------------------------Salvar Produto----------------------------------------------- */
  }
  async function saveProduct(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    const data = {
      title,
      description,
      price,
      productUrls,
      selectedCategory,
      productProperties
    }

    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id })
    } else {
      //create
      await axios.post('/api/products', data)
    }
    setGoToProducts(true)
    setProductSaved(true)
    if (isNewProduct) {
      setProductCreated(true)
    } else setProductSaved(true)
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
        const fileName = title + ' ' + selectedFile.name + ' ' + new Date()
        const storageRef = ref(storage, fileName)
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
  {
    /* -----------------------------------------------Deletar Foto----------------------------------------------- */
  }
  async function deleteImage(index: number) {
    const fileUrlToDelete = productUrls[index]

    const storageRef = ref(storage, fileUrlToDelete)

    await deleteObject(storageRef)
      .then(() => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true
        })

        Toast.fire({
          icon: 'success',
          title: 'Deletado com sucesso!'
        })
      })
      .catch((err) => {
        const specificError = 'storage/object-not-found'

        if (err instanceof Error && err.message.includes(specificError)) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          })

          Toast.fire({
            icon: 'error',
            title: 'Imagem não encontrada no banco de dados'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Erro: ${err}`
          })
        }
      })

    const updatedUrls = productUrls.filter((url, i) => i !== index)
    setProductUrls(updatedUrls)

    const updatedFiles = files.filter((file, i) => i !== index)
    setFiles(updatedFiles)
  }

  const { id } = router.query

  const [isLoadedProducts, setIsLoadedProducts] = useState<boolean>(false)
  const [isLoadedCategories, setIsLoadedCategories] = useState<boolean>(false)
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false)

  switch (true) {
    case router.pathname === '/products/edit/[...id]':
      useEffect(() => {
        if (!id) {
          return
        } else {
          axios.get('/api/products?id=' + id).then((response) => {
            const {
              productUrls,
              category
            }: { productUrls: string[]; category: string } = response.data
            setProductUrls(productUrls)
            setSelectedCategory(category)
            setIsLoadedProducts(true)
          })
        }
      }, [id])

      useEffect(() => {
        axios.get('/api/categories').then((result) => {
          setCategories(result.data)
          setIsLoadedCategories(true)
        })
      }, [])
      break
    case router.pathname === '/products/new':
      useEffect(() => {
        axios.get('/api/categories').then((result) => {
          setCategories(result.data)
          setIsLoadedCategories(true)
          setIsLoadedProducts(true)
          setIsNewProduct(true)
        })
      }, [])

      break
  }

  let propertiesToFill: {
    values: string[]
    name: string
  }[] = []

  if (categories.length > 0 && selectedCategory) {
    let catInfo: Category | undefined = categories.find(
      ({ _id }) => _id === selectedCategory
    )

    if (catInfo) {
      propertiesToFill.push(...(catInfo?.properties || []))
      while (catInfo?.parent?._id) {
        const parentCategory = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        )
        if (parentCategory) {
          propertiesToFill.push(...(parentCategory.properties || []))
          catInfo = parentCategory
        }
      }
    }
  }

  function setProductProp(propName: string, value: string) {
    setProductProperties((prev) => ({
      ...prev,
      [propName]: value
    }))
  }

  if (progress === 100) {
    setTimeout(() => {
      setProgress(0)
    }, 1000)
  }

  return (
    <form onSubmit={saveProduct}>
      {isLoadedCategories && isLoadedProducts ? (
        <>
          {/* -----------------------------------------------Nome do produto----------------------------------------------- */}
          <div className="mb-2">
            <label htmlFor="product-name">
              Nome do produto
              <input
                type="text"
                name="product-name"
                id="product-name"
                placeholder="Nome do produto"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          {/* -----------------------------------------------Categorias----------------------------------------------- */}
          <label className="CategoryLabel" htmlFor="Category-label">
            Categoria
            <select
              name="Category-label"
              id="Category-label"
              value={selectedCategory}
              onChange={(ev) => setSelectedCategory(ev.target.value)}
            >
              <option key={'0'} value="">
                Sem categoria
              </option>
              {categories.length > 0 &&
                categories.map((c: { _id: string; name: string }) => (
                  <option value={c._id} key={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
            {propertiesToFill.length > 0 &&
              propertiesToFill.map((p, index) => (
                <div key={index} className="text-black dark:textDarkMode">
                  <p className="pName">
                    {p.name[0].toUpperCase() + p.name.substring(1)}:
                  </p>

                  <select
                    name="propertiesValues"
                    id="propertiesValues"
                    onChange={(ev) => setProductProp(p.name, ev.target.value)}
                    value={productProperties[p.name]}
                  >
                    {p.values?.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </label>
          <label htmlFor="Photo">
            Fotos
            <div className="mb-2 text-black dark:textDarkMode flex">
              {/* -----------------------------------------------Fotos infos----------------------------------------------- */}
              <div className="image-infos">
                {productUrls?.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end"
                  >
                    <img
                      src={url}
                      alt={`Imagem não encontrada`}
                      className="object-contain h-28 w-28 p-2 bg-white shadow-sm rounded-sm border border-gray-200"
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
                      {index + 1}
                    </a>
                  </div>
                ))}
                {/* -----------------------------------------------Add Fotos----------------------------------------------- */}

                <label htmlFor="image-file">
                  <input
                    type="file"
                    name="image-file"
                    id="image-file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={addProductPhoto}
                  />
                  <div className="image-file">
                    {progress > 0 ? (
                      <>
                        <div className="p-2">
                          <LoadingSvg />
                        </div>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                          />
                        </svg>
                        Upload
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </label>
          {/* -----------------------------------------------Descrição----------------------------------------------- */}
          <div className="mb-2">
            <label htmlFor="description">
              Descrição
              <textarea
                name="description"
                id="description"
                placeholder="Descrição"
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="dark:textDarkMode"
              ></textarea>
            </label>
          </div>
          {/* -----------------------------------------------Preço----------------------------------------------- */}
          <div className="mb-4">
            <label htmlFor="price">
              Preço (em R$)
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Preço"
                required
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </label>
          </div>
          <button className="btn-primary" type="submit">
            {isNewProduct ? 'Criar' : 'Salvar'}
          </button>
        </>
      ) : (
        <>
          <LoadingSvg />
        </>
      )}
    </form>
  )
}
