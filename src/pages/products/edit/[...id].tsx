import Layout from '@/Components/Layout'
import ProductForm from '@/Components/ProductForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState({})
  const [showComponent, setShowComponent] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/api/products?id=' + id).then((response) => {
      setProductInfo(response.data)
    })
    setTimeout(() => {
      setShowComponent(true)
    }, 80)
  }, [id])
  console.log( productInfo )

  return (
    <Layout>
      <h1>Edit product</h1>
      {showComponent && <ProductForm {...productInfo} />}
    </Layout>
  )
}
