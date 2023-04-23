import Layout from '@/Components/Layout'
import ProductForm from '@/Components/ProductForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState({})

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/api/products?id=' + id).then((response) => {
      console.log(response.data)
      setProductInfo(response.data)
    })
  }, [id])
  console.log(productInfo, 1)

  return (
    <Layout>
      <h1>Edit product</h1>

      <ProductForm {...productInfo} />
    </Layout>
  )
}
