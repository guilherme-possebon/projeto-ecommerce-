import axios from 'axios'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../services/firebase'

interface ExistingType {
  existingTitle?: object | string
  title?: string
  existingDescription?: object | string
  description?: string
  existingPrice?: object | string
  price?: string
  _id?: string
  images?: File
  url?: string
}
interface ImageFile extends File {
  name: string
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  url: existingUrl
}: ExistingType) {
  // ------------------Produto------------------
  const [title, setTitle] = useState(existingTitle)
  const [description, setDescription] = useState(existingDescription)
  const [price, setPrice] = useState(existingPrice)
  const [goToProducts, setGoToProducts] = useState(false)
  const [url, seturl] = useState(existingUrl)
  const [productUrl, setProductUrl] = useState<string>('')

  const urlwoh = url?.split('https://').pop()
  console.log(urlwoh, 1)

  const router = useRouter()

  async function saveProduct(ev: { preventDefault: () => void }) {
    ev.preventDefault()
    const data = { title, description, price, urlwoh }

    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id })
      console.log(data, 'update')
    } else {
      //create
      await axios.post('/api/products', data)
      console.log(data, 'create')
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

  function addProductPhoto(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)

      const storageRef = ref(storage, 'images/' + selectedFile.name)
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
          console.log('Upload is ' + progress + '% done')
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
            seturl(downloadURL)
          })
        }
      )
    }
  }

  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/api/products?id=' + id).then((response) => {
      const { urlwoh } = response.data
      setProductUrl(urlwoh)
    })
  }, [id])

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
        {productUrl?.length > 0 ? 
         (
          <div>
            <img src={`https://${productUrl}`} alt="" className='w-96' />
          </div>
        )
         : 
        (<label className="add-image-btn">
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
          <input
            type="file"
            name="image-file"
            id="image-file"
            className="hidden"
            onChange={addProductPhoto}
          />
        </label>)
        }
        <a href={`https://${productUrl}`} target='_blank'>Link da imagem</a>
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
