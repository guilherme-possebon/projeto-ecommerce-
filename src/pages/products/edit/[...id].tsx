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
      setProductInfo(response.data)
    })
  }, [id])

  return (
    <Layout>
      <h1>Editar produto</h1>
      {Object.keys(productInfo).length > 0 ? (
        <ProductForm {...productInfo} />
      ) : (
        <div>Carregando edição do produto...</div>
      )}
    </Layout>
  )
}
