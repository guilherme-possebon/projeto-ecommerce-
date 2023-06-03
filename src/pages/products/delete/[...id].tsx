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
  async function deleteProduct() {
    await axios.delete('/api/products?id=' + id)
    goBack()
  }

  return (
    <Layout>
      <h1 className="text-center">
        Você realmente quer deletar o produto "{productInfo?.title}"?
      </h1>

      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          Sim
        </button>
        <button onClick={goBack} className="btn-default">
          Não
        </button>
      </div>
    </Layout>
  )
}
