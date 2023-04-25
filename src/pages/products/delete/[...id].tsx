import Layout from '@/Components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ProductInterface } from '../../../../models/Product'

export default function DeleteProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [productInfo, setProductInfo] = useState<ProductInterface>()

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/api/products?id=' + id).then((response) => {
      setProductInfo(response.data)
    })
  }, [id])

  function goBack() {
    router.push('/products')
  }

  return (
    <Layout>
      <h1>Do tou really wanna delete "{productInfo?.title}"?</h1>
      <div className="flex gap-2">

      <button className="btn-red">Yes</button>

      <button onClick={goBack} className="btn-default">
        No
      </button>
      </div>
    </Layout>
  )
}
