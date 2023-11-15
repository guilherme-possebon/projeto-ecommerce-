import Layout from '@/Components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { type ProductInterface } from '../../../../models/Product'
import { useProductContext } from '@/Context/ProductContext'

export default function DeleteProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [productInfo, setProductInfo] = useState<ProductInterface>()
  const { setProductDeleted } = useProductContext()
  const idParam = Array.isArray(id) ? id.join(',') : id

  useEffect(() => {
    if (id === undefined) {
      return
    }
    axios
      .get(`/api/products?id=${idParam}`)
      .then((response) => {
        setProductInfo(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [id, idParam])

  function goBack() {
    void router.push('/products')
  }

  async function deleteProduct() {
    try {
      await axios.delete(`/api/products?id=${idParam}`)
      setProductDeleted(true)
      goBack()
    } catch (error) {
      // Handle the error here
    }
  }

  // TODO testar para ver se esta tudo certo aqui "&quot{productInfo?.title}&ldquo?"
  return (
    <Layout>
      <h1 className="text-center">
        Você realmente quer deletar o produto &quot{productInfo?.title}&ldquo?
      </h1>

      <div className="flex gap-2 justify-center">
        <button onClick={() => deleteProduct} autoFocus className="btn-red">
          Sim
        </button>
        <button onClick={goBack} className="btn-default">
          Não
        </button>
      </div>
    </Layout>
  )
}
